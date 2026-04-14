"""
MindfulAI Risk Detection Engine
Immediate override system for high-risk signals.
"""

from typing import Dict, List, Any
import re

class RiskDetector:
    def __init__(self):
        # Critical indicators
        self.CRISIS_KEYWORDS = [
            r"suicide", 
            r"kill myself", 
            r"die", 
            r"end my life", 
            r"hurt myself",
            r"overdose",
            r"can't go on"
        ]
        
        # Moderate indicators
        self.MODERATE_KEYWORDS = [
            r"hopeless",
            r"worthless",
            r"give up",
            r"hate myself",
            r"pointless"
        ]

    def analyze_risk(self, text: str) -> Dict[str, Any]:
        """
        Scans text for high-risk indicators and returns risk level.
        """
        text_lower = text.lower()
        
        high_risk_matches = []
        for pattern in self.CRISIS_KEYWORDS:
            if re.search(pattern, text_lower):
                high_risk_matches.append(pattern)
        
        if high_risk_matches:
            return {
                "risk_level": "HIGH",
                "indicators": high_risk_matches,
                "bypass_required": True,
                "confidence": 1.0,
                "message": "Immediate crisis support recommended."
            }
            
        moderate_matches = []
        for pattern in self.MODERATE_KEYWORDS:
            if re.search(pattern, text_lower):
                moderate_matches.append(pattern)
                
        if moderate_matches:
            return {
                "risk_level": "MODERATE",
                "indicators": moderate_matches,
                "bypass_required": False,
                "confidence": 0.8,
                "message": "Increased stress levels detected. Close monitoring advised."
            }
            
        return {
            "risk_level": "LOW",
            "indicators": [],
            "bypass_required": False,
            "confidence": 0.5,
            "message": "Normal baseline detected."
        }

# Singleton instance
risk_detector = RiskDetector()
