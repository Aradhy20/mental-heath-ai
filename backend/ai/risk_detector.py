"""
MindfulAI Risk Detector
Identifies high-risk clinical keywords and triggers safety overrides.
"""

from core.logging import log

class RiskDetector:
    def __init__(self):
        # High-risk trigger keywords
        self.critical_keywords = [
            "suicide", "kill myself", "die", "end it all", 
            "hurt myself", "better off dead", "no reason to live"
        ]
        
        # Moderate risk (Anxiety/Stress)
        self.concerning_keywords = [
            "scared", "panicking", "can't breathe", "hopeless", "worthless"
        ]

    def check_risk(self, text: str):
        """
        Returns (is_crisis: bool, risk_level: str)
        """
        text_lower = text.lower()
        
        # Check for CRITICAL risk
        for kw in self.critical_keywords:
            if kw in text_lower:
                log.warning(f"CRITICAL RISK DETECTED: Trigger word '{kw}' found.")
                return True, "HIGH"
        
        # Check for CONCERNING risk
        for kw in self.concerning_keywords:
            if kw in text_lower:
                log.info(f"Concerning symptoms detected in text: '{kw}'")
                return False, "MODERATE"
        
        return False, "LOW"

risk_detector = RiskDetector()
