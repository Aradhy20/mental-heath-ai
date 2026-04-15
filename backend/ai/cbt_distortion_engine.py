"""
MindfulAI CBT Distortion Engine
Specially designed to detect and categorize Cognitive Distortions (Thinking Traps).
"""

from typing import List, Dict, Optional
import re

class CBTDistortionEngine:
    def __init__(self):
        # Clinical patterns for Cognitive Distortions
        self.TRAPS = {
            "CATASTROPHIZING": {
                "patterns": [r"always going to be like this", r"the worst will happen", r"everything is ruined", r"beyond repair"],
                "reframe": "Is there a middle ground? What's the most *likely* outcome, rather than the worst?"
            },
            "ALL_OR_NOTHING": {
                "patterns": [r"perfect or 0", r"complete failure", r"success or nothing", r"everyone hates me", r"nobody likes"],
                "reframe": "Life is rarely black and white. Can we find a grey area or a small partial success here?"
            },
            "MIND_READING": {
                "patterns": [r"I know they think", r"they probably hate", r"everyone is judging", r"she's thinking that I"],
                "reframe": "We can't actually know what others think. What's the evidence for and against this thought?"
            },
            "EMOTIONAL_REASONING": {
                "patterns": [r"I feel like a failure so I am", r"I feel guilty so I must have done", r"I feel hopeless so it is"],
                "reframe": "Feelings are signals, not facts. Can we look at the objective situation separate from the feeling?"
            }
        }

    def detect_distortions(self, text: str) -> List[Dict]:
        """
        Scans user text for clinical thinking traps.
        """
        detected = []
        text_lower = text.lower()
        
        for trap_name, data in self.TRAPS.items():
            for pattern in data["patterns"]:
                if re.search(pattern, text_lower):
                    detected.append({
                        "trap": trap_name,
                        "reframe_hint": data["reframe"]
                    })
                    break # Move to next trap
                    
        return detected

# Singleton instance
cbt_distortion_engine = CBTDistortionEngine()
