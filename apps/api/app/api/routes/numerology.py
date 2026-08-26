from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any

from app.core.security import get_current_user_id
from app.core.database import get_supabase_client
from app.services.numerology import get_numerology_report

router = APIRouter(prefix="/v1/numerology", tags=["numerology"])

class NumerologyRequest(BaseModel):
    full_name: str
    birthdate: str  # YYYY-MM-DD

class NumerologyResponse(BaseModel):
    life_path: dict
    expression: dict
    heart_desire: dict
    personality: dict
    birth_day: dict
    birthdate: str
    full_name: str

@router.post("/", response_model=NumerologyResponse)
async def get_numerology(
    request: NumerologyRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Get a numerology report based on name and birthdate.
    """
    # We don't require chart_id for numerology, but we can optionally save it if needed.
    # For now, just compute and return.
    try:
        report = get_numerology_report(
            birthdate=request.birthdate,
            full_name=request.full_name
        )
        return report
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating the numerology report."
        )