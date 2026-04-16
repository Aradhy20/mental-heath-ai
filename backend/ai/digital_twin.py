"""
MindfulAI Digital Twin System
Maintains a persistent, evolving psychological profile of the user.
"""

from typing import Dict, List, Any
import datetime
from sqlalchemy import select
from models import MoodLog
from sqlalchemy.ext.asyncio import AsyncSession

class DigitalTwin:
    def __init__(self):
        self.trigger_registry = {
            "work": ["deadline", "boss", "meeting", "email", "tasks"],
            "personal": ["family", "relationship", "friend", "alone"],
            "financial": ["money", "bills", "rent", "cost"],
            "health": ["pain", "sick", "doctor", "tired"]
        }

    async def update_profile(self, user_id: str, db: AsyncSession) -> Dict[str, Any]:
        """
        Analyzes recent activity to update the digital twin profile.
        """
        if user_id == "guest":
            return {"status": "guest_mode", "profile": {}}

        # 1. Fetch recent journals & mood logs
        thirty_days_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=30)
        
        # Mood patterns
        mood_query = select(MoodLog).where(MoodLog.user_id == user_id, MoodLog.created_at >= thirty_days_ago)
        mood_result = await db.execute(mood_query)
        mood_logs = mood_result.scalars().all()
        
        # 2. Analyze Triggers from Mood Notes
        detected_triggers = {}
        for mood in mood_logs:
            content = (mood.note or "").lower()
            for trigger_cat, keywords in self.trigger_registry.items():
                for kw in keywords:
                    if kw in content:
                        detected_triggers[trigger_cat] = detected_triggers.get(trigger_cat, 0) + 1

        # 3. Analyze Patterns & Stress
        low_mood_hours = [log.created_at.hour for log in mood_logs if float(log.score) < 40]
        peak_low_hour = max(set(low_mood_hours), key=low_mood_hours.count) if low_mood_hours else None
        
        # Calculate Stress Trend (Derivative of scores)
        scores = [float(l.score) for l in mood_logs]
        stress_trend = "stable"
        if len(scores) >= 3:
            recent_avg = sum(scores[:3]) / 3
            past_avg = sum(scores[3:6]) / 3 if len(scores) >= 6 else scores[-1]
            stress_trend = "rising" if recent_avg < past_avg - 10 else "improving" if recent_avg > past_avg + 10 else "stable"

        # 4. Profile Generation
        profile = {
            "top_triggers": sorted(detected_triggers.items(), key=lambda x: x[1], reverse=True)[:3],
            "vulnerability_window": f"{peak_low_hour}:00" if peak_low_hour else "unknown",
            "emotional_baseline": float(sum(scores)/len(scores)) if scores else 50.0,
            "resilience_index": min(len(mood_logs) * 5 + (20 if stress_trend == "improving" else 0), 100),
            "stress_trend": stress_trend,
            "weekly_insight": self._generate_insight(stress_trend, detected_triggers),
            "last_updated": datetime.datetime.utcnow().isoformat()
        }

        return profile

    def _generate_insight(self, trend: str, triggers: Dict) -> str:
        if trend == "rising":
            return "You're showing increased sensitivity lately. Focus on grounding exercises."
        if triggers.get("work", 0) > 3:
            return "Work-related stress is a consistent pattern. Consider setting firmer boundaries."
        return "You're maintaining a steady emotional baseline. Continue your current self-care routine."

# Singleton instance
digital_twin = DigitalTwin()
