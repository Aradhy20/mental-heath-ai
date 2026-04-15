"""
MindfulAI Agent Swarm — Multi-Agent Clinical Intelligence System
================================================================
Four specialized agents negotiate to produce the safest and most
therapeutically effective response before any output is delivered.

Architecture:
    Orchestrator → Swarm → Consensus → Response

Agents:
    1. SafetyAuditorAgent   — Final veto authority on all outputs
    2. TherapyStrategistAgent — Selects CBT / Coaching / Support modality
    3. MemorySynthesisAgent  — Enriches context with Digital Twin data
    4. FusionAnalystAgent    — Interprets multimodal biometric signals
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from .modules.safety_guardrails import safety_guardrails
from .modules.crisis_escalator import crisis_escalator
from .cbt_distortion_engine import cbt_distortion_engine
from .memory_engine import memory_engine
from .behavior_change_engine import behavior_change_engine

logger = logging.getLogger(__name__)


# ─── Agent Result Schema ────────────────────────────────────────────────────

@dataclass
class AgentResult:
    agent_name: str
    verdict: str           # APPROVE | VETO | ESCALATE | SUGGEST
    payload: Dict[str, Any]
    confidence: float = 1.0
    notes: str = ""


# ─── Individual Agents ──────────────────────────────────────────────────────

class SafetyAuditorAgent:
    """P0 authority — can veto any response. Has final say."""

    NAME = "SafetyAuditor"

    def audit(self, user_input: str, proposed_response: str, risk_level: str) -> AgentResult:
        # 1. Adversarial prompt: instant veto
        if safety_guardrails.is_adversarial(user_input):
            return AgentResult(
                agent_name=self.NAME,
                verdict="VETO",
                payload={"reason": "adversarial_input"},
                confidence=1.0,
                notes="Jailbreak or bypass attempt detected."
            )

        # 2. Critical risk: force escalation
        if risk_level == "CRITICAL":
            return AgentResult(
                agent_name=self.NAME,
                verdict="ESCALATE",
                payload=crisis_escalator.get_escalation_package("IND"),
                confidence=1.0,
                notes="Critical risk triggers emergency escalation."
            )

        # 3. Content safety filter
        filtered = safety_guardrails.filter_response(proposed_response, risk_level)
        modified = filtered != proposed_response
        return AgentResult(
            agent_name=self.NAME,
            verdict="APPROVE",
            payload={"safe_response": filtered, "was_modified": modified},
            confidence=0.95 if modified else 1.0,
            notes="Safety filter applied." if modified else "Response cleared."
        )


class TherapyStrategistAgent:
    """Selects the optimal therapeutic modality and enriches the response plan."""

    NAME = "TherapyStrategist"

    MODALITY_MAP = {
        "sadness":   "CBT_REFRAME",
        "anxiety":   "GROUNDING",
        "anger":     "REGULATION",
        "fear":      "EXPOSURE_SUPPORT",
        "neutral":   "SUPPORT",
        "joy":       "REINFORCEMENT",
        "disgust":   "CBT_REFRAME",
        "surprise":  "SUPPORT",
    }

    def strategize(self, emotion: str, distortions: List[Dict], risk_level: str) -> AgentResult:
        modality = self.MODALITY_MAP.get(emotion.lower(), "SUPPORT")

        # Override for high-risk: always lead with stabilisation
        if risk_level in ("HIGH", "CRITICAL"):
            modality = "STABILISATION"

        # If distortions detected, use CBT reframing
        if distortions and risk_level not in ("HIGH", "CRITICAL"):
            modality = "CBT_REFRAME"
            primary_trap = distortions[0]["trap"]
            reframe_hint = distortions[0]["reframe_hint"]
        else:
            primary_trap = None
            reframe_hint = None

        # Suggest the statistically best intervention
        best_intervention = behavior_change_engine.suggest_optimal_intervention({})

        return AgentResult(
            agent_name=self.NAME,
            verdict="SUGGEST",
            payload={
                "modality": modality,
                "primary_distortion": primary_trap,
                "reframe_hint": reframe_hint,
                "recommended_intervention": best_intervention,
            },
            confidence=0.9,
            notes=f"Selected modality: {modality}"
        )


class MemorySynthesisAgent:
    """Retrieves and synthesises Digital Twin context for therapeutic continuity."""

    NAME = "MemorySynthesis"

    async def synthesize(self, user_id: str, user_input: str) -> AgentResult:
        try:
            memories = await memory_engine.retrieve_context(user_id, user_input)
            summary = memories if memories else "No prior context available."
            return AgentResult(
                agent_name=self.NAME,
                verdict="APPROVE",
                payload={"memory_context": summary, "has_history": bool(memories)},
                confidence=0.85,
                notes="Memory context retrieved."
            )
        except Exception as e:
            logger.warning(f"MemorySynthesisAgent failed: {e}")
            return AgentResult(
                agent_name=self.NAME,
                verdict="APPROVE",
                payload={"memory_context": None, "has_history": False},
                confidence=0.5,
                notes="Memory retrieval unavailable; proceeding without context."
            )


class FusionAnalystAgent:
    """Interprets multimodal biometric signals and determines dominant stress channel."""

    NAME = "FusionAnalyst"

    def analyze(self, mental_state: Dict[str, Any], biometrics: Optional[Dict]) -> AgentResult:
        # Identify the dominant distress channel
        modality_weights = mental_state.get("modality_contribution", {})
        dominant = max(modality_weights, key=modality_weights.get) if modality_weights else "text"

        hrv_alert = False
        if biometrics:
            hrv = biometrics.get("hrv_rmssd", 50)
            if hrv < 20:  # Clinical threshold for high sympathetic arousal
                hrv_alert = True

        return AgentResult(
            agent_name=self.NAME,
            verdict="APPROVE",
            payload={
                "dominant_channel": dominant,
                "hrv_alert": hrv_alert,
                "fusion_score": mental_state.get("score", 0.5),
                "resilience": mental_state.get("resilience_score", 0.5),
            },
            confidence=0.9,
            notes=f"Dominant signal: {dominant}. HRV alert: {hrv_alert}"
        )


# ─── Swarm Coordinator ───────────────────────────────────────────────────────

class AgentSwarm:
    """
    Coordinates the four clinical agents and produces a consensus package
    consumed by the IntelligenceOrchestrator.
    """

    def __init__(self):
        self.safety_agent    = SafetyAuditorAgent()
        self.therapy_agent   = TherapyStrategistAgent()
        self.memory_agent    = MemorySynthesisAgent()
        self.fusion_agent    = FusionAnalystAgent()

    async def deliberate(
        self,
        user_input: str,
        proposed_response: str,
        mental_state: Dict[str, Any],
        biometrics: Optional[Dict],
        user_id: str,
        distortions: List[Dict],
    ) -> Dict[str, Any]:
        """
        All four agents run in parallel. Safety has veto power.
        Returns a consensus packet for the orchestrator.
        """
        emotion    = mental_state.get("emotion", "neutral")
        risk_level = mental_state.get("risk_level", "LOW")

        # ── Async parallel execution ─────────────────────────────────────────
        safety_result, memory_result = await asyncio.gather(
            asyncio.to_thread(
                self.safety_agent.audit, user_input, proposed_response, risk_level
            ),
            self.memory_agent.synthesize(user_id, user_input),
        )

        therapy_result = await asyncio.to_thread(
            self.therapy_agent.strategize, emotion, distortions, risk_level
        )

        fusion_result  = await asyncio.to_thread(
            self.fusion_agent.analyze, mental_state, biometrics
        )

        # ── Consensus logic ──────────────────────────────────────────────────
        # Any VETO or ESCALATE from Safety overrides everything
        if safety_result.verdict in ("VETO", "ESCALATE"):
            return {
                "consensus": safety_result.verdict,
                "response": proposed_response,
                "escalation": safety_result.payload if safety_result.verdict == "ESCALATE" else None,
                "agents": {a.agent_name: a.verdict for a in [safety_result, therapy_result, memory_result, fusion_result]},
                "override_reason": safety_result.notes,
            }

        return {
            "consensus": "APPROVE",
            "response": safety_result.payload.get("safe_response", proposed_response),
            "therapy": therapy_result.payload,
            "memory": memory_result.payload,
            "fusion": fusion_result.payload,
            "agents": {
                a.agent_name: a.verdict
                for a in [safety_result, therapy_result, memory_result, fusion_result]
            },
            "overall_confidence": (
                safety_result.confidence * therapy_result.confidence *
                memory_result.confidence * fusion_result.confidence
            ) ** 0.25  # Geometric mean
        }


# ── Singleton ────────────────────────────────────────────────────────────────
agent_swarm = AgentSwarm()
