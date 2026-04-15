"""
MindfulAI Crisis Escalator
Maps detected crisis to real-world humanitarian and emergency services.
"""

from typing import List, Dict

class CrisisEscalator:
    def __init__(self):
        # Global hotlines (Fallback)
        self.global_resources = [
            {"name": "International Crisis Line (Befrienders)", "link": "https://www.befrienders.org/"},
            {"name": "Crisis Text Line", "sms": "Text HOME to 741741"}
        ]
        
        # Region-specific registries
        self.regional_registry = {
            "USA": {
                "hotline": "988 (National Suicide Prevention Lifeline)",
                "emergency": "911"
            },
            "IND": {
                "hotline": "9152987821 (Vandrevala Foundation)",
                "emergency": "112"
            },
            "GBR": {
                "hotline": "111 (NHS) or 999 (Emergency)",
                "emergency": "999"
            }
        }

    def get_escalation_package(self, country_code: str = "USA") -> Dict:
        """
        Returns a structured package of resources for a crisis situation.
        """
        regional = self.regional_registry.get(country_code, self.regional_registry["USA"])
        
        return {
            "is_emergency": True,
            "regional_support": regional,
            "global_support": self.global_resources,
            "instruction": "Please reach out to one of these services immediately. You matter, and help is available."
        }

# Singleton instance
crisis_escalator = CrisisEscalator()
