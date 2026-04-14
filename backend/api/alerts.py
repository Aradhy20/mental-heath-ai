from fastapi import APIRouter, Depends
from typing import List, Dict
from core.security import get_current_user

router = APIRouter(prefix="/alerts", tags=["Safety & Alerts"])

# In-memory alert store for demo (would be MongoDB in production)
ALERTS_DATA = []

@router.get("/")
async def get_alerts(user_id: str = Depends(get_current_user)):
    """Retrieve any safety alerts for the current user."""
    user_alerts = [a for a in ALERTS_DATA if a["user_id"] == user_id]
    return {"alerts": user_alerts}

@router.post("/crisis-log")
async def log_crisis(user_id: str = Depends(get_current_user)):
    """Logs a high-risk event for provider follow-up."""
    alert = {
        "user_id": user_id,
        "type": "HIGH_RISK_SIGNAL",
        "timestamp": "2026-04-13T22:30:00",
        "action_required": True
    }
    ALERTS_DATA.append(alert)
    return {"status": "logged", "message": "Safety team notified (Simulated)"}

def get_emergency_resources():
    return [
        {"name": "National Crisis Lifeline", "contact": "988"},
        {"name": "Crisis Text Line", "contact": "741741"},
        {"name": "Safe Place", "contact": "Text SAFE to 44321"}
    ]
