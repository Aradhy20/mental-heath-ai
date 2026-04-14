from typing import List

from models import ChatTherapyRequest, EmotionalState, MemorySnapshot


DISTORTION_RULES = {
    "catastrophizing": ["always", "never", "ruined", "disaster", "everything is wrong"],
    "fortune_telling": ["will fail", "going to fail", "mess up", "it'll go badly"],
    "mind_reading": ["they think", "everyone thinks", "they must think"],
    "should_statements": ["should", "must", "have to"],
    "personalization": ["my fault", "because of me", "i ruin everything"],
}


class TherapyEngine:
    def detect_distortions(self, text: str, memory: MemorySnapshot) -> List[str]:
        lowered = text.lower()
        hits = [name for name, patterns in DISTORTION_RULES.items() if any(pattern in lowered for pattern in patterns)]
        for distortion in memory.common_distortions:
            if distortion not in hits:
                hits.append(distortion)
        return hits[:4]

    def choose_mode(self, request: ChatTherapyRequest, state: EmotionalState) -> str:
        if request.mode and request.mode != "auto":
            return request.mode.lower()
        if state.risk_level == "high" or state.stress_score >= 0.8:
            return "support"
        if state.primary_emotion in {"sad", "low"}:
            return "vent"
        return "coaching"

    def respond(self, request: ChatTherapyRequest, state: EmotionalState, memory: MemorySnapshot) -> dict:
        distortions = self.detect_distortions(request.message, memory)
        mode = self.choose_mode(request, state)

        opening = {
            "vent": f"It sounds like you're carrying a lot right now, especially around feeling {state.primary_emotion}.",
            "coaching": f"It makes sense that you're feeling {state.primary_emotion}. Let's slow the pattern down and work with it.",
            "support": f"I'm with you. Your system looks overloaded right now, so let's focus on safety and steadiness before solving anything.",
        }[mode]

        middle = {
            "vent": "You do not need to fix everything in this moment. I want to help you name what feels heaviest first.",
            "coaching": "One thing I notice is that your mind may be treating a prediction like a fact. We can challenge that gently.",
            "support": "Before we think further ahead, let's reduce the intensity in your body and narrow the next step to something very small.",
        }[mode]

        distortion_line = ""
        if distortions:
            distortion_line = " I’m noticing patterns like " + ", ".join(distortions[:2]).replace("_", " ") + "."

        memory_line = ""
        if memory.summary and memory.summary != "No recent emotional memory available.":
            memory_line = " Based on your recent history, this does not look like an isolated moment."

        closing = {
            "vent": "What feels most true underneath all of this right now?",
            "coaching": "What is one piece of evidence that tomorrow may go even slightly better than your fear predicts?",
            "support": "Stay with the next two minutes only. We can take the rest one step at a time.",
        }[mode]

        return {
            "reply": opening + " " + middle + distortion_line + memory_line + " " + closing,
            "mode": mode,
            "detected_distortions": distortions,
        }

