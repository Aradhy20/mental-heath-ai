"""
MindfulAI Conversational Engine
Directs the conversation flow based on multi-modal mental state and decision logic.
"""

from typing import Dict, List, Any, Optional
from ai.modules.llm_manager import llm_manager
from core.logging import log

class ConversationEngine:
    def __init__(self):
        # Role-Based Personas
        self.ROLE_PROMPTS = {
            "SUPPORT": "🧠 MODE: EMOTIONAL SUPPORT (Psychologist)\nBehavior: Validate feelings first. Use phrases like 'It makes sense you feel that way' or 'I hear how hard this is for you'. Do not fix, just listen and validate.",
            "CBT": "🧠 MODE: COGNITIVE THERAPY (CBT Expert)\nBehavior: Help the user identify 'Thinking Traps' (e.g. Catastrophizing). Ask reflective questions: 'Is there another way to think about this?' or 'What is the evidence for that thought?'",
            "COACHING": "🧠 MODE: WELLNESS COACHING\nBehavior: Be upbeat and encouraging. Focus on small, actionable micro-tasks. Use phrases like 'Let's try one small thing today' or 'How can we break this down?'",
            "CRISIS": "🧠 MODE: EMERGENCY OVERRIDE (Crisis Specialist)\nBehavior: Stay calm, supportive, and direct. Encourage the user to contact professional help immediately. Do NOT provide complex therapy; focus on safety."
        }

    def get_system_prompt(self, mode: str, mental_state: Dict[str, Any]) -> str:
        """
        Constructs a dynamic system prompt based on the selected mode.
        """
        role_instructions = self.ROLE_PROMPTS.get(mode, self.ROLE_PROMPTS["SUPPORT"])
        emotion = mental_state.get("emotion", "neutral")
        
        base_prompt = (
            "You are MindfulAI, an advanced clinical-grade mental wellness assistant.\n"
            "Your personality is empathetic, calm, and supportive.\n\n"
            "--------------------------------------------------\n"
            f"CURRENT USER CONTEXT:\n"
            f"- Detected Emotion: {emotion}\n"
            f"- Resilience Score: {mental_state.get('score', 0.5)}\n"
            "--------------------------------------------------\n"
            f"{role_instructions}\n"
            "--------------------------------------------------\n"
            "SAFETY RULES:\n"
            "- Never give medical diagnosis.\n"
            "- If risk is high, prioritize safety contact info.\n"
            "- Keep responses human-like and concise.\n"
        )
        return base_prompt

    async def generate_response(
        self, 
        user_input: str, 
        mental_state: Dict[str, Any], 
        mode: str,
        history: List[Dict[str, str]] = []
    ) -> Dict[str, Any]:
        """
        Final pipeline step: Generates the empathetic AI response.
        """
        # 1. Handle Crisis Immediately (Safety First)
        if mode == "CRISIS":
            return {
                "message": "It sounds like you're going through a lot right now. Please know that you're not alone. I strongly encourage you to reach out to a professional or a crisis helpline like 988 (in the US/Canada) immediately. Your safety is the priority.",
                "mode": "CRISIS",
                "emotion": "distressed",
                "risk_level": "HIGH"
            }

        # 2. Construct Prompt
        system_prompt = self.get_system_prompt(mode, mental_state)
        
        try:
            # 3. Call LLM Manager
            response_text = llm_manager.generate(
                system_prompt=system_prompt,
                user_input=user_input,
                history=history
            )
            
            return {
                "message": response_text,
                "mode": mode,
                "emotion": mental_state.get("emotion"),
                "risk_level": mental_state.get("risk_level", "LOW")
            }
        except Exception as e:
            log.error(f"Conversation Engine LLM Error: {e}")
            return {
                "message": "I'm here for you, but I'm having a little trouble processing that right now. Let's take a deep breath together.",
                "mode": mode,
                "emotion": mental_state.get("emotion"),
                "risk_level": mental_state.get("risk_level", "LOW")
            }

# Singleton instance
conversation_engine = ConversationEngine()
