"""
MindfulAI Voice Chat API
Supports multimodal audio interactions (STT -> Chatbot -> TTS).
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from core.security import get_optional_user
from ai.chatbot_engine import chatbot_engine
from ai.voice_interface import voice_interface
from core.logging import log

router = APIRouter(tags=["Voice Interaction"])

@router.post("/voice", summary="Process audio message through AI Voice Pipeline")
async def voice_chat(
    audio: UploadFile = File(...),
    user_id: str = Depends(get_optional_user)
):
    try:
        # 1. Read Audio
        audio_bytes = await audio.read()
        
        # 2. STT (Speech to Text)
        user_text = await voice_interface.speech_to_text(audio_bytes)
        log.info(f"Voice Input: {user_text}")
        
        if not user_text.strip():
            return {
                "message": "I couldn't hear you clearly. Could you say that again?",
                "voice_audio": ""
            }

        # 3. Process via Chatbot Engine
        response_pkg = await chatbot_engine.get_response(
            user_id=user_id,
            message=user_text
        )
        
        # 4. TTS (Text to Speech)
        voice_audio = await voice_interface.text_to_speech(response_pkg["message"])
        
        return {
            "user_text": user_text,
            "message": response_pkg["message"],
            "voice_audio": voice_audio,
            "emotion": response_pkg["emotion"],
            "risk_level": response_pkg["risk_level"]
        }

    except Exception as e:
        log.error(f"VOICE API ERROR: {e}")
        raise HTTPException(status_code=500, detail="Voice pipeline failed.")
