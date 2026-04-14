"""
MindfulAI Voice Interaction API
Endpoint for Alexa-like audio interactions.
"""

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from typing import Optional, Dict, Any
from core.security import get_optional_user
from database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
import base64

# Import Intelligence Layer
from ai.voice_interface import voice_interface
from ai.mental_engine import mental_engine
from ai.decision_engine import decision_engine
from ai.conversation_engine import conversation_engine
from ai.action_engine import action_engine
from core.logging import log

router = APIRouter(tags=["Voice Interaction"])

@router.post("/voice", summary="Process audio input through the Voice AI Pipeline")
async def process_voice(
    audio: UploadFile = File(...),
    user_id: str = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        log.info("Voice Pipeline Start: Received Audio Blob")
        audio_data = await audio.read()
        
        # 1. STT (Speech-to-Text)
        transcript = await voice_interface.transcribe_audio(audio_data)
        log.info(f"Stage 1: STT Complete (Transcript: '{transcript[:30]}...')")

        # 2. Mental Engine (Multi-Modal Analysis)
        # Note: We pass BOTH transcript AND raw audio for emotional prosody analysis
        mental_state = await mental_engine.analyze_state(
            text=transcript, 
            audio_data=audio_data, 
            user_id=user_id, 
            db=db
        )
        log.info(f"Stage 2: Analysis Complete (Emotion: {mental_state.get('emotion')})")

        # 3. Decision Engine (Mode Selection)
        decision = decision_engine.determine_path(mental_state)
        log.info(f"Stage 3: Decision Complete (Mode: {decision['selected_mode']})")

        # 4. Conversation Engine (Empathetic Response)
        response_data = await conversation_engine.generate_response(
            user_input=transcript,
            mental_state=mental_state,
            mode=decision['selected_mode']
        )
        log.info("Stage 4: Response Generated")

        # 5. TTS (Text-to-Speech)
        voice_output = await voice_interface.generate_speech(response_data["message"])
        log.info("Stage 5: TTS Complete (Audio Generated)")

        # 6. Action Suggestion
        recommended_action = action_engine.suggest_action(mental_state)

        return {
            "transcript": transcript,
            "message": response_data["message"],
            "voice_audio": voice_output,
            "emotion": mental_state.get("emotion"),
            "risk_level": mental_state.get("risk_level"),
            "mode": decision['selected_mode'],
            "recommended_action": recommended_action
        }

    except Exception as e:
        log.error(f"VOICE PIPELINE ERROR: {e}")
        raise HTTPException(status_code=500, detail="Voice Intelligence Pipeline failed.")
