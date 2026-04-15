"""
MindfulAI Conversational Engine
Directs the conversation flow based on multi-modal mental state and decision logic.
"""

from typing import Dict, List, Any, Optional
from ai.modules.llm_manager import llm_manager
from core.logging import log

class ConversationEngine:
    def __init__(self):
        # Role-Based Personas (Clinically Enhanced)
        self.ROLE_PROMPTS = {
            "SUPPORT": """🧠 MODE: EMOTIONAL SUPPORT (Psychologist)
Behavior: Use the 'OARS' technique (Open-ended questions, Affirmations, Reflective listening, Summarizing). 
Validation: Start by explicitly validating the emotion. 'I hear that you're feeling [emotion], and it makes sense because...'
Goal: Create a holding space where the user feels truly seen.""",
            
            "CBT": """🧠 MODE: COGNITIVE BEHAVIORAL THERAPY (CBT Expert)
Behavior: Focus on Cognitive Restructuring. Help the user spot 'Thinking Traps':
- Catastrophizing: Assuming the worst-case scenario.
- All-or-Nothing: Seeing things as only good or bad.
- Mind Reading: Assuming others think negatively of you.
Goal: Gently challenge the distortion and ask: 'What is a more balanced way to look at this?'""",
            
            "COACHING": """🧠 MODE: ACTION-ORIENTED COACHING
Behavior: Focus on 'Solution-Focused Brief Therapy' (SFBT). 
Questioning: Use the Miracle Question: 'If you woke up tomorrow and things were slightly better, what's the first small sign you'd notice?'
Goal: Move from problem-talk to solution-talk with micro-actions.""",
            
            "CRISIS": """🧠 MODE: EMERGENCY OVERRIDE (Crisis Specialist)
Behavior: Use 'Psychological First Aid' (PFA). Stay grounded, non-judgmental, and directive. 
Safety: Prioritize physical safety. provide specific local resources. 
Goal: Stabilize the user and facilitate a transition to human professional care."""
        }

    def get_system_prompt(self, mode: str, mental_state: Dict[str, Any], memory_context: Optional[str] = None) -> str:
        """
        Constructs a dynamic system prompt based on the selected mode and historical memory.
        """
        role_instructions = self.ROLE_PROMPTS.get(mode, self.ROLE_PROMPTS["SUPPORT"])
        emotion = mental_state.get("emotion", "neutral")
        
        # Digital Twin Memory Section
        memory_section = ""
        if memory_context:
            memory_section = (
                "--------------------------------------------------\n"
                "DIGITAL TWIN (LONG-TERM MEMORY):\n"
                f"{memory_context}\n"
                "Instruction: Subtly reference this history if relevant to current support.\n"
            )

        base_prompt = (
            "You are MindfulAI, an advanced clinical-grade mental wellness assistant.\n"
            "Your personality is empathetic, calm, and supportive.\n\n"
            "--------------------------------------------------\n"
            f"CURRENT USER CONTEXT:\n"
            f"- Detected Emotion: {emotion}\n"
            f"- Resilience Score: {mental_state.get('score', 0.5)}\n"
            "--------------------------------------------------\n"
            f"{memory_section}"
            "--------------------------------------------------\n"
            f"{role_instructions}\n"
            "--------------------------------------------------\n"
            "SAFETY RULES:\n"
            "- Never give medical diagnosis.\n"
            "- If risk is high, prioritize safety contact info.\n"
            "- Keep responses human-like and concise.\n"
            "- DO NOT mention 'Vector Database' or 'Engine' to the user; refer only to 'my memory' or 'our previous talks'.\n"
        )
        return base_prompt

    async def generate_response(
        self, 
        user_input: str, 
        mental_state: Dict[str, Any], 
        mode: str,
        history: List[Dict[str, str]] = [],
        memory_context: Optional[str] = None
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
        system_prompt = self.get_system_prompt(mode, mental_state, memory_context)
        
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
