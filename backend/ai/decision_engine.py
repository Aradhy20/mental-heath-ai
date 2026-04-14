from typing import Dict, Any

class DecisionEngine:
    """
    Traffic controller for MindfulAI.
    Routes analyzed mental state to the optimal Conversational Mode.
    """
    
    def __init__(self):
        # Professional Behavior Modes
        self.MODES = {
            "SUPPORT": "emotional_support",
            "CBT": "cognitive_therapy",
            "COACHING": "routine_coach",
            "CRISIS": "emergency_override"
        }

    def select_mode(self, mental_state: Dict[str, Any]) -> str:
        """
        Calculates the best AI response strategy based on:
        - Risk Level (Immediate Override)
        - Emotion (Affective Matching)
        - Score (Severity Index)
        """
        risk = mental_state.get("risk_level", "LOW")
        emotion = mental_state.get("emotion", "neutral")
        score = mental_state.get("score", 0.5)

        # 1. CRITICAL: Crisis Override
        if risk == "HIGH":
            return "CRISIS"
            
        # 2. SEVERE: Emotional Support (High Distress/Sadness)
        if emotion in ["distressed", "sad", "scared"] or score > 0.7:
            return "SUPPORT"
            
        # 3. STABLE: Routine Coaching (Focus/Neutral/Calm)
        if emotion in ["calm", "focused"] or score < 0.3:
            return "COACHING"
            
        # 4. DEFAULT: Cognitive Reframe (CBT)
        return "CBT"

    def determine_path(self, mental_state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates the final decision metadata for the Conversation Engine.
        """
        mode = self.select_mode(mental_state)
        
        return {
            "selected_mode": mode,
            "behavior_label": self.MODES.get(mode),
            "empathy_level": "high" if mode == "SUPPORT" else "standard",
            "suggest_action": mode == "COACHING"
        }

# Singleton instance
decision_engine = DecisionEngine()
