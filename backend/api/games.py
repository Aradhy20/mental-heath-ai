from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from core.security import get_current_user
from models import MoodGameScore, GameScoreRequest, MoodLog
import uuid
import datetime

router = APIRouter(prefix="/games", tags=["Mood Tracking Games"])

@router.post("/score")
async def save_game_score(
    req: GameScoreRequest,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Saves a game score and its estimated impact on the user's mood.
    High scores in 'Breathe & Match' might correlate with lower stress.
    """
    score_id = str(uuid.uuid4())
    new_score = MoodGameScore(
        id=score_id,
        user_id=user_id,
        game_name=req.game_name,
        score=req.score,
        mood_impact=req.mood_impact
    )
    db.add(new_score)
    
    # Also log a mood entry if the impact is significant
    if abs(req.mood_impact) > 0.5:
        mood_id = str(uuid.uuid4())
        mood_val = 4.0 if req.mood_impact > 0 else 2.0
        new_mood = MoodLog(
            id=mood_id,
            user_id=user_id,
            score=mood_val,
            note=f"Mood updated after playing {req.game_name}. Score: {req.score}",
            feelings="Focus",
            activities="Gaming"
        )
        db.add(new_mood)
        
    await db.commit()
    return {"status": "success", "message": "Score saved and mood impact analyzed."}

@router.get("/recommendations")
async def get_game_recommendations(user_id: str = Depends(get_current_user)):
    """
    Suggests games based on the user's current emotional state.
    """
    # In a real scenario, this would check the latest mood
    return {
        "recommended_games": [
            {
                "id": "match_calm",
                "name": "Zen Match",
                "description": "A relaxing tile-matching game to lower heart rate.",
                "benefit": "Stress Reduction"
            },
            {
                "id": "focus_flow",
                "name": "Focus Flow",
                "description": "Fast-paced cognitive challenge to boost dopamine.",
                "benefit": "Energy Boost"
            }
        ]
    }
