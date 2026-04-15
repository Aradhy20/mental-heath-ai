"""
MindfulAI Self-Learning Loop
============================
Closes the therapeutic feedback loop by ingesting session outcome data
and using it to continuously refine agent behavior and intervention selection.

Learning Sources:
    1. Explicit feedback  — User rates the session (1–5 stars)
    2. Biometric delta    — HRV/vocal stress dropped after intervention
    3. Re-engagement      — User returns within 24 h (positive signal)

Outputs:
    - Updated BehaviorChangeEngine weights
    - Periodic "Insight Reports" surfaced to the therapist dashboard
"""

from __future__ import annotations

import json
import logging
import math
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional

from .behavior_change_engine import behavior_change_engine

logger = logging.getLogger(__name__)

# Persist learning state locally (swap for DB in production)
_STORE_PATH = Path(__file__).parent / "_learning_store.json"


class LearningLoop:
    """
    Incremental online-learning engine for therapeutic intervention selection.
    Uses a confidence-weighted UCB-style update rule.
    """

    def __init__(self):
        self._store: Dict[str, List[float]] = defaultdict(list)
        self._load()

    # ── Persistence ──────────────────────────────────────────────────────────

    def _load(self):
        if _STORE_PATH.exists():
            try:
                with open(_STORE_PATH) as f:
                    self._store = defaultdict(list, json.load(f))
            except Exception:
                pass

    def _save(self):
        try:
            _STORE_PATH.parent.mkdir(parents=True, exist_ok=True)
            with open(_STORE_PATH, "w") as f:
                json.dump(dict(self._store), f, indent=2)
        except Exception as e:
            logger.warning(f"LearningLoop persistence failed: {e}")

    # ── Ingestion ─────────────────────────────────────────────────────────────

    def ingest_outcome(
        self,
        intervention_type: str,
        *,
        explicit_rating: Optional[int] = None,   # 1–5
        stress_before: Optional[float] = None,
        stress_after: Optional[float] = None,
        re_engaged: bool = False,
    ) -> Dict:
        """
        Record a session outcome for a given intervention.
        Returns the updated utility score.
        """
        # Convert signals to a normalised reward in [0, 1]
        reward = self._compute_reward(
            explicit_rating=explicit_rating,
            stress_before=stress_before,
            stress_after=stress_after,
            re_engaged=re_engaged,
        )

        self._store[intervention_type].append(reward)
        self._save()

        # Mirror into BehaviorChangeEngine for real-time decisions
        if stress_before is not None and stress_after is not None:
            behavior_change_engine.track_intervention_efficacy(
                intervention_type, stress_before, stress_after
            )

        utility = self.get_utility(intervention_type)
        logger.info(
            f"[LearningLoop] {intervention_type} → reward={reward:.3f} | "
            f"utility={utility:.3f} | n={len(self._store[intervention_type])}"
        )
        return {"intervention": intervention_type, "reward": reward, "utility": utility}

    # ── Utility Estimation ────────────────────────────────────────────────────

    def get_utility(self, intervention_type: str) -> float:
        """
        UCB1-style utility:  mean_reward + sqrt(2 * ln(N) / n_i)
        where N = total observations, n_i = observations for this intervention.
        """
        rewards = self._store.get(intervention_type, [])
        if not rewards:
            return 0.5  # optimistic prior

        n_total = sum(len(v) for v in self._store.values())
        n_i     = len(rewards)
        mean    = sum(rewards) / n_i
        explore = math.sqrt(2 * math.log(max(n_total, 1)) / n_i)
        return min(mean + explore, 1.0)

    def rank_interventions(self) -> List[Dict]:
        """Returns all known interventions ranked by UCB1 utility."""
        known = list(self._store.keys())
        if not known:
            known = list(behavior_change_engine.intervention_history.keys())

        ranked = sorted(
            [{"intervention": k, "utility": self.get_utility(k)} for k in known],
            key=lambda x: x["utility"],
            reverse=True,
        )
        return ranked

    # ── Insight Report ────────────────────────────────────────────────────────

    def generate_insight_report(self) -> Dict:
        """
        Synthesizes learning data into a human-readable clinical insight.
        Intended for the therapist dashboard.
        """
        ranked = self.rank_interventions()
        total_sessions = sum(len(v) for v in self._store.values())

        best  = ranked[0]["intervention"]  if ranked else "N/A"
        worst = ranked[-1]["intervention"] if len(ranked) > 1 else "N/A"

        return {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "total_sessions_learned": total_sessions,
            "best_intervention": best,
            "least_effective": worst,
            "ranked_interventions": ranked,
            "clinical_note": (
                f"Based on {total_sessions} recorded sessions, "
                f"'{best}' shows the highest therapeutic utility. "
                f"Consider prioritising it for users with similar profiles."
            ),
        }

    # ── Private Helpers ───────────────────────────────────────────────────────

    @staticmethod
    def _compute_reward(
        *,
        explicit_rating: Optional[int],
        stress_before: Optional[float],
        stress_after: Optional[float],
        re_engaged: bool,
    ) -> float:
        scores = []

        if explicit_rating is not None:
            scores.append((explicit_rating - 1) / 4.0)  # → [0, 1]

        if stress_before is not None and stress_after is not None:
            delta = stress_before - stress_after          # positive = improvement
            scores.append(min(max(delta + 0.5, 0.0), 1.0))

        if re_engaged:
            scores.append(0.8)  # re-engagement is a strong positive signal

        return sum(scores) / len(scores) if scores else 0.5  # neutral if no signal


# ── FastAPI-ready helper endpoints (wired into main.py) ─────────────────────

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/learning", tags=["Self-Learning Loop"])
learning_loop = LearningLoop()


class OutcomePayload(BaseModel):
    intervention_type: str
    explicit_rating: Optional[int] = None
    stress_before: Optional[float] = None
    stress_after: Optional[float] = None
    re_engaged: bool = False


@router.post("/outcome")
def record_outcome(payload: OutcomePayload):
    """Record a session outcome to improve intervention selection."""
    return learning_loop.ingest_outcome(
        payload.intervention_type,
        explicit_rating=payload.explicit_rating,
        stress_before=payload.stress_before,
        stress_after=payload.stress_after,
        re_engaged=payload.re_engaged,
    )


@router.get("/insights")
def get_insights():
    """Returns a clinical insight report for the therapist dashboard."""
    return learning_loop.generate_insight_report()


@router.get("/rank")
def rank_interventions():
    """Returns all interventions ranked by therapeutic utility."""
    return {"ranked": learning_loop.rank_interventions()}
