"""
MindfulAI Action Engine
Generates micro-actions for behavioral activation.
"""

from typing import Dict, List, Any
import random

class ActionEngine:
    def __init__(self):
        # Structured Clinical Interventions
        self.action_library = {
            "calm": [
                {
                    "title": "Gratitude Journaling",
                    "action": "Write down 3 specific things that went well today.",
                    "benefit": "Shifts focus from lack to abundance, stabilizing serotonin levels."
                },
                {
                    "title": "Progressive Muscle Relaxation",
                    "action": "Tense and release each muscle group starting from your toes.",
                    "benefit": "Reduces physical tension that often fuels mild anxiety."
                }
            ],
            "neutral": [
                {
                    "title": "The 5-Minute Win",
                    "action": "Complete one small task you've been putting off.",
                    "benefit": "Builds self-efficacy and momentum through behavioral activation."
                },
                {
                    "title": "Sensory Shift",
                    "action": "Listen to a song with a completely different tempo than your current mood.",
                    "benefit": "Interrupts emotional inertia and broadens cognitive perspective."
                }
            ],
            "distressed": [
                {
                    "title": "Box Breathing",
                    "action": "Inhale 4s, Hold 4s, Exhale 4s, Hold 4s. Repeat 4 times.",
                    "benefit": "Directly activates the parasympathetic nervous system to lower heart rate."
                },
                {
                    "title": "Thought Record",
                    "action": "Write down one upsetting thought and find one piece of evidence against it.",
                    "benefit": "CBT technique to challenge cognitive distortions and reduce emotional intensity."
                },
                {
                    "title": "Temperature Shock",
                    "action": "Splash cold water on your face or hold an ice cube.",
                    "benefit": "Trigger the Mammalian Dive Reflex to instantly lower physiological arousal."
                }
            ],
            "crisis": [
                {
                    "title": "Crisis Support",
                    "action": "Text 'HELLO' to 741741 or call 988 immediately.",
                    "benefit": "Professional intervention is necessary when self-regulation is insufficient."
                },
                {
                    "title": "Safety Grounding",
                    "action": "List 5 things you can see, 4 you can touch, and 3 you can hear.",
                    "benefit": "Anchors the mind in the present moment to prevent dissociation."
                }
            ]
        }

    def suggest_action(self, mental_state: Dict[str, Any]) -> Dict[str, str]:
        """
        Suggests a structured micro-intervention based on detected state.
        Now returns a dictionary with title, action, and benefit.
        """
        emotion = mental_state.get("emotion", "neutral")
        risk = mental_state.get("risk_level", "LOW")

        category = "crisis" if risk == "HIGH" else emotion
        actions = self.action_library.get(category, self.action_library["neutral"])
        
        # Select an action and return the full object for more meaningful UI display
        return random.choice(actions)

# Singleton instance
action_engine = ActionEngine()
