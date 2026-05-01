from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from core.security import get_current_user

router = APIRouter(tags=["Daily Check-In API"])

@router.post("/checkin", summary="Daily Structured Check-In")
async def checkin_route(mood_score: int, sleep: float, user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        from models import MoodLog
        import uuid
        import datetime
        
        entry = MoodLog(
            id=str(uuid.uuid4()),
            user_id=user_id,
            score=str(mood_score),
            sleep_hours=str(sleep),
            note="Daily Check-in",
            energy_level="5",
            created_at=datetime.datetime.utcnow()
        )
        db.add(entry)
        await db.commit()
        return {
            "status": "success",
            "progress_message": "Check-in logged correctly for Digital Twin"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
