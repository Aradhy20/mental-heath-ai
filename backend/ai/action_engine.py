"""
MindfulAI Action Engine
Generates micro-actions for behavioral activation.
"""

from typing import Dict, List, Any
import random

class ActionEngine:
    def __init__(self):
        self.action_library = {
            "calm": [
                "Write down one thing you're grateful for today.",
                "Take 5 minutes to stretch your body.",
                "Reach out to a friend you haven't spoken to in a while."
            ],
            "neutral": [
                "Drink a glass of water and take three deep breaths.",
                "Listen to your favorite upbeat song.",
                "Organize one small area of your desk/room."
            ],
            "distressed": [
                "Practice box breathing: Inhale for 4, hold for 4, exhale for 4, hold for 4.",
                "Step outside for 2 minutes of fresh air.",
                "Write down exactly what you're feeling on a piece of paper, then tear it up.",
                "Wash your face with cold water."
            ],
            "crisis": [
                "Call the 988 lifeline for immediate support.",
                "Remind yourself: This feeling is temporary and you are safe right now.",
                "Contact your pre-identified emergency support person."
            ]
        }

    def suggest_action(self, mental_state: Dict[str, Any]) -> str:
        """
        Suggests a micro-action based on detected emotion/risk.
        """
        emotion = mental_state.get("emotion", "neutral")
        risk = mental_state.get("risk_level", "LOW")

        if risk == "HIGH":
            category = "crisis"
        else:
            category = emotion

        actions = self.action_library.get(category, self.action_library["neutral"])
        return random.choice(actions)

# Singleton instance
action_engine = ActionEngine()
