import uuid
from fastapi import APIRouter, Header, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from pydantic import BaseModel
from typing import Optional, List
from database import get_db
from models import DBWearableData, WearableRequest, LocationRecommendation
from core.security import get_optional_user, get_current_user

router = APIRouter(prefix="/biometrics", tags=["Biometrics"])

@router.post("")
@router.post("/wearable")
async def update_wearable(
    data: WearableRequest, 
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Ingests data from wearable devices (Apple HealthKit / Google Fit).
    """
    wearable_id = str(uuid.uuid4())
    new_data = DBWearableData(
        id=wearable_id,
        user_id=user_id,
        heart_rate=str(data.heart_rate) if data.heart_rate else "0",
        sleep_hours=str(data.sleep_hours) if data.sleep_hours else "0",
        activity_level=data.activity_level or "low"
    )
    db.add(new_data)
    await db.commit()
    return {"status": "success", "message": "Wearable data synced"}

@router.get("/wearable/latest")
async def get_latest_wearable(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(DBWearableData).where(DBWearableData.user_id == user_id).order_by(DBWearableData.created_at.desc()).limit(1)
    result = await db.execute(query)
    data = result.scalars().first()
    
    if not data:
        return {"heart_rate": "N/A", "sleep_hours": "N/A", "activity_level": "N/A"}
        
    return {
        "heart_rate": data.heart_rate,
        "sleep_hours": data.sleep_hours,
        "activity_level": data.activity_level,
        "timestamp": data.created_at
    }

@router.get("/location-recommendations", response_model=List[LocationRecommendation])
async def get_location_recommendations(
    user_id: str = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Mock Google Maps API integration for nearby help.
    In a real-world scenario, this queries the Places API based on user coordinates.
    """
    # Fetch recent wearable data to customize recommendations
    query = select(DBWearableData).where(DBWearableData.user_id == user_id).order_by(DBWearableData.created_at.desc()).limit(1)
    result = await db.execute(query)
    data = result.scalars().first()
    
    recommendations = []
    
    # Base recommendation
    recommendations.append(LocationRecommendation(
        name="Serenity Wellness Center",
        type="Therapist",
        distance="1.2 miles",
        address="123 Calm St"
    ))
    
    if data:
        if data.activity_level == "low":
            recommendations.append(LocationRecommendation(
                name="Anytime Fitness",
                type="Gym",
                distance="0.5 miles",
                address="456 Active Ave"
            ))
        if int(data.heart_rate or 0) > 90 or float(data.sleep_hours or 8) < 6:
            recommendations.append(LocationRecommendation(
                name="Lotus Meditation Center",
                type="Meditation",
                distance="2.0 miles",
                address="789 Peaceful Ln"
            ))
            
    return recommendations
