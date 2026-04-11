from fastapi import APIRouter, Depends
from models import FusionRequest
from database import sessions_collection
from core.security import get_optional_user

router = APIRouter(tags=["Fusion Engine"])

@router.post("/fusion")
async def fuse_modalities(req: FusionRequest, user_id: str = Depends(get_optional_user)):
    # Fallback missing modalities to 0.5
    t_score = req.text_score if req.text_score is not None else 0.5
    v_score = req.voice_score if req.voice_score is not None else 0.5
    f_score = req.face_score if req.face_score is not None else 0.5
    
    # Weighted Average Logic (e.g., Text carries more weight)
    # Weights: Text 40%, Voice 30%, Face 30%
    final_score = (t_score * 0.4) + (v_score * 0.3) + (f_score * 0.3)
    final_score = round(final_score, 2)
    
    # Calculate Risk Category
    if final_score <= 0.3:
        risk_level = "Normal"
        recommendations = "Keep up your positive routine. Your stress metrics are beautifully low."
    elif final_score <= 0.6:
        risk_level = "Mild Stress"
        recommendations = "You are carrying some tension. Consider a 5-minute breathing exercise in the Meditation hub."
    else:
        risk_level = "High Stress"
        recommendations = "Elevated stress detected. Please consult the AI Therapist for grounding techniques."
        
    # Save session back to MongoDB
    session_data = {
        "user_id": user_id,
        "text_score": t_score,
        "voice_score": v_score,
        "face_score": f_score,
        "final_score": final_score,
        "risk_level": risk_level
    }
    
    await sessions_collection.insert_one(session_data)
    
    # Remove Mongo _id before returning
    session_data.pop('_id', None)
    session_data["recommendations"] = recommendations
    
    return session_data
