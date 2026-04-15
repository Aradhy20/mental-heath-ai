"""
MindfulAI Behavior Change Engine
Tracks the efficacy of AI-driven interventions and adapts recommendations.
"""

from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class BehaviorChangeEngine:
    def __init__(self):
        # In-memory store for efficacy tracking
        # Key: intervention_type, Value: list of success boolean
        self.intervention_history = {
            "SERENITY_BREATHING": [],
            "THOUGHT_REFRAMING": [],
            "GROUNDING_54321": []
        }

    def track_intervention_efficacy(self, intervention_type: str, before_stress: float, after_stress: float):
        """
        Calculates if an intervention successfully lowered stress.
        """
        if intervention_type not in self.intervention_history:
            self.intervention_history[intervention_type] = []
        
        # Success = Stress dropped by at least 0.05 (5%)
        success = after_stress < (before_stress - 0.05)
        self.intervention_history[intervention_type].append(success)
        
        logger.info(f"Intervention {intervention_type} Efficacy: {'SUCCESS' if success else 'FAILURE'} (Delta: {before_stress - after_stress:.2f})")
        return success

    def get_success_rate(self, intervention_type: str) -> float:
        """
        Returns the percentage success rate for a given intervention.
        """
        history = self.intervention_history.get(intervention_type, [])
        if not history:
            return 0.0
        return sum(history) / len(history)

    def suggest_optimal_intervention(self, mental_state: Dict[str, Any]) -> str:
        """
        Suggests the intervention with the highest success rate for the current user context.
        """
        # Rank by success rate
        rates = {k: self.get_success_rate(k) for k in self.intervention_history.keys()}
        ranked = sorted(rates.items(), key=lambda x: x[1], reverse=True)
        
        # Default fallback
        if not ranked:
            return "SERENITY_BREATHING"
            
        return ranked[0][0]

# Singleton instance
behavior_change_engine = BehaviorChangeEngine()
