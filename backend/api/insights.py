from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from core.security import get_current_user
from ai.digital_twin import digital_twin
from ai.temporal_engine import temporal_engine
from ai.mental_engine import mental_engine
from typing import Dict, Any

router = APIRouter(tags=["AI Insights & Forecasts"])

@router.get("/profile/twin", summary="Get the user's evolved Digital Twin profile")
async def get_digital_twin(user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    Returns the persistent psychological profile, including Resilience Index and Stress Trends.
    """
    try:
        profile = await digital_twin.update_profile(user_id, db)
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve digital twin: {str(e)}")

@router.get("/insights/explain", summary="Explain My Mind: In-depth analysis of patterns and triggers")
async def explain_mind(user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    Aggregates current state, historical patterns, and detected triggers into a readable insight.
    """
    try:
        # 1. Get Digital Twin (Triggers & Baseline)
        profile = await digital_twin.update_profile(user_id, db)
        
        # 2. Get Historical Trend (Direction)
        trend_data = await temporal_engine.calculate_weighted_state(profile.get("emotional_baseline", 0.5), user_id, db)
        
        # 3. Construct "Explain My Mind" logic
        return {
            "primary_emotion": "Neutral" if profile.get("emotional_baseline", 50) > 40 else "Distressed",
            "pattern": "Consistent" if trend_data.get("trend_direction") == "stable" else "Volatile",
            "top_trigger": profile.get("top_triggers", [("None", 0)])[0][0] if profile.get("top_triggers") else "None",
            "resilience": profile.get("resilience_index", 50),
            "forecast": trend_data.get("prediction", {}),
            "narrative": profile.get("weekly_insight", "Your mind is currently maintaining a stable rhythm.")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate mental insight: {str(e)}")
