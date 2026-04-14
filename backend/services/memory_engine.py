from collections import Counter
from statistics import mean
from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models import DBJournal, MemorySnapshot, MoodLog


DISTORTION_HINTS = {
    "catastrophizing": ["always", "never", "ruined", "disaster", "falling apart"],
    "fortune_telling": ["will fail", "going to fail", "won't work", "mess up"],
    "mind_reading": ["they think", "they hate", "everyone thinks", "they must think"],
    "should_statements": ["should", "must", "have to"],
    "personalization": ["my fault", "because of me", "i ruin"],
}


class MemoryEngine:
    async def build_snapshot(self, db: AsyncSession, user_id: str) -> MemorySnapshot:
        if not user_id or user_id == "guest":
            return MemorySnapshot()

        mood_rows = await self._load_recent_moods(db, user_id)
        journal_rows = await self._load_recent_journals(db, user_id)

        mood_scores = [self._normalize_mood_score(row.score) for row in mood_rows]
        mood_average = mean(mood_scores) if mood_scores else 0.5
        history_score = round(mood_average, 2)

        recent_emotions: List[str] = []
        for row in mood_rows:
            recent_emotions.extend([item.strip() for item in (row.feelings or "").split(",") if item.strip()])

        distortion_counter: Counter[str] = Counter()
        for row in journal_rows:
            lowered = (row.content or "").lower()
            for distortion, patterns in DISTORTION_HINTS.items():
                if any(pattern in lowered for pattern in patterns):
                    distortion_counter[distortion] += 1

        common_distortions = [name for name, _count in distortion_counter.most_common(3)]

        helpful_actions = []
        if mood_average < 0.4:
            helpful_actions.append("grounding")
            helpful_actions.append("short_journaling")
        elif mood_average < 0.6:
            helpful_actions.append("breathing")
            helpful_actions.append("walk")
        else:
            helpful_actions.append("gratitude_reflection")

        summary_parts = []
        if mood_scores:
            summary_parts.append(f"Recent mood baseline is {round(mood_average * 100)} out of 100.")
        if recent_emotions:
            top_emotions = [name for name, _count in Counter(recent_emotions).most_common(2)]
            summary_parts.append("Recurring feelings: " + ", ".join(top_emotions) + ".")
        if common_distortions:
            summary_parts.append("Common thinking traps: " + ", ".join(common_distortions) + ".")

        return MemorySnapshot(
            history_score=history_score,
            recent_mood_average=round(mood_average, 2),
            recent_emotions=list(dict.fromkeys(recent_emotions))[:5],
            common_distortions=common_distortions,
            summary=" ".join(summary_parts) if summary_parts else "No recent emotional memory available.",
            helpful_actions=helpful_actions,
        )

    async def _load_recent_moods(self, db: AsyncSession, user_id: str) -> List[MoodLog]:
        result = await db.execute(
            select(MoodLog).where(MoodLog.user_id == user_id).order_by(MoodLog.created_at.desc()).limit(10)
        )
        return list(result.scalars().all())

    async def _load_recent_journals(self, db: AsyncSession, user_id: str) -> List[DBJournal]:
        result = await db.execute(
            select(DBJournal).where(DBJournal.user_id == user_id).order_by(DBJournal.updated_at.desc()).limit(10)
        )
        return list(result.scalars().all())

    def _normalize_mood_score(self, raw_score: str) -> float:
        try:
            score = float(raw_score)
        except (TypeError, ValueError):
            return 0.5
        return max(0.0, min(1.0, score / 5.0 if score > 1 else score))

