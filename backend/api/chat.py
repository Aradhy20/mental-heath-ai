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

from ai.digital_twin import digital_twin
from ai.voice_interface import voice_interface
from ai.chatbot_engine import chatbot_engine
from core.logging import log

router = APIRouter(tags=["Intelligent Chat"])

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []
    use_voice_features: Optional[bool] = False
    # Bio-data: audio_features (MFCC array), face_landmarks, face_confidence
    biometrics: Optional[Dict[str, Any]] = None

@router.post("/chat", summary="Process chat through the AI Mental Health OS")
async def intelligent_chat(
    req: ChatRequest,
    user_id: str = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    from fastapi.responses import StreamingResponse
    import json

    async def event_generator():
        try:
            async for chunk in chatbot_engine.get_response_stream(
                user_id=user_id,
                message=req.message,
                bio_data=req.biometrics,
                db=db
            ):
                # Format as SSE
                yield f"data: {json.dumps(chunk)}\n\n"
        except Exception as e:
            log.error(f"STREAM ERROR: {e}")
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/profile/twin", summary="Get Digital Twin profile for the current user")
async def get_digital_twin_profile(
    user_id: str = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    """Returns the user's Digital Twin — resilience, stress trend, vulnerability windows."""
    try:
        profile = await digital_twin.update_profile(user_id, db)
        return profile
    except Exception as e:
        log.error(f"Digital Twin error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Could not fetch digital twin profile.")
