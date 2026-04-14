from typing import List, Optional

from models import (
    AnalyzeEmotionRequest,
    EmotionalSignal,
    EmotionalState,
    MemorySnapshot,
)


NEGATIVE_TERMS = {
    "anxious": ["anxious", "panic", "worried", "nervous", "overthinking"],
    "overwhelmed": ["overwhelmed", "too much", "burned out", "exhausted"],
    "sad": ["sad", "down", "empty", "lonely", "hopeless"],
    "angry": ["angry", "frustrated", "irritated", "annoyed"],
}

POSITIVE_TERMS = {
    "calm": ["calm", "steady", "peaceful", "grounded"],
    "happy": ["happy", "good", "better", "hopeful", "relieved"],
}


class EmotionEngine:
    def analyze(self, request: AnalyzeEmotionRequest, memory: MemorySnapshot) -> EmotionalState:
        signals: List[EmotionalSignal] = []

        if request.text:
            signals.append(self._analyze_text(request.text))
        if request.voice_score is not None:
            signals.append(self._analyze_voice(request.voice_score, request.voice_confidence))
        if request.face_score is not None:
            signals.append(self._analyze_face(request.face_score, request.face_confidence))

        history_signal = EmotionalSignal(
            emotion=self._emotion_from_history(memory.history_score),
            score=memory.history_score,
            confidence=0.65 if memory.summary != "No recent emotional memory available." else 0.2,
            valence=(memory.history_score * 2) - 1,
            arousal=0.45 if memory.history_score >= 0.5 else 0.65,
            stress=1 - memory.history_score,
            source="history",
        )
        signals.append(history_signal)

        text_score = self._signal_score("text", signals, default=0.5)
        voice_score = self._signal_score("voice", signals, default=0.5)
        face_score = self._signal_score("face", signals, default=0.5)
        history_score = history_signal.score

        emotion_score = round((text_score * 0.4) + (voice_score * 0.3) + (face_score * 0.2) + (history_score * 0.1), 2)
        valence = round((emotion_score * 2) - 1, 2)
        arousal = round(self._average([signal.arousal for signal in signals]), 2)
        stress_score = round(1 - emotion_score if emotion_score <= 0.55 else max(0.0, 0.6 - (emotion_score - 0.55)), 2)
        confidence = round(self._average([signal.confidence for signal in signals]), 2)
        emotional_fatigue = round(min(1.0, (stress_score * 0.6) + ((1 - history_score) * 0.4)), 2)
        burnout_risk = round(min(1.0, (emotional_fatigue * 0.6) + (0.2 if arousal > 0.7 else 0.0) + (0.15 if memory.common_distortions else 0.0)), 2)

        primary_emotion = self._pick_primary_emotion(signals, emotion_score)
        secondary = [signal.emotion for signal in signals if signal.emotion != primary_emotion and signal.emotion != "neutral"]
        contributors = {"text": 0.4, "voice": 0.3, "face": 0.2, "history": 0.1}

        explanation: List[str] = []
        for signal in signals:
            if signal.source == "text" and request.text:
                explanation.append(f"Text suggests {signal.emotion} with confidence {signal.confidence:.2f}.")
            elif signal.source == "voice":
                explanation.append(f"Voice signal maps to {signal.emotion} with stress-oriented score {signal.score:.2f}.")
            elif signal.source == "face":
                explanation.append(f"Face signal maps to {signal.emotion} with confidence {signal.confidence:.2f}.")
        if memory.summary:
            explanation.append(memory.summary)

        return EmotionalState(
            primary_emotion=primary_emotion,
            secondary_emotions=list(dict.fromkeys(secondary))[:3],
            valence=valence,
            arousal=arousal,
            stress_score=stress_score,
            confidence=confidence,
            risk_level=self._risk_level(stress_score, burnout_risk, primary_emotion),
            emotion_score=emotion_score,
            emotional_fatigue_score=emotional_fatigue,
            burnout_risk=burnout_risk,
            contributors=contributors,
            explanation=explanation[:4],
        )

    def _analyze_text(self, text: str) -> EmotionalSignal:
        lowered = text.lower()
        for emotion, terms in NEGATIVE_TERMS.items():
            if any(term in lowered for term in terms):
                negativity = 0.18 if emotion in {"sad", "angry"} else 0.12
                score = 0.5 - negativity
                stress = 0.82 if emotion in {"anxious", "overwhelmed"} else 0.7
                return EmotionalSignal(
                    emotion=emotion,
                    score=score,
                    confidence=0.78,
                    valence=-0.6,
                    arousal=0.82 if emotion in {"anxious", "angry"} else 0.68,
                    stress=stress,
                    source="text",
                )
        for emotion, terms in POSITIVE_TERMS.items():
            if any(term in lowered for term in terms):
                return EmotionalSignal(
                    emotion=emotion,
                    score=0.72,
                    confidence=0.72,
                    valence=0.45,
                    arousal=0.38,
                    stress=0.25,
                    source="text",
                )
        return EmotionalSignal(
            emotion="neutral",
            score=0.52,
            confidence=0.55,
            valence=0.04,
            arousal=0.5,
            stress=0.45,
            source="text",
        )

    def _analyze_voice(self, score: float, confidence: Optional[float]) -> EmotionalSignal:
        voice_score = max(0.0, min(1.0, score))
        inferred_emotion = "anxious" if voice_score > 0.7 else "tense" if voice_score > 0.55 else "calm"
        return EmotionalSignal(
            emotion=inferred_emotion,
            score=1 - voice_score,
            confidence=max(0.1, min(1.0, confidence if confidence is not None else 0.6)),
            valence=(1 - voice_score) * 2 - 1,
            arousal=max(0.2, voice_score),
            stress=voice_score,
            source="voice",
        )

    def _analyze_face(self, score: float, confidence: Optional[float]) -> EmotionalSignal:
        face_score = max(0.0, min(1.0, score))
        inferred_emotion = "sad" if face_score < 0.35 else "neutral" if face_score < 0.65 else "calm"
        return EmotionalSignal(
            emotion=inferred_emotion,
            score=face_score,
            confidence=max(0.1, min(1.0, confidence if confidence is not None else 0.6)),
            valence=(face_score * 2) - 1,
            arousal=0.45 if face_score > 0.5 else 0.62,
            stress=1 - face_score,
            source="face",
        )

    def _signal_score(self, source: str, signals: List[EmotionalSignal], default: float) -> float:
        for signal in signals:
            if signal.source == source:
                return signal.score
        return default

    def _pick_primary_emotion(self, signals: List[EmotionalSignal], emotion_score: float) -> str:
        non_history = [signal.emotion for signal in signals if signal.source != "history" and signal.emotion != "neutral"]
        if non_history:
            return non_history[0]
        return "calm" if emotion_score >= 0.65 else "neutral" if emotion_score >= 0.45 else "low"

    def _emotion_from_history(self, history_score: float) -> str:
        if history_score >= 0.7:
            return "steady"
        if history_score >= 0.45:
            return "mixed"
        return "strained"

    def _risk_level(self, stress_score: float, burnout_risk: float, emotion: str) -> str:
        if emotion in {"hopeless"} or stress_score >= 0.85 or burnout_risk >= 0.8:
            return "high"
        if stress_score >= 0.65 or burnout_risk >= 0.6:
            return "moderate"
        return "low"

    def _average(self, values: List[float]) -> float:
        return sum(values) / len(values) if values else 0.5

