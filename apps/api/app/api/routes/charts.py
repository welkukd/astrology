from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timezone

from app.schemas.birth_data import BirthData
from app.services.calculator import calculate_chart
from app.core.security import get_current_user_id
from app.core.database import get_supabase_client

router = APIRouter(prefix="/v1", tags=["charts"])


@router.post("/natal")
async def create_natal_chart(data: BirthData, user_id: str = Depends(get_current_user_id)):
    try:
        print(f"Creating chart for user {user_id} with data: {data.model_dump()}", flush=True)
        chart = calculate_chart(
            date_str=data.date,
            time_str=data.time,
            time_unknown=data.time_unknown,
            latitude=data.latitude,
            longitude=data.longitude,
            timezone_str=data.timezone,
            zodiac=data.zodiac.value,
            house_system=data.house_system.value,
            ayanamsa=data.ayanamsa.value if data.ayanamsa else None,
        )

        chart["subject"]["name"] = data.name

        supabase = get_supabase_client()
        chart_hash = chart["chart_id"]
        print(f"Chart calculated: {chart_hash}, planets: {len(chart.get('planets', []))}, houses: {len(chart.get('houses', []))}, aspects: {len(chart.get('aspects', []))}", flush=True)

        result = supabase.table("charts").upsert({
            "id": chart["chart_id"],
            "user_id": user_id,
            "chart_hash": chart_hash,
            "subject_name": data.name or "Me",
            "birth_datetime_utc": f"{data.date}T{data.time or '12:00'}:00Z",
            "birth_latitude": data.latitude,
            "birth_longitude": data.longitude,
            "birth_timezone": data.timezone,
            "time_unknown": data.time_unknown,
            "zodiac_system": data.zodiac.value,
            "house_system": data.house_system.value,
            "ayanamsa": data.ayanamsa.value if data.ayanamsa else None,
            "chart_data": chart,
        }, on_conflict="user_id,chart_hash").execute()
        print(f"Upsert result: {result}", flush=True)

        return chart

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print(f"CHART ERROR: {e}\n{tb}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{type(e).__name__}: {e}")


@router.get("/charts")
async def list_user_charts(user_id: str = Depends(get_current_user_id)):
    supabase = get_supabase_client()
    result = supabase.table("charts") \
        .select("id, subject_name, birth_datetime_utc, created_at") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .execute()
    return result.data


@router.get("/charts/{chart_id}")
async def get_chart(chart_id: str, user_id: str = Depends(get_current_user_id)):
    supabase = get_supabase_client()
    result = supabase.table("charts").select("*") \
        .eq("id", chart_id).eq("user_id", user_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chart not found")
    return result.data["chart_data"]


@router.delete("/charts/{chart_id}")
async def delete_chart(chart_id: str, user_id: str = Depends(get_current_user_id)):
    supabase = get_supabase_client()
    result = supabase.table("charts").delete() \
        .eq("id", chart_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chart not found")
    return {"message": "Chart deleted"}


@router.post("/charts/{chart_id}/export")
async def export_chart(chart_id: str, user_id: str = Depends(get_current_user_id)):
    supabase = get_supabase_client()
    result = supabase.table("charts").select("*") \
        .eq("id", chart_id).eq("user_id", user_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chart not found")
    chart_data = result.data["chart_data"]
    chart_data["exported_at"] = datetime.now(timezone.utc).isoformat()
    return chart_data
