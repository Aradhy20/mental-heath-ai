"""Explain Engine: Deep mind mapping and analysis."""
from sqlalchemy.ext.asyncio import AsyncSession
from ai.digital_twin import digital_twin
from ai.temporal_engine import temporal_engine

class ExplainEngine:
    async def explain(self, user_id: str, db: AsyncSession):
        profile = await digital_twin.update_profile(user_id, db)
        trend_data = await temporal_engine.calculate_weighted_state(profile.get("emotional_baseline", 0.5), user_id, db)
        
        return {
            "emotion": "Distressed" if profile.get("emotional_baseline", 50) < 40 else "Stable",
            "stress_level": "High" if profile.get("stress_trend") == "rising" else "Manageable",
            "cognitive_pattern": "Catastrophizing" if profile.get("resilience_index", 50) < 30 else "Balanced",
            "trigger": profile.get("top_triggers", [("None", 0)])[0][0] if profile.get("top_triggers") else "None identified",
            "reasoning": profile.get("weekly_insight", "Current levels indicate healthy regulation.")
        }

explain_engine = ExplainEngine()
