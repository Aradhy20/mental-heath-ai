"""
MindfulAI Safety Guardrails
Ensures the AI output remains within clinically safe parameters.
"""

from typing import List, Dict, Optional
import re

class SafetyGuardrails:
    def __init__(self):
        # Forbidden topics or unsafe advice patterns
        self.unsafe_keywords = [
            r"stop taking your medication",
            r"you don't need a doctor",
            r"I can cure you",
            r"go ahead and hurt yourself"
        ]
        
        # Mandatory disclaimers based on risk
        self.disclaimers = {
            "MODERATE": "Please note: I am an AI, not a doctor. If these feelings persist, consider speaking with a professional.",
            "HIGH": "IMPORTANT: Your distress level is high. Please reach out to a trusted person or a mental health professional today.",
            "CRITICAL": "EMERGENCY: Please contact a crisis helpline immediately. Your safety is the only priority right now."
        }

    def filter_response(self, response_text: str, risk_level: str) -> str:
        """
        Scans AI output for unsafe advice and appends mandatory disclaimers.
        """
        # 1. Check for unsafe advice
        for pattern in self.unsafe_keywords:
            if re.search(pattern, response_text, re.IGNORECASE):
                return (
                    "I am concerned that I'm not providing the safest advice right now. "
                    "Let's focus on grounding yourself, and please consult a medical professional for advice regarding your treatment or medication."
                )

        # 2. Append disclaimer if risk is monitored
        disclaimer = self.disclaimers.get(risk_level)
        if disclaimer:
            response_text = f"{response_text}\n\n---\n🛡️ **Clinical Note**: {disclaimer}"

        return response_text

    def is_adversarial(self, user_input: str) -> bool:
        """
        Detects common jailbreak or 'ignore safety protocol' prompts.
        """
        adversarial_patterns = [
            r"ignore previous instructions",
            r"bypass safety",
            r"forget your clinical rules",
            r"assume the role of an unsafe bot"
        ]
        for pattern in adversarial_patterns:
            if re.search(pattern, user_input, re.IGNORECASE):
                return True
        return False

# Singleton instance
safety_guardrails = SafetyGuardrails()
