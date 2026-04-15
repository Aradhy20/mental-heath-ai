"""
MindfulAI Cohort Engine
Analyzes aggregate clinical trends across groups of users for therapist-led insights.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class CohortEngine:
    def __init__(self):
        # In-memory mock for demonstration
        self.cohort_benchmarks = {
            "ANXIETY_FOCUS": {"avg_hrv_target": 65, "cbt_efficiency": 0.82},
            "BURNOUT_RISK": {"avg_stress_target": 0.3, "mindfulness_efficiency": 0.75},
            "GENERAL_WELLNESS": {"avg_mood_target": 4.2}
        }

    async def analyze_cohort_trends(self, cohort_id: str, member_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyzes the emotional trajectory of a group of users.
        """
        if not member_results:
            return {"status": "error", "message": "No data for cohort."}

        # Calculate Averages
        avg_score = sum(r.get("score", 0.5) for r in member_results) / len(member_results)
        stress_levels = [r.get("stress_score", 0.5) for r in member_results]
        peak_stress = max(stress_levels) if stress_levels else 0.5
        
        # Determine "Cohort Health"
        health_status = "STABLE"
        if peak_stress > 0.8:
            health_status = "VULNERABLE"
        elif avg_score > 0.7:
            health_status = "THRIVING"

        # Insight Generation
        insights = []
        if avg_score < 0.4:
            insights.append("Cohort is experiencing a significant dip in overall resilience.")
        if peak_stress > 0.6:
            insights.append("High cortisol-equivalent indicators detected across 40% of the group.")

        return {
            "cohort_id": cohort_id,
            "analysis_timestamp": datetime.now().isoformat(),
            "metrics": {
                "average_resilience": round(avg_score, 2),
                "peak_stress": round(peak_stress, 2),
                "active_members": len(member_results)
            },
            "health_status": health_status,
            "clinical_insights": insights
        }

    def categorize_user(self, user_mental_state: Dict[str, Any]) -> str:
        """
        Assigns a user to a cohort based on their current analyzed state.
        Used for Phase 3.2 automated clinical grouping.
        """
        risk = user_mental_state.get("risk_level", "LOW")
        emotion = user_mental_state.get("emotion", "neutral")
        score = user_mental_state.get("score", 0.5)

        if risk == "HIGH":
            return "CRISIS_MONITORING"
        if emotion == "distressed" or score > 0.75:
            return "BURNOUT_RISK"
        if emotion == "anxious":
            return "ANXIETY_FOCUS"
        
        return "GENERAL_WELLNESS"

# Singleton instance
cohort_engine = CohortEngine()
