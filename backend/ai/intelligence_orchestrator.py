"""
MindfulAI Intelligence Orchestrator — Swarm Protocol (v4.0)
============================================================
Central controller upgraded to an Agentic Swarm architecture.
Four specialist agents deliberate in parallel before any response is delivered.

Pipeline:
    Input → Fusion Analysis → Draft Response → Agent Swarm Deliberation
    → Consensus → Final Output
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from .mental_engine import mental_engine
from .action_engine import action_engine
from .conversation_engine import conversation_engine
from .decision_engine import decision_engine
from .cbt_distortion_engine import cbt_distortion_engine
from .modules.crisis_escalator import crisis_escalator
from .agent_swarm import agent_swarm

logger = logging.getLogger(__name__)


class IntelligenceOrchestrator:
    """
    Orchestrates the full clinical intelligence pipeline using a Multi-Agent Swarm.
    """

    def __init__(self):
        self.session_states: Dict[str, Any] = {}

    async def run_pipeline(
        self,
        user_input: str,
        user_id: str,
        biometrics: Optional[Dict] = None,
        history: List[Dict] = [],
    ) -> Dict[str, Any]:
        """
        Swarm-powered intelligence pipeline.

        Stages
        ------
        1  Multimodal Fusion Analysis
        2  CBT Distortion Detection
        3  Draft Response (Conversation Engine)
        4  Agent Swarm Deliberation  ← new
        5  Consensus Resolution
        6  Packaged Clinical Output
        """
        try:
            # ── 1. MULTIMODAL FUSION ─────────────────────────────────────────
            mental_state = await mental_engine.analyze_state(
                text=user_input,
                wearable_data=biometrics,
                user_id=user_id,
            )
            risk_level = mental_state.get("risk_level", "LOW")

            # ── 2. DECISION & ACTION ─────────────────────────────────────────
            decision           = decision_engine.determine_path(mental_state)
            mode               = decision.get("selected_mode", "SUPPORT")
            recommended_action = action_engine.suggest_action(mental_state)

            # ── 3. CBT DISTORTIONS ───────────────────────────────────────────
            distortions = cbt_distortion_engine.detect_distortions(user_input)

            # ── 4. DRAFT RESPONSE ────────────────────────────────────────────
            memory_context = mental_state.get("historical_context", {}).get("digital_twin_memory")
            draft_data     = await conversation_engine.generate_response(
                user_input=user_input,
                mental_state=mental_state,
                mode=mode,
                history=history,
                memory_context=memory_context,
            )
            draft_response = draft_data.get("message", "I'm here to listen.")

            # ── 5. AGENT SWARM DELIBERATION ──────────────────────────────────
            consensus = await agent_swarm.deliberate(
                user_input=user_input,
                proposed_response=draft_response,
                mental_state=mental_state,
                biometrics=biometrics,
                user_id=user_id,
                distortions=distortions,
            )

            # ── 6. CONSENSUS RESOLUTION ──────────────────────────────────────
            if consensus["consensus"] == "ESCALATE":
                return self._format_escalation(consensus["escalation"])

            if consensus["consensus"] == "VETO":
                return {
                    "success": True,
                    "orchestration_data": {
                        "message": (
                            "I sense this conversation needs a reset. "
                            "I'm here to support your wellbeing safely. "
                            "Let's try a different approach."
                        ),
                        "emotion": mental_state.get("emotion"),
                        "risk_level": risk_level,
                        "mode": "SUPPORT",
                        "action": recommended_action,
                        "swarm_verdict": "VETO",
                        "agent_verdicts": consensus.get("agents", {}),
                    },
                }

            # Enrich output with therapy strategy from swarm
            therapy     = consensus.get("therapy", {})
            fusion_info = consensus.get("fusion", {})

            return {
                "success": True,
                "orchestration_data": {
                    "message":         consensus.get("response", draft_response),
                    "emotion":         mental_state.get("emotion"),
                    "risk_level":      risk_level,
                    "mode":            therapy.get("modality", mode),
                    "action":          recommended_action,
                    "distortions":     distortions,
                    "reframe_hint":    therapy.get("reframe_hint"),
                    "biometrics":      biometrics,
                    "hrv_alert":       fusion_info.get("hrv_alert", False),
                    "confidence":      consensus.get("overall_confidence", mental_state.get("confidence", 0.0)),
                    "swarm_verdict":   consensus["consensus"],
                    "agent_verdicts":  consensus.get("agents", {}),
                },
            }

        except Exception as e:
            logger.error(f"Orchestrator Swarm Failure: {e}", exc_info=True)
            return {
                "success": False,
                "error": str(e),
                "message": "I'm having a momentary lapse in focus. Let's take a slow breath together.",
            }

    # ── Helpers ──────────────────────────────────────────────────────────────

    @staticmethod
    def _format_escalation(escalation_payload: Optional[Dict]) -> Dict:
        regional = escalation_payload.get("regional_support", {}) if escalation_payload else {}
        hotline  = regional.get("hotline", "Emergency Services (112 / 911)")
        return {
            "success": True,
            "orchestration_data": {
                "message": (
                    f"⚠️ I'm deeply concerned about your safety right now. "
                    f"Please reach out immediately: **{hotline}**. "
                    f"You are not alone, and help is available right now."
                ),
                "emotion":        "crisis",
                "risk_level":     "CRITICAL",
                "mode":           "CRISIS",
                "escalation":     escalation_payload,
                "is_escalated":   True,
                "swarm_verdict":  "ESCALATE",
                "agent_verdicts": {"SafetyAuditor": "ESCALATE"},
            },
        }


# ── Singleton ─────────────────────────────────────────────────────────────────
orchestrator = IntelligenceOrchestrator()

