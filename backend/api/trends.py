"""
MindfulAI Trends API — Beast Mode Analytics Endpoint
Exposes resilience, vulnerability windows, trigger maps, and burnout forecasts.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from core.security import get_current_user
from core.logging import log
from ai.trend_engine import trend_engine
from ml.engines.mood_beast import mood_beast

router = APIRouter(tags=["Trend Engine API"])

@router.get("/trends", summary="Full trend analysis — mood, stress, resilience")
async def trends_route(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns the combined trend profile:
    - mood_history: historical pattern label
    - stress_trends: rising / stable / declining
    - improvement_score: resilience index 0-100
    - beast_mode: deep forensics (vulnerability windows, trigger map, resilience score)
    """
    try:
        return await trend_engine.get_trends(user_id, db)
    except Exception as e:
        log.error(f"Trends error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/trends/beast", summary="Beast Mode — deep forensics profile")
async def beast_mode_profile(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Standalone Beast Mode endpoint returning:
    - resilience_score: 0-100 recovery speed index
    - vulnerability_windows: hours of the day where mood dips historically
    - top_negative_triggers: keywords correlated with negative emotional states
    """
    try:
        return await mood_beast.get_beast_profile(user_id, db)
    except Exception as e:
        log.error(f"Beast Mode error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/trends/burnout", summary="24-hour burnout risk forecast")
async def burnout_forecast(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns a 24-48h burnout risk forecast based on the TemporalEngine
    velocity analysis of the user's recent mood trajectory.
    """
    try:
        from ai.temporal_engine import temporal_engine
        # Use a neutral current score — this is a pure historical projection
        forecast = await temporal_engine.calculate_weighted_state(0.5, user_id, db)
        prediction = forecast.get("prediction", {})
        return {
            "burnout_risk": prediction.get("burnout_risk", "LOW"),
            "instability_index": prediction.get("instability_index", 0.0),
            "forecast_score": prediction.get("forecast_score", 0.5),
            "prediction_24h": prediction.get("prediction_24h", "Stable wellness projected"),
            "confidence": prediction.get("confidence", 0.0),
            "trend_direction": forecast.get("trend_direction", "stable"),
            "past_trend": forecast.get("past_trend", 0.5),
        }
    except Exception as e:
        log.error(f"Burnout forecast error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
