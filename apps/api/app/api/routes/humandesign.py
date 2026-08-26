import time
from datetime import datetime, date
from typing import Any, Dict, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from app.core.config import get_settings
from app.core.database import get_supabase_client
from app.core.security import get_current_user_id
from app.schemas.humandesign import (
    HDAuthority,
    HDCenter,
    HDCenterStatus,
    HDChannel,
    HDChartResponse,
    HDChartSummary,
    HDChartListResponse,
    HDDefinitionType,
    HDGate,
    HDIncarnationCross,
    HDProfile,
    HDProfileLine,
    HDType,
    HDVariable,
)
from app.services.ai import call_ai_json
from app.services.humandesign_engine import (
    calculate_bodygraph,
    calculate_chart_hash,
    generate_bodygraph_svg,
    get_all_centers,
    get_all_channels,
    get_all_gates,
    get_cross_details,
    get_profile_details,
    get_variables_details,
    interpret_chart_with_ai,
)

# Type alias for Supabase response
SupabaseResult = Dict[str, Any]

router = APIRouter(prefix="/v1/humandesign", tags=["humandesign"])

settings = get_settings()

# Rate limiting (in-memory, per user)
_rate_limits: Dict[str, List[float]] = {}
_MAX_REQUESTS = settings.RATE_LIMIT_REQUESTS  # 60
_WINDOW_SECONDS = settings.RATE_LIMIT_WINDOW  # 60


def _check_rate_limit(user_id: str) -> None:
    """Raise HTTP 429 if user has exceeded rate limit."""
    now = time.time()
    timestamps = _rate_limits.get(user_id, [])
    # Prune timestamps older than window
    _rate_limits[user_id] = [t for t in timestamps if now - t < _WINDOW_SECONDS]
    if len(_rate_limits[user_id]) >= _MAX_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded: max {_MAX_REQUESTS} requests per minute.",
        )
    _rate_limits[user_id].append(now)


# ============================================
# Request/Response Models
# ============================================

class HDChartGenerateRequest(BaseModel):
    """Request to generate a Human Design chart."""
    subject_name: str = Field(default="Me", max_length=100)
    birth_datetime_utc: datetime
    birth_latitude: float = Field(..., ge=-90, le=90)
    birth_longitude: float = Field(..., ge=-180, le=180)
    birth_timezone: str = Field(..., min_length=3)
    time_unknown: bool = False


class HDChartGenerateResponse(BaseModel):
    """Response for chart generation."""
    chart_id: UUID
    hd_type: HDType
    authority: HDAuthority
    profile: str
    incarnation_cross: str
    bodygraph_svg: str
    definition_summary: Dict[str, Any]
    definition_type: HDDefinitionType
    strategy: str
    signature: str
    not_self_theme: str


class HDInterpretRequest(BaseModel):
    """Request for AI interpretation of a Human Design chart."""
    chart_id: UUID
    focus: Optional[str] = Field(None, description="Optional focus area: 'type', 'authority', 'profile', 'cross', 'centers', 'channels', 'gates', 'variables', 'deconditioning'")
    question: Optional[str] = Field(None, max_length=2000, description="Specific question about the chart")


class HDInterpretResponse(BaseModel):
    """Response for AI interpretation."""
    interpretation_id: UUID
    chart_id: UUID
    focus: Optional[str]
    question: Optional[str]
    interpretation: Dict[str, Any]
    model: str
    created_at: datetime


class CentersListResponse(BaseModel):
    """Response for centers list."""
    centers: List[HDCenter]


class ChannelsListResponse(BaseModel):
    """Response for channels list."""
    channels: List[HDChannel]


class GatesListResponse(BaseModel):
    """Response for gates list."""
    gates: List[HDGate]


class ProfileDetailsResponse(BaseModel):
    """Response for profile details."""
    profile: str
    conscious_line: HDProfileLine
    unconscious_line: HDProfileLine
    description: Optional[str] = None
    keynotes: List[str] = Field(default_factory=list)


class CrossDetailsResponse(BaseModel):
    """Response for incarnation cross details."""
    name: str
    conscious_sun_gate: int
    conscious_earth_gate: int
    unconscious_sun_gate: int
    unconscious_earth_gate: int
    quarter: str
    theme: Optional[str] = None


class VariablesDetailsResponse(BaseModel):
    """Response for variables (PHS) details."""
    variables: List[HDVariable]


# ============================================
# CHART ENDPOINTS
# ============================================

