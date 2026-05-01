"""
MindfulAI Personalization Engine
Adapts responses, detects user patterns, and adjusts tone + suggestions continuously.
"""
from typing import Dict, Any

class PersonalizationEngine:
    def __init__(self):
        pass

    def get_tone_adjustment(self, digital_twin_profile: dict) -> str:
        """
        Returns a precise clinical tone directive based on resilience index and trend.
        5 tiers: Fragile → Vulnerable → Moderate → Resilient → Thriving
        """
        if not digital_twin_profile:
            return "Be warm, empathetic, and conversational. Ask gentle open-ended questions."

        resilience = digital_twin_profile.get("resilience_index", 50)
        trend = digital_twin_profile.get("stress_trend", "stable")

        # Tier 1 — Fragile (high risk, declining fast)
        if resilience < 25 or (trend == "rising" and resilience < 35):
            return (
                "Be extremely gentle and protective. The user is fragile right now. "
                "Never suggest they 'just try' something — acknowledge first. "
                "Validate their pain deeply before any suggestion. Use soft, quiet language."
            )

        # Tier 2 — Vulnerable (below-average resilience)
        if resilience < 45 or trend == "rising":
            return (
                "Be highly empathetic and patient. The user is in a vulnerable state. "
                "Avoid any language that sounds demanding or prescriptive. "
                "Ask one small, simple question to gently open the conversation."
            )

        # Tier 3 — Moderate (average baseline)
        if resilience < 65:
            return (
                "Be warm and supportive. Acknowledge feelings, then offer a balanced perspective. "
                "You can suggest one small, concrete step — but frame it as optional, not mandatory."
            )

        # Tier 4 — Resilient (above average, stable or improving)
        if resilience < 80 or trend == "stable":
            return (
                "Be warm but direct. The user has good coping resources. "
                "You can offer actionable, specific suggestions with confidence. "
                "Match their energy — they can handle honest, forward-looking advice."
            )

        # Tier 5 — Thriving (high resilience, improving trend)
        return (
            "Be encouraging and goal-oriented. The user is in a strong emotional state. "
            "You can speak openly about building positive habits and future planning. "
            "Be energetic and collaborative — co-create solutions with them."
        )

personalization_engine = PersonalizationEngine()

