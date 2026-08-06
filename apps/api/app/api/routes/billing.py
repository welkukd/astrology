from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional
import os

from app.core.security import get_current_user_id
from app.core.database import get_supabase_client
from app.core.config import get_settings

settings = get_settings()
router = APIRouter(prefix="/v1/billing", tags=["billing"])

try:
    import stripe
    stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
except ImportError:
    stripe = None  # type: ignore

STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://astrology-web-tawny.vercel.app")

# Price IDs — create these in Stripe Dashboard first
PRICE_PRO_MONTHLY = os.getenv("STRIPE_PRICE_PRO_MONTHLY", "")  # $4.99/mo
PRICE_PRO_YEARLY = os.getenv("STRIPE_PRICE_PRO_YEARLY", "")    # $39.99/yr
PRICE_LIFETIME = os.getenv("STRIPE_PRICE_LIFETIME", "")         # $29.99 one-time


class CheckoutRequest(BaseModel):
    price_id: str
    mode: str = "subscription"  # "subscription" or "payment"


def _check_stripe():
    if stripe is None:
        raise HTTPException(status_code=503, detail="Stripe not installed")
    if not stripe.api_key:
        raise HTTPException(status_code=503, detail="Stripe not configured")


@router.post("/checkout")
async def create_checkout(data: CheckoutRequest, user_id: str = Depends(get_current_user_id)):
    _check_stripe()

    supabase = get_supabase_client()

    # Get or create Stripe customer
    user_result = supabase.table("subscriptions").select("stripe_customer_id") \
        .eq("user_id", user_id).maybe_single().execute()

    customer_id = None
    if user_result and user_result.data and user_result.data.get("stripe_customer_id"):
        customer_id = user_result.data["stripe_customer_id"]

    if not customer_id:
        user_info = supabase.auth.admin.get_user_by_id(user_id)
        email = user_info.user.email if user_info and user_info.user else None

        customer = stripe.Customer.create(
            email=email,
            metadata={"supabase_user_id": user_id},
        )
        customer_id = customer.id

        supabase.table("subscriptions").upsert({
            "user_id": user_id,
            "stripe_customer_id": customer_id,
            "status": "none",
        }, on_conflict="user_id").execute()

    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        line_items=[{"price": data.price_id, "quantity": 1}],
        mode=data.mode,
        success_url=f"{FRONTEND_URL}/dashboard?checkout=success",
        cancel_url=f"{FRONTEND_URL}/pricing?checkout=cancelled",
        metadata={"supabase_user_id": user_id},
        allow_promotion_codes=True,
    )

    return {"url": session.url, "session_id": session.id}


@router.post("/webhook")
async def stripe_webhook(request: Request):
    if stripe is None:
        raise HTTPException(status_code=503, detail="Stripe not installed")
    if not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=503, detail="Webhook secret not configured")

    body = await request.body()
    sig = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(body, sig, STRIPE_WEBHOOK_SECRET)
    except (stripe.error.SignatureVerificationError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid signature")

    supabase = get_supabase_client()

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session.get("metadata", {}).get("supabase_user_id")
        if user_id:
            _handle_checkout_complete(supabase, session, user_id)

    elif event["type"] == "customer.subscription.updated":
        sub = event["data"]["object"]
        _handle_subscription_update(supabase, sub)

    elif event["type"] == "customer.subscription.deleted":
        sub = event["data"]["object"]
        _handle_subscription_cancel(supabase, sub)

    elif event["type"] == "invoice.payment_failed":
        invoice = event["data"]["object"]
        customer_id = invoice.get("customer")
        if customer_id:
            supabase.table("subscriptions") \
                .update({"status": "past_due"}) \
                .eq("stripe_customer_id", customer_id).execute()

    return Response(status_code=200)


def _handle_checkout_complete(supabase, session, user_id):
    customer_id = session.get("customer")
    subscription_id = session.get("subscription")

    if subscription_id:
        sub = stripe.Subscription.retrieve(subscription_id)
        plan_id = sub["items"]["data"][0]["price"]["id"]
        period_end = sub["current_period_end"]

        supabase.table("subscriptions").upsert({
            "user_id": user_id,
            "stripe_customer_id": customer_id,
            "stripe_subscription_id": subscription_id,
            "status": sub["status"],
            "plan_id": plan_id,
            "current_period_end": period_end,
            "cancel_at_period_end": sub.get("cancel_at_period_end", False),
        }, on_conflict="user_id").execute()
    else:
        supabase.table("subscriptions").upsert({
            "user_id": user_id,
            "stripe_customer_id": customer_id,
            "status": "active",
            "plan_id": "lifetime",
        }, on_conflict="user_id").execute()


def _handle_subscription_update(supabase, sub):
    customer_id = sub.get("customer")
    supabase.table("subscriptions").update({
        "status": sub["status"],
        "current_period_end": sub.get("current_period_end"),
        "cancel_at_period_end": sub.get("cancel_at_period_end", False),
    }).eq("stripe_customer_id", customer_id).execute()


def _handle_subscription_cancel(supabase, sub):
    customer_id = sub.get("customer")
    supabase.table("subscriptions").update({
        "status": "cancelled",
        "plan_id": None,
    }).eq("stripe_customer_id", customer_id).execute()


@router.get("/status")
async def get_billing_status(user_id: str = Depends(get_current_user_id)):
    supabase = get_supabase_client()
    result = supabase.table("subscriptions").select("*") \
        .eq("user_id", user_id).maybe_single().execute()

    if not result or not result.data:
        return {
            "plan": "free",
            "status": "active",
            "charts_used": _count_charts(supabase, user_id),
            "charts_limit": 3,
        }

    sub = result.data
    is_pro = sub.get("status") == "active" and sub.get("plan_id")

    return {
        "plan": "pro" if is_pro else "free",
        "status": sub.get("status", "none"),
        "plan_id": sub.get("plan_id"),
        "current_period_end": sub.get("current_period_end"),
        "cancel_at_period_end": sub.get("cancel_at_period_end", False),
        "charts_used": _count_charts(supabase, user_id),
        "charts_limit": -1 if is_pro else 3,
    }


@router.post("/portal")
async def create_portal(user_id: str = Depends(get_current_user_id)):
    _check_stripe()

    supabase = get_supabase_client()
    result = supabase.table("subscriptions").select("stripe_customer_id") \
        .eq("user_id", user_id).maybe_single().execute()

    if not result or not result.data or not result.data.get("stripe_customer_id"):
        raise HTTPException(status_code=404, detail="No billing account found")

    session = stripe.billing_portal.Session.create(
        customer=result.data["stripe_customer_id"],
        return_url=f"{FRONTEND_URL}/dashboard",
    )

    return {"url": session.url}


def _count_charts(supabase, user_id: str) -> int:
    result = supabase.table("charts").select("id", count="exact") \
        .eq("user_id", user_id).execute()
    return result.count or 0
