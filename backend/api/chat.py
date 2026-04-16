"""
MindfulAI Intelligent Chat API
Unified endpoint for the Mental Health Operating System.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from core.security import get_optional_user
from database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

# Import Intelligence Layer
from ai.mental_engine import mental_engine
from ai.decision_engine import decision_engine
from ai.conversation_engine import conversation_engine
from ai.action_engine import action_engine
from ai.digital_twin import digital_twin
from ai.voice_interface import voice_interface
from ai.chatbot_engine import chatbot_engine
from core.logging import log

router = APIRouter(tags=["Intelligent Chat"])

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []
    use_voice_features: Optional[bool] = False
    biometrics: Optional[Dict[str, Any]] = None # HRV, Heart Rate, etc.

@router.post("/chat", summary="Process chat through the AI Mental Health OS")
async def intelligent_chat(
    req: ChatRequest, 
    user_id: str = Depends(get_optional_user)
):
    try:
        # User Input -> Chatbot Engine
        response_pkg = await chatbot_engine.get_response(
            user_id=user_id,
            message=req.message,
            bio_data=req.biometrics
        )

        # Generate Voice Audio if requested
        voice_audio = None
        if req.use_voice_features:
            voice_audio = await voice_interface.text_to_speech(response_pkg["message"])

        return {
            "message": response_pkg["message"],
            "emotion": response_pkg["emotion"],
            "risk_level": response_pkg["risk_level"],
            "mental_state": response_pkg["mental_state"],
            "modality_contribution": response_pkg["modality_contribution"],
            "recommended_action": response_pkg["recommended_action"],
            "mode": response_pkg["mode"],
            "voice_audio": voice_audio,
            "clinical_justification": response_pkg.get("clinical_justification")
        }

    except Exception as e:
        log.error(f"CHAT API ERROR: {e}")
        raise HTTPException(status_code=500, detail="Chatbot engine failed.")

@router.get("/profile/twin")
async def get_digital_twin_profile(
    user_id: str = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    profile = await digital_twin.update_profile(user_id, db)
    return profile
