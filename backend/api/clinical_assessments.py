from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from core.security import get_optional_user
from datetime import datetime

router = APIRouter(prefix="/clinical", tags=["Clinical Assessments"])

class AssessmentResponse(BaseModel):
    test_type: str # PHQ-9 or GAD-7
    answers: List[int] # Scores 0-3 for each question
    user_id: str

@router.post("/score")
async def score_assessment(res: AssessmentResponse):
    """
    Calculates the clinical score and risk level for standardized tests.
    """
    total_score = sum(res.answers)
    
    severity = "Minimal"
    if res.test_type == "PHQ-9":
        # PHQ-9 Scoring: 0-4 none, 5-9 mild, 10-14 mod, 15-19 mod-severe, 20-27 severe
        if total_score >= 20: severity = "Severe"
        elif total_score >= 15: severity = "Moderately Severe"
        elif total_score >= 10: severity = "Moderate"
        elif total_score >= 5: severity = "Mild"
    elif res.test_type == "GAD-7":
        # GAD-7 Scoring: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe
        if total_score >= 15: severity = "Severe"
        elif total_score >= 10: severity = "Moderate"
        elif total_score >= 5: severity = "Mild"

    return {
        "test_type": res.test_type,
        "total_score": total_score,
        "severity": severity,
        "timestamp": datetime.now().isoformat(),
        "clinical_note": f"Result indicates '{severity}' symptoms. This is a screening tool, not a diagnosis."
    }

@router.get("/questions/{test_type}")
async def get_questions(test_type: str):
    """
    Returns the questions for PHQ-9 or GAD-7.
    """
    if test_type == "PHQ-9":
        return [
            "Little interest or pleasure in doing things?",
            "Feeling down, depressed, or hopeless?",
            "Trouble falling or staying asleep, or sleeping too much?",
            "Feeling tired or having little energy?",
            "Poor appetite or overeating?",
            "Feeling bad about yourself or that you are a failure?",
            "Trouble concentrating on things, such as reading or TV?",
            "Moving or speaking so slowly that others could have noticed?",
            "Thoughts that you would be better off dead, or of hurting yourself?"
        ]
    elif test_type == "GAD-7":
        return [
            "Feeling nervous, anxious or on edge?",
            "Not being able to stop or control worrying?",
            "Worrying too much about different things?",
            "Trouble relaxing?",
            "Being so restless that it is hard to sit still?",
            "Becoming easily annoyed or irritable?",
            "Feeling afraid as if something awful might happen?"
        ]
    raise HTTPException(status_code=404, detail="Test type not found.")
