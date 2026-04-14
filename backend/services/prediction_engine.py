from collections import defaultdict
from statistics import mean

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models import MoodLog, PredictMoodResponse


class PredictionEngine:
    async def predict(self, db: AsyncSession, user_id: str, horizon_days: int) -> PredictMoodResponse:
        if not user_id or user_id == "guest":
            return PredictMoodResponse(
                trend="stable",
                forecast_confidence=0.3,
                burnout_risk=0.4,
                circadian_low_windows=[],
                explanation=["Not enough user-specific history yet, so this forecast is conservative."],
            )

        result = await db.execute(
            select(MoodLog).where(MoodLog.user_id == user_id).order_by(MoodLog.created_at.desc()).limit(30)
        )
        rows = list(result.scalars().all())
        scores = [self._normalize_score(row.score) for row in rows]

        if len(scores) < 3:
            return PredictMoodResponse(
                trend="stable",
                forecast_confidence=0.35,
                burnout_risk=0.45,
                circadian_low_windows=[],
                explanation=["The system needs more check-ins before it can model a reliable trend."],
            )

        latest_avg = mean(scores[:3])
        baseline_avg = mean(scores[-3:])
        delta = latest_avg - baseline_avg

        if delta > 0.08:
            trend = "improving"
        elif delta < -0.08:
            trend = "declining"
        else:
            trend = "stable"

        hourly = defaultdict(list)
        for row in rows:
            hourly[row.created_at.hour].append(self._normalize_score(row.score))

        low_windows = []
        for hour, values in sorted(hourly.items()):
            if values and mean(values) < 0.45:
                low_windows.append(f"{hour:02d}:00-{(hour + 1) % 24:02d}:00")

        volatility = max(scores) - min(scores)
        burnout_risk = round(min(1.0, (1 - latest_avg) * 0.55 + volatility * 0.45), 2)
        confidence = round(min(0.85, 0.35 + (len(scores) / 60)), 2)

        explanation = []
        explanation.append(f"Recent mood average is {latest_avg:.2f} versus older baseline {baseline_avg:.2f}.")
        if low_windows:
            explanation.append("Lower windows tend to cluster around " + ", ".join(low_windows[:3]) + ".")
        explanation.append(f"Forecast horizon is {max(1, horizon_days)} day(s) using recent mood history and volatility.")

        return PredictMoodResponse(
            trend=trend,
            forecast_confidence=confidence,
            burnout_risk=burnout_risk,
            circadian_low_windows=low_windows[:4],
            explanation=explanation,
        )

    def _normalize_score(self, raw_score: str) -> float:
        try:
            score = float(raw_score)
        except (TypeError, ValueError):
            return 0.5
        return max(0.0, min(1.0, score / 5.0 if score > 1 else score))
