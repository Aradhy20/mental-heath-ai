from models import RecommendedAction


class ActionEngine:
    def recommend(self, emotion: str, stress_score: float, energy_score: float, available_minutes: int, memory_bias: str = "") -> RecommendedAction:
        emotion_key = (emotion or "neutral").lower()
        minutes = max(1, min(available_minutes or 5, 20))

        if stress_score >= 0.75 or emotion_key in {"anxious", "overwhelmed", "panic"}:
            return RecommendedAction(
                type="breathing",
                title="90-Second Nervous System Reset",
                reason="High arousal is the strongest signal right now, so a short breathing intervention is the fastest stabilizer.",
                duration_minutes=min(minutes, 2),
                follow_up_prompt="Did your body feel even 10% calmer after the reset?",
            )
        if emotion_key in {"sad", "low", "numb", "hopeless"}:
            return RecommendedAction(
                type="journaling",
                title="Name The Weight",
                reason="Low-valence states improve when the feeling is externalized before solving it.",
                duration_minutes=min(minutes, 5),
                follow_up_prompt="What felt most true once you wrote it down?",
            )
        if emotion_key in {"angry", "frustrated", "agitated"}:
            return RecommendedAction(
                type="movement",
                title="Three-Minute Walk Break",
                reason="Your state suggests activation without release. Movement can discharge tension more effectively than more thinking.",
                duration_minutes=min(minutes, 3),
                follow_up_prompt="What changed in your body after moving?",
            )
        if memory_bias == "gratitude_reflection":
            return RecommendedAction(
                type="reflection",
                title="Anchor A Win",
                reason="Your recent baseline is steadier, so the best action is reinforcing what is already working.",
                duration_minutes=min(minutes, 3),
                follow_up_prompt="What helped you feel more grounded today?",
            )
        return RecommendedAction(
            type="grounding",
            title="5-4-3-2-1 Grounding",
            reason="A short grounding exercise is the safest and most broadly useful next action when the signal is mixed.",
            duration_minutes=min(minutes, 4),
            follow_up_prompt="What feels different after grounding yourself in the present moment?",
        )

