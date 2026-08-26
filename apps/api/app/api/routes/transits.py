from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any

from app.core.security import get_current_user_id
from app.core.database import get_supabase_client
from app.services.transits import calculate_transits

router = APIRouter(prefix="/v1/transits", tags=["transits"])

class TransitRequest(BaseModel):
    chart_id: str

class TransitResponse(BaseModel):
    current_planets: list[dict]
    active_transits: list[dict]
    transit_dates: dict[str, list[str]]
    metadata: dict

@router.post("/", response_model=TransitResponse)
async def get_transits(
    request: TransitRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Get current transits for a given natal chart.
    """
    supabase = get_supabase_client()
    result = supabase.table("charts").select("chart_data") \
        .eq("id", request.chart_id).eq("user_id", user_id).single().execute()

    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chart not found")

    chart_data = result.data["chart_data"]
    transits = calculate_transits(chart_data)
    return transits