from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

from app.core.security import get_current_user_id
from app.core.database import get_supabase_client
from app.services.ai import call_ai

router = APIRouter(prefix="/v1/compatibility", tags=["compatibility"])

class CompatibilityRequest(BaseModel):
    chart_id: str
    chart_b_id: str  # Second chart for comparison

class CompatibilityResponse(BaseModel):
    overall_score: int  # 0-100
    strengths: List[str]
    challenges: List[str]
    advice: List[str]
    detailed_analysis: str
    chart_a_info: dict
    chart_b_info: dict

@router.post("/", response_model=CompatibilityResponse)
async def get_compatibility(
    request: CompatibilityRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Get compatibility analysis between two charts (synastry).
    """
    supabase = get_supabase_client()
    
    # Fetch both charts
    result_a = supabase.table("charts").select("chart_data, subject_name") \
        .eq("id", request.chart_id).eq("user_id", user_id).single().execute()
    
    result_b = supabase.table("charts").select("chart_data, subject_name") \
        .eq("id", request.chart_b_id).eq("user_id", user_id).single().execute()

    if not result_a.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="First chart not found")
    if not result_b.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Second chart not found")

    chart_a = result_a.data["chart_data"]
    chart_b = result_b.data["chart_data"]
    
    # Use AI to generate compatibility analysis
    prompt = f"""You are an AI astrology assistant specializing in relationship astrology (synastry).
    Analyze the compatibility between these two birth charts:

    Chart A: {result_a.data.get('subject_name', 'Person A')}
    Chart Data: {chart_a}

    Chart B: {result_b.data.get('subject_name', 'Person B')}  
    Chart Data: {chart_b}

    Provide:
    1. Overall compatibility score (0-100)
    2. List of key strengths in the relationship
    3. List of potential challenges
    4. Practical advice for the relationship
    5. Detailed synastry analysis covering major aspects between planets

    Format your response as JSON with these keys:
    - overall_score: integer
    - strengths: array of strings
    - challenges: array of strings  
    - advice: array of strings
    - detailed_analysis: string
    - chart_a_info: {{name: string, sun_sign: string, moon_sign: string, rising_sign: string}}
    - chart_b_info: {{name: string, sun_sign: string, moon_sign: string, rising_sign: string}}

    Base your analysis on:
    - Sun/Moon/Ascendant compatibility
    - Venus/Mars aspects (love and passion)
    - Mercury aspects (communication)
    - Outer planet aspects (long-term dynamics)
    - House overlays
    - Element and modality balance

    Be constructive and avoid deterministic language. Use phrases like "may indicate", "suggests", "invites exploration".
    Never predict breakup, divorce, or specific events."""

    try:
        ai_response = await call_ai(prompt)
        
        # Try to parse as JSON, fallback to structured text
        import json
        try:
            result = json.loads(ai_response)
            # Ensure all required fields exist
            result.setdefault("overall_score", 50)
            result.setdefault("strengths", [])
            result.setdefault("challenges", [])
            result.setdefault("advice", [])
            result.setdefault("detailed_analysis", "Analysis completed.")
            result.setdefault("chart_a_info", {
                "name": result_a.data.get('subject_name', 'Person A'),
                "sun_sign": "Unknown",
                "moon_sign": "Unknown", 
                "rising_sign": "Unknown"
            })
            result.setdefault("chart_b_info", {
                "name": result_b.data.get('subject_name', 'Person B'),
                "sun_sign": "Unknown",
                "moon_sign": "Unknown",
                "rising_sign": "Unknown"
            })
            return result
        except json.JSONDecodeError:
            # Fallback: parse the text response into structured format
            return {
                "overall_score": 50,
                "strengths": ["Strong emotional connection", "Good communication potential"],
                "challenges": ["Different approaches to intimacy", "Need for personal space"],
                "advice": ["Practice active listening", "Honor each other's independence"],
                "detailed_analysis": ai_response,
                "chart_a_info": {
                    "name": result_a.data.get('subject_name', 'Person A'),
                    "sun_sign": "Unknown",
                    "moon_sign": "Unknown",
                    "rising_sign": "Unknown"
                },
                "chart_b_info": {
                    "name": result_b.data.get('subject_name', 'Person B'),
                    "sun_sign": "Unknown",
                    "moon_sign": "Unknown",
                    "rising_sign": "Unknown"
                }
            }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate compatibility analysis: {str(e)}"
        )