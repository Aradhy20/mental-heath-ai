"""
MindfulAI Intelligence Orchestrator (The Brain)
Production-grade central controller for the safety-first emotional OS.
"""

from typing import Dict, List, Any, Optional
from .mental_engine import mental_engine
from .memory_engine import memory_engine
from .action_engine import action_engine
from .conversation_engine import conversation_engine
from .decision_engine import decision_engine
from .cbt_distortion_engine import cbt_distortion_engine
from .modules.safety_guardrails import safety_guardrails
from .modules.crisis_escalator import crisis_escalator
import logging

logger = logging.getLogger(__name__)

class IntelligenceOrchestrator:
    def __init__(self):
        # State tracking (per session)
        self.session_states = {}

    async def run_pipeline(
        self,
        user_input: str,
        user_id: str,
        biometrics: Optional[Dict] = None,
        history: List[Dict] = []
    ) -> Dict[str, Any]:
        """
        Executes the high-fidelity intelligence pipeline with clinical safety guardrails.
        """
        try:
            # 0. ADVERSARIAL CHECK
            if safety_guardrails.is_adversarial(user_input):
                return {
                    "success": True,
                    "orchestration_data": {
                        "message": "I am designed to be a safe, clinical-grade companion. I cannot bypass my safety protocols, but I am here to support your wellness.",
                        "emotion": "neutral",
                        "risk_level": "LOW",
                        "mode": "SUPPORT"
                    }
                }

            # 1. ANALYSIS & FUSION
            mental_state = await mental_engine.analyze_state(
                text=user_input,
                wearable_data=biometrics,
                user_id=user_id
            )
            
            # 2. SAFETY TRIAGE (P0 Override)
            risk_level = mental_state.get("risk_level", "LOW")
            if risk_level == "CRITICAL":
                return await self._handle_crisis_escalation(user_id, mental_state)

            # 3. MEMORY RETRIEVAL
            memory_context = mental_state.get("historical_context", {}).get("digital_twin_memory")

            # 4. DECISION LOGIC
            decision = decision_engine.determine_path(mental_state)
            mode = decision.get("selected_mode", "SUPPORT")

            # 5. ACTION ENGINE
            recommended_action = action_engine.suggest_action(mental_state)

            # 6. CBT DISTORTION ENGINE (Phase 4.2)
            distortions = cbt_distortion_engine.detect_distortions(user_input)

            # 7. CONVERSATION ENGINE (Response)
            response_data = await conversation_engine.generate_response(
                user_input=user_input,
                mental_state=mental_state,
                mode=mode,
                history=history,
                memory_context=memory_context
            )

            # 8. SAFETY FILTERING (Clinical Guardrails)
            safe_message = safety_guardrails.filter_response(response_data["message"], risk_level)

            # 9. CONSOLIDATED EMOTIONAL OBJECT
            return {
                "success": True,
                "orchestration_data": {
                    "message": safe_message,
                    "emotion": mental_state.get("emotion"),
                    "risk_level": risk_level,
                    "mode": mode,
                    "action": recommended_action,
                    "distortions": distortions,
                    "biometrics": biometrics,
                    "confidence": mental_state.get("confidence", 0.0)
                }
            }

        except Exception as e:
            logger.error(f"Orchestrator Pipeline Failure: {e}")
            return {
                "success": False,
                "error": str(e),
                "message": "I'm having a momentary lapse in focus. Let's take a slow breath together."
            }

    async def _handle_crisis_escalation(self, user_id: str, mental_state: Dict) -> Dict:
        """
        Force-overrides normal AI behavior to prioritize safety.
        """
        # In a production-grade system, this would trigger external alerts (SMS/Email)
        return {
            "success": True,
            "orchestration_data": {
                "message": "⚠️ CRITICAL ALERT: I am deeply concerned about what you've shared. Please stop everything and reach out to one of the following emergency resources immediately.",
                "emotion": "crisis",
                "risk_level": "CRITICAL",
                "mode": "CRISIS",
                "action": {
                    "title": "Immediate Safety Referral",
                    "action": "Call Crisis Helpline (988) or Emergency Services (911/112)",
                    "benefit": "Prevents immediate harm and provides expert human intervention."
                },
                "is_escalated": True
            }
        }

# Singleton instance
orchestrator = IntelligenceOrchestrator()