@router.post("/chart", response_model=HDChartGenerateResponse, status_code=status.HTTP_201_CREATED)
async def generate_chart(
    request: HDChartGenerateRequest,
    user_id: str = Depends(get_current_user_id),
):
    """
    Generate a Human Design chart from birth data.
    Returns chart_id, type, authority, profile, cross, bodygraph_svg, definition_summary.
    Caches bodygraph by birth_data hash.
    """
    _check_rate_limit(user_id)

    supabase = get_supabase_client()

    # Prepare birth data for hash calculation
    birth_data = {
        "birth_datetime_utc": request.birth_datetime_utc.isoformat(),
        "birth_latitude": request.birth_latitude,
        "birth_longitude": request.birth_longitude,
        "birth_timezone": request.birth_timezone,
        "time_unknown": request.time_unknown,
    }
    chart_hash = calculate_chart_hash(birth_data)

    # Check if chart already exists for this user (by hash)
    existing = supabase.table("hd_charts").select("*").eq("user_id", user_id).eq("chart_hash", chart_hash).execute()
    if existing.data:
        chart_data = existing.data[0]
        return HDChartGenerateResponse(
            chart_id=UUID(chart_data["id"]),
            hd_type=HDType(chart_data["hd_type"]),
            authority=HDAuthority(chart_data["authority"]),
            profile=chart_data["profile"],
            incarnation_cross=chart_data["incarnation_cross"],
            bodygraph_svg=generate_bodygraph_svg(chart_data["bodygraph_data"]),
            definition_summary=chart_data["bodygraph_data"].get("definition_summary", {}),
            definition_type=HDDefinitionType(chart_data["definition_type"]) if chart_data.get("definition_type") else HDDefinitionType.SINGLE,
            strategy=chart_data["strategy"],
            signature=chart_data["signature"],
            not_self_theme=chart_data["not_self_theme"],
        )

    try:
        # Calculate the bodygraph
        bodygraph_data = calculate_bodygraph(birth_data)

        # Extract key computed fields
        hd_type = bodygraph_data["hd_type"]
        authority = bodygraph_data["authority"]
        profile = bodygraph_data["profile"]
        incarnation_cross = bodygraph_data["incarnation_cross"]
        definition_type = bodygraph_data["definition_type"]
        strategy = bodygraph_data["strategy"]
        signature = bodygraph_data["signature"]
        not_self_theme = bodygraph_data["not_self_theme"]
        definition_summary = bodygraph_data.get("definition_summary", {})

        # Generate bodygraph SVG
        bodygraph_svg = generate_bodygraph_svg(bodygraph_data)

        # Prepare full chart data for storage
        chart_data = {
            **birth_data,
            "hd_type": hd_type,
            "authority": authority,
            "profile": profile,
            "incarnation_cross": incarnation_cross,
            "definition_type": definition_type,
            "strategy": strategy,
            "signature": signature,
            "not_self_theme": not_self_theme,
            "bodygraph_data": bodygraph_data,
            "design_data": bodygraph_data.get("design_data"),
            "personality_data": bodygraph_data.get("personality_data"),
        }

        # Save to Supabase
        insert_data = {
            "user_id": user_id,
            "subject_name": request.subject_name,
            "birth_datetime_utc": request.birth_datetime_utc.isoformat(),
            "birth_latitude": request.birth_latitude,
            "birth_longitude": request.birth_longitude,
            "birth_timezone": request.birth_timezone,
            "time_unknown": request.time_unknown,
            "hd_type": hd_type,
            "authority": authority,
            "profile": profile,
            "incarnation_cross": incarnation_cross,
            "bodygraph_data": bodygraph_data,
            "definition_type": definition_type,
            "strategy": strategy,
            "signature": signature,
            "not_self_theme": not_self_theme,
            "chart_data": chart_data,
            "chart_hash": chart_hash,
            "design_data": bodygraph_data.get("design_data"),
            "personality_data": bodygraph_data.get("personality_data"),
        }

        result = supabase.table("hd_charts").insert(insert_data).execute()
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to save chart")

        saved_chart = result.data[0]
        chart_id = UUID(saved_chart["id"])

        return HDChartGenerateResponse(
            chart_id=chart_id,
            hd_type=HDType(hd_type),
            authority=HDAuthority(authority),
            profile=profile,
            incarnation_cross=incarnation_cross,
            bodygraph_svg=bodygraph_svg,
            definition_summary=definition_summary,
            definition_type=HDDefinitionType(definition_type),
            strategy=strategy,
            signature=signature,
            not_self_theme=not_self_theme,
        )

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print(f"HUMAN DESIGN CHART ERROR: {e}\n{tb}", flush=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/chart/{chart_id}", response_model=HDChartResponse)
async def get_chart(
    chart_id: UUID,
    user_id: str = Depends(get_current_user_id),
):
    """Fetch a saved Human Design chart by ID. Users only see own data (RLS)."""
    _check_rate_limit(user_id)

    supabase = get_supabase_client()
    result = supabase.table("hd_charts").select("*").eq("id", str(chart_id)).eq("user_id", user_id).single().execute()

    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chart not found")

    data = result.data
    return HDChartResponse(
        id=UUID(data["id"]),
        user_id=UUID(data["user_id"]),
        subject_name=data["subject_name"],
        birth_datetime_utc=datetime.fromisoformat(data["birth_datetime_utc"].replace("Z", "+00:00")),
        birth_latitude=data["birth_latitude"],
        birth_longitude=data["birth_longitude"],
        birth_timezone=data["birth_timezone"],
        time_unknown=data["time_unknown"],
        hd_type=HDType(data["hd_type"]),
        authority=HDAuthority(data["authority"]),
        profile=data["profile"],
        strategy=data["strategy"],
        signature=data["signature"],
        not_self_theme=data["not_self_theme"],
        bodygraph_data=data["bodygraph_data"],
        definition_type=HDDefinitionType(data["definition_type"]) if data.get("definition_type") else None,
        incarnation_cross=data.get("incarnation_cross"),
        design_data=data.get("design_data"),
        personality_data=data.get("personality_data"),
        chart_data=data["chart_data"],
        chart_hash=data["chart_hash"],
        created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")),
        updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00")),
        deleted_at=datetime.fromisoformat(data["deleted_at"].replace("Z", "+00:00")) if data.get("deleted_at") else None,
    )


@router.get("/charts", response_model=HDChartListResponse)
async def list_user_charts(
    user_id: str = Depends(get_current_user_id),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    """List user's saved Human Design charts (paginated)."""
    _check_rate_limit(user_id)

    supabase = get_supabase_client()
    result = supabase.table("hd_charts").select("*", count="exact").eq("user_id", user_id).order("created_at", desc=True).range(offset, offset + limit - 1).execute()

    charts = []
    for data in (result.data or []):
        charts.append(
            HDChartSummary(
                id=UUID(data["id"]),
                subject_name=data["subject_name"],
                birth_datetime_utc=datetime.fromisoformat(data["birth_datetime_utc"].replace("Z", "+00:00")),
                hd_type=HDType(data["hd_type"]),
                authority=HDAuthority(data["authority"]),
                profile=data["profile"],
                definition_type=HDDefinitionType(data["definition_type"]) if data.get("definition_type") else None,
                created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00")),
            )
        )

    return HDChartListResponse(
        charts=charts,
        total=result.count or 0,
    )


@router.delete("/chart/{chart_id}")
async def delete_chart(
    chart_id: UUID,
    user_id: str = Depends(get_current_user_id),
):
    """Delete a Human Design chart. Users only delete own data (RLS)."""
    _check_rate_limit(user_id)

    supabase = get_supabase_client()
    result = supabase.table("hd_charts").delete().eq("id", str(chart_id)).eq("user_id", user_id).execute()

    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chart not found")

    return {"message": "Chart deleted"}


# ============================================
# REFERENCE DATA ENDPOINTS
# ============================================

@router.get("/centers", response_model=CentersListResponse)
async def list_centers(
    user_id: str = Depends(get_current_user_id),
):
    """
    List all 9 Human Design centers with definition status.
    Returns center type, name, status (defined/undefined/open), gates, description, theme, shadow.
    """
    _check_rate_limit(user_id)

    centers = get_all_centers()
    return CentersListResponse(centers=[HDCenter(**c) for c in centers])


@router.get("/channels", response_model=ChannelsListResponse)
async def list_channels(
    user_id: str = Depends(get_current_user_id),
):
    """
    List all 36 Human Design channels with definition status.
    Returns channel ID, name, start/end gates, start/end centers, defined status, description, theme, shadow, circuit.
    """
    _check_rate_limit(user_id)

    channels = get_all_channels()
    return ChannelsListResponse(channels=[HDChannel(**c) for c in channels])


@router.get("/gates", response_model=GatesListResponse)
async def list_gates(
    user_id: str = Depends(get_current_user_id),
):
    """
    List all 64 Human Design gates with line, color, tone, base.
    Returns gate number, name, center, line (1-6), color (1-6), tone (1-6), base (1-5), defined status, conscious/design, description, keynotes, harmonic gate.
    """
    _check_rate_limit(user_id)

    gates = get_all_gates()
    return GatesListResponse(gates=[HDGate(**g) for g in gates])


@router.get("/profile", response_model=ProfileDetailsResponse)
async def get_profile_details(
    profile: str = Query(..., pattern=r"^[1-6]/[1-6]$", description="Profile in format 'X/Y' (e.g., '1/3', '2/4')"),
    user_id: str = Depends(get_current_user_id),
):
    """
    Get detailed information for a specific Human Design profile.
    Returns profile string, conscious/unconscious lines with descriptions and keynotes.
    """
    _check_rate_limit(user_id)

    profile_data = get_profile_details(profile)
    if not profile_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Profile '{profile}' not found")

    return ProfileDetailsResponse(
        profile=profile_data["profile"],
        conscious_line=HDProfileLine(**profile_data["conscious_line"]),
        unconscious_line=HDProfileLine(**profile_data["unconscious_line"]),
        description=profile_data.get("description"),
        keynotes=profile_data.get("keynotes", []),
    )


@router.get("/cross", response_model=CrossDetailsResponse)
async def get_cross_details_endpoint(
    cross_name: str = Query(..., description="Incarnation cross name"),
    user_id: str = Depends(get_current_user_id),
):
    """
    Get detailed information for a specific Incarnation Cross.
    Returns cross name, conscious/unconscious sun/earth gates, quarter, theme.
    """
    _check_rate_limit(user_id)

    cross_data = get_cross_details(cross_name)
    if not cross_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Incarnation cross '{cross_name}' not found")

    return CrossDetailsResponse(
        name=cross_data["name"],
        conscious_sun_gate=cross_data["conscious_sun_gate"],
        conscious_earth_gate=cross_data["conscious_earth_gate"],
        unconscious_sun_gate=cross_data["unconscious_sun_gate"],
        unconscious_earth_gate=cross_data["unconscious_earth_gate"],
        quarter=cross_data["quarter"],
        theme=cross_data.get("theme"),
    )


@router.get("/variables", response_model=VariablesDetailsResponse)
async def get_variables_details(
    user_id: str = Depends(get_current_user_id),
):
    """
    Get all 4 PHS variables (Primary Health System) with arrow, color, tone, base.
    Returns variables: PHS (Determination), Environment, Perspective, Motivation.
    """
    _check_rate_limit(user_id)

    variables = get_variables_details()
    return VariablesDetailsResponse(variables=[HDVariable(**v) for v in variables])


# ============================================
# AI INTERPRETATION ENDPOINT
# ============================================

@router.post("/interpret", response_model=HDInterpretResponse)
async def interpret_chart(
    request: HDInterpretRequest,
    user_id: str = Depends(get_current_user_id),
):
    """
    Generate AI interpretation for a Human Design chart.
    Uses call_ai_json() with the configured AI_PROVIDER.
    Saves interpretation to Supabase hd_charts (or separate interpretations table).
    """
    _check_rate_limit(user_id)

    supabase = get_supabase_client()

    # Verify chart exists and belongs to user
    chart_result = supabase.table("hd_charts").select("*").eq("id", str(request.chart_id)).eq("user_id", user_id).single().execute()
    if not chart_result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chart not found")

    chart_data = chart_result.data

    try:
        # Generate AI interpretation using the engine function
        interpretation = await interpret_chart_with_ai(
            chart_data=chart_data,
            focus=request.focus,
            question=request.question,
        )

        # Save interpretation (could be in hd_charts or a separate table)
        # For now, update the chart_data with interpretation
        interpretation_id = UUID(supabase.table("hd_charts").update({
            "chart_data": {**chart_data["chart_data"], "last_interpretation": interpretation, "last_interpreted_at": datetime.now().isoformat()},
            "updated_at": datetime.now().isoformat(),
        }).eq("id", str(request.chart_id)).eq("user_id", user_id).execute()).data[0]["id"]

        return HDInterpretResponse(
            interpretation_id=interpretation_id,
            chart_id=request.chart_id,
            focus=request.focus,
            question=request.question,
            interpretation=interpretation,
            model=settings.AI_PROVIDER or "gemini",
            created_at=datetime.now(),
        )

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print(f"HUMAN DESIGN INTERPRET ERROR: {e}\n{tb}", flush=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to generate interpretation: {str(e)}")