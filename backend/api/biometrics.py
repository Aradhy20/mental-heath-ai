from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
import random
from datetime import datetime

router = APIRouter(prefix="/biometrics", tags=["Biometrics"])

class WearableData(BaseModel):
    user_id: str
    heart_rate: int
    hrv_score: float # Heart Rate Variability (0-100)
    breath_rate: Optional[int] = 16
    timestamp: datetime = datetime.now()

# In-memory store for simulation
biometric_history = {}

@router.post("/update")
async def update_biometrics(data: WearableData):
    """
    Ingests data from wearable devices.
    In a real scenario, this would connect to Apple HealthKit or Google Fit.
    """
    biometric_history[data.user_id] = data
    return {"status": "success", "message": "Biometrics updated", "data": data}

@router.get("/status/{user_id}")
async def get_status(user_id: str):
    """
    Returns the current biometric status for a user.
    If no data exists, returns a neutral mock state.
    """
    data = biometric_history.get(user_id)
    if not data:
        return {
            "status": "neutral",
            "hrv": 55.0,
            "stress_indicator": "unknown",
            "message": "Waiting for wearable sync..."
        }
    
    # Simple logic: HRV < 35 usually indicates high physiological stress
    stress_level = "low"
    if data.hrv_score < 35:
        stress_level = "high"
    elif data.hrv_score < 50:
        stress_level = "medium"
        
    return {
        "status": "active",
        "hrv": data.hrv_score,
        "heart_rate": data.heart_rate,
        "stress_indicator": stress_level,
        "timestamp": data.timestamp
    }

@router.get("/simulate/{user_id}")
async def simulate_wearable(user_id: str):
    """
    Utility endpoint to simulate a wearable data burst.
    """
    mock_data = WearableData(
        user_id=user_id,
        heart_rate=random.randint(60, 110),
        hrv_score=random.uniform(20.0, 85.0),
        breath_rate=random.randint(12, 22)
    )
    biometric_history[user_id] = mock_data
    return mock_data
