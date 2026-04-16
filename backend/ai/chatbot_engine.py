"""
MindfulAI Chatbot Core Engine
Orchestrates analysis, risk detection, and response generation.
"""

from ai.feature_pipeline import feature_pipeline
from ai.mental_engine import mental_engine
from ai.risk_detector import risk_detector
from ai.conversation_engine import conversation_engine
from ai.memory import memory
from core.logging import log

class ChatbotEngine:
    def __init__(self):
        log.info("ChatbotEngine Initialized")

    async def get_response(self, user_id: str, message: str, bio_data: dict = None):
        """
        Main pipeline: Input -> Features -> Mental State -> Risk -> Mode -> Memory -> Response
        """
        log.info(f"ChatbotEngine processing message from {user_id}")

        # 1. Detect Risk FIRST (Safety)
        is_crisis, risk_level = risk_detector.check_risk(message)
        
        # 2. Extract Features (Emotion, Text vectors)
        features = feature_pipeline.process_all(text=message)
        
        # 3. Analyze Mental State (Contextual)
        mental_state = await mental_engine.analyze_state(message, wearable_data=bio_data, user_id=user_id)
        
        # 5. Get Session Memory & Data Context
        chat_history = memory.get_history(user_id)
        
        # Prepare context for Agents (Phase 6: Orchestration)
        context_data = {
            "mental_state_vector": mental_state.get("mental_state_vector"),
            "digital_twin_memory": mental_state.get("historical_context", {}).get("digital_twin_memory"),
        # 6. Multi-Agent Collaborative Response (CrewAI)
        from ai.agents import orchestrator
        final_message = await orchestrator.generate_response(
            user_input=message,
            context_data=context_data
        )

        # 7. Store Memory
        memory.add_entry(user_id, "user", message)
        memory.add_entry(user_id, "assistant", final_message)

        return {
            "message": final_message,
            "emotion": mental_state.get("mental_state_vector", {}).get("emotion", "calm"),
            "risk_level": mental_state.get("mental_state_vector", {}).get("risk_level", "LOW"),
            "mental_state": mental_state.get("historical_context", {}).get("trend", "stable"),
            "modality_contribution": mental_state.get("modality_contribution", {"text": 1.0}),
            "recommended_action": mental_state.get("historical_context", {}).get("prediction", "Stay mindful"),
            "mode": "multi-agent-orchestration"
        }

chatbot_engine = ChatbotEngine()
