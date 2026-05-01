import numpy as np
from datetime import datetime, timedelta
from sqlalchemy import select, func
from models import MoodLog, JournalEntry
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, List

class MoodBeast:
    """
    Advanced Forensics Engine for psychological profiling and trend analysis.
    The 'Beast' analyzes time-series data to find hidden emotional patterns.
    """
    
    def __init__(self):
        self.emotion_map = {0: "happy", 1: "sad", 2: "anxious", 3: "angry", 4: "neutral"}

    async def calculate_resilience(self, user_id: str, db: AsyncSession) -> float:
        """
        Calculates the Resilience Index (0-100).
        Measured by how quickly a user returns to a 'neutral' or 'happy' baseline 
        after a 'sad' or 'anxious' event.
        """
        # Get logs from last 14 days
        stmt = select(MoodLog).where(MoodLog.user_id == user_id).order_by(MoodLog.created_at.asc())
        result = await db.execute(stmt)
        logs = result.scalars().all()
        
        if len(logs) < 5: return 50.0 # Standard baseline
        
        recovery_times = []
        in_stress = False
        stress_start = None
        
        for log in logs:
            score = float(log.score)
            if score < 40 and not in_stress:
                in_stress = True
                stress_start = log.created_at
            elif score >= 60 and in_stress:
                # Recovered
                recovery_time = (log.created_at - stress_start).total_seconds() / 3600 # hours
                recovery_times.append(recovery_time)
                in_stress = False
        
        if not recovery_times: return 60.0 # No recovery detected or no stress
        
        avg_recovery = sum(recovery_times) / len(recovery_times)
        # Faster recovery = higher resilience. Assuming > 48h for recovery is slow.
        resilience = max(0, 100 - (avg_recovery * 2)) 
        return round(resilience, 2)

    async def map_vulnerability_windows(self, user_id: str, db: AsyncSession) -> List[Dict[str, Any]]:
        """
        Identifies specific hours or days when the user is most emotionally vulnerable.
        """
        stmt = select(
            func.extract('hour', MoodLog.created_at).label('hour'),
            func.avg(MoodLog.score).label('avg_score'),
            func.count(MoodLog.id).label('count')
        ).where(MoodLog.user_id == user_id).group_by('hour')
        
        result = await db.execute(stmt)
        data = result.all()
        
        windows = []
        for row in data:
            if row.avg_score < 50:
                windows.append({
                    "hour": int(row.hour),
                    "severity": "high" if row.avg_score < 30 else "moderate",
                    "avg_score": float(row.avg_score)
                })
        
        return sorted(windows, key=lambda x: x['avg_score'])

    async def detect_trigger_correlations(self, user_id: str, db: AsyncSession) -> Dict[str, Any]:
        """
        Correlates specific topics in chat/journals with drops in emotional state.
        """
        stmt = select(JournalEntry).where(JournalEntry.user_id == user_id)
        result = await db.execute(stmt)
        journals = result.scalars().all()
        
        trigger_cloud = {}
        stop_words = {'the', 'and', 'was', 'were', 'not', 'that', 'this', 'with', 'for'}
        
        for j in journals:
            # Simple keyword extraction
            words = set(j.content.lower().split()) - stop_words
            sentiment = (j.sentiment or "neutral").lower()
            
            if sentiment in ['sad', 'anxious', 'angry']:
                for word in words:
                    if len(word) > 4: # Ignore short words
                        trigger_cloud[word] = trigger_cloud.get(word, 0) + 1
        
        # Get top 5 negative triggers
        top_triggers = sorted(trigger_cloud.items(), key=lambda x: x[1], reverse=True)[:5]
        return {word: count for word, count in top_triggers}

    async def get_beast_profile(self, user_id: str, db: AsyncSession) -> Dict[str, Any]:
        """
        Generates the full 'Beast Mode' forensics report.
        """
        resilience = await self.calculate_resilience(user_id, db)
        windows = await self.map_vulnerability_windows(user_id, db)
        triggers = await self.detect_trigger_correlations(user_id, db)
        
        return {
            "resilience_score": resilience,
            "vulnerability_windows": windows[:3],
            "top_negative_triggers": triggers,
            "analysis_level": "BEAST_MODE",
            "timestamp": datetime.utcnow().isoformat()
        }

# Singleton
mood_beast = MoodBeast()
