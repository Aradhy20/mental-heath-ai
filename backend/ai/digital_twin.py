"""
MindfulAI Digital Twin System
Maintains a persistent, evolving psychological profile of the user.
"""

from typing import Dict, List, Any
import datetime
from sqlalchemy import select
from models import MoodLog, DBJournal
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
        
        # Journal indicators
        journal_query = select(DBJournal).where(DBJournal.user_id == user_id, DBJournal.created_at >= thirty_days_ago)
        journal_result = await db.execute(journal_query)
        journals = journal_result.scalars().all()

        # 2. Analyze Triggers
        detected_triggers = {}
        for journal in journals:
            content = journal.content.lower()
            for trigger_cat, keywords in self.trigger_registry.items():
                for kw in keywords:
                    if kw in content:
                        detected_triggers[trigger_cat] = detected_triggers.get(trigger_cat, 0) + 1

        # 3. Analyze Habits (e.g., time of day for low mood)
        low_mood_hours = [log.created_at.hour for log in mood_logs if float(log.score) < 40]
        peak_low_hour = max(set(low_mood_hours), key=low_mood_hours.count) if low_mood_hours else None

        # 4. Profile Generation
        profile = {
            "top_triggers": sorted(detected_triggers.items(), key=lambda x: x[1], reverse=True)[:3],
            "vulnerability_window": f"{peak_low_hour}:00" if peak_low_hour else "unknown",
            "emotional_baseline": float(sum([float(l.score) for l in mood_logs])/len(mood_logs)) if mood_logs else 50.0,
            "resilience_index": min(len(journals) * 10, 100),
            "last_updated": datetime.datetime.utcnow().isoformat()
        }

        return profile

# Singleton instance
digital_twin = DigitalTwin()
