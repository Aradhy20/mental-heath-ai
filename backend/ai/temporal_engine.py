"""
MindfulAI Temporal Engine
Analyzes historical trends to provide context-aware predictions.
"""

from typing import List, Dict, Any
import datetime
from sqlalchemy import select
from models import MoodLog
from sqlalchemy.ext.asyncio import AsyncSession
import numpy as np

class TemporalEngine:
    def __init__(self):
        self.trend_weight = 0.3
        self.current_weight = 0.7

    async def get_historical_trend(self, user_id: str, db: AsyncSession) -> float:
        """
        Calculates the average mood score for the last 7 days.
        """
        if user_id == "guest":
            return 0.5 # Neutral fallback for guest
            
        seven_days_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=7)
        
        try:
            query = select(MoodLog).where(
                MoodLog.user_id == user_id,
                MoodLog.created_at >= seven_days_ago
            ).order_by(MoodLog.created_at.desc())
            
            result = await db.execute(query)
            logs = result.scalars().all()
            
            if not logs:
                return 0.5
            
            # scores are stored as strings in models.py (based on previous view)
            scores = [float(l.score) / 100.0 if l.score.isdigit() else 0.5 for l in logs]
            return float(np.mean(scores))
        except Exception as e:
            print(f"Temporal analysis error: {e}")
            return 0.5

    async def calculate_weighted_state(self, current_score: float, user_id: str, db: AsyncSession) -> Dict[str, Any]:
        """
        Combines current multi-modal score with past trend.
        final = 0.7 * current + 0.3 * past trend
        """
        past_trend = await self.get_historical_trend(user_id, db)
        
        final_state = (self.current_weight * current_score) + (self.trend_weight * past_trend)
        
        return {
            "final_state": float(final_state),
            "past_trend": float(past_trend),
            "current_signal": float(current_score),
            "trend_direction": "improving" if current_score > past_trend + 0.1 else "declining" if current_score < past_trend - 0.1 else "stable"
        }

# Singleton instance
temporal_engine = TemporalEngine()
