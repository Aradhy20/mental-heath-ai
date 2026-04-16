"""
MindfulAI Conversation Engine
Handles empathetic dialogue generation across multiple therapeutic modes.
"""

from typing import List, Dict
import random
from core.logging import log

class ConversationEngine:
    def __init__(self):
        # Clinical Assistant Templates (Phase 6)
        self.templates = {
            "EMOTIONAL_SUPPORT": [
                "I can acknowledge that shift in your emotional baseline. What happened just before you started feeling this way?",
                "That sounds heavy. Based on our clinical patterns, naming the feeling is the first step. Can we describe it together?",
                "I hear you. Let's look at the data—how does this moment compare to your usual state?"
            ],
            "CBT": [
                "I notice a potential thinking trap here. What evidence supports this thought, and what evidence challenges it?",
                "Let's try a reframe: instead of 'always', can we identify one specific time things were different?",
                "If we look at this objectively, what would be a more balanced perspective to take right now?"
            ],
            "CRISIS": [
                "I have detected a high-priority risk signal. I am initiating our clinical safety protocol now.",
                "Your safety is my only priority right now. Please reach out to one of the professionals listed on your screen.",
                "It sounds like you're in a lot of pain. We need to get you human support immediately. I am escalating this to the monitoring dashboard."
            ],
            "PRODUCTIVITY": [
                "To manage this stress, let's identify one micro-action that takes less than 2 minutes. What's one step?",
                "I see a window for a grounding exercise. Should we try 3 minutes of focused breathing to reset your energy?",
                "Checking your energy levels—which task on your list feels most manageable right now?"
            ]
        }

    async def generate_response(self, user_input: str, mode: str, history: List[Dict], emotion: str):
        """
        Generates a therapeutic response. 
        In production, this calls an LLM (SmolLM/Llama). 
        Here we implement the hybrid logic.
        """
        log.info(f"Generating response in mode: {mode}")

        # 1. System Prompt (as per user request)
        system_prompt = (
            "You are a mental wellness AI assistant.\n"
            "- Be empathetic and calm\n"
            "- Do not give medical advice\n"
            "- Help users reflect and take small steps\n"
            "- Adapt based on emotion and risk level"
        )

        # 2. Mode-Specific Logic
        prefix = ""
        if mode == "CRISIS":
            prefix = "--- 🛡️ SAFETY PRIORITY --- "
        
        # 3. Hybrid Strategy: Try calling LLM (simulated here with templates for speed/reliability)
        # Note: In the actual project mental_engine/inference_utils handles the LLM call.
        
        base_message = random.choice(self.templates.get(mode, self.templates["EMOTIONAL_SUPPORT"]))
        
        # Add dynamic personalization based on emotion
        if emotion == "stressed":
            base_message = f"I can feel the stress in your words. {base_message}"
        elif emotion == "anxious":
            base_message = f"Let's take a deep breath together. {base_message}"

        return {
            "message": f"{prefix}{base_message}",
            "system_prompt_used": system_prompt
        }

conversation_engine = ConversationEngine()
