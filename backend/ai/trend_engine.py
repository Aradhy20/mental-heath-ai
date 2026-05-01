"""Trend Engine: Processes time-series emotional data."""
from sqlalchemy.ext.asyncio import AsyncSession
from ai.digital_twin import digital_twin
from ml.engines.mood_beast import mood_beast

class TrendEngine:
    async def get_trends(self, user_id: str, db: AsyncSession):
        # 1. Get standard profile
        profile = await digital_twin.update_profile(user_id, db)
        
        # 2. Get Beast Mode forensics
        beast_profile = await mood_beast.get_beast_profile(user_id, db)
        
        return {
            "mood_history": profile.get("vulnerability_window", "unknown"),
            "stress_trends": profile.get("stress_trend", "stable"),
            "improvement_score": profile.get("resilience_index", 50),
            "beast_mode": beast_profile
        }

trend_engine = TrendEngine()
