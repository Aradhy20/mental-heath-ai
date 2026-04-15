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
    user_id: str = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        log.info(f"Pipeline Start: User Input = '{req.message[:50]}...'")

        # 1 & 2. Feature Pipeline + Mental Engine (Analysis)
        mental_state = await mental_engine.analyze_state(
            text=req.message, 
            wearable_data=req.biometrics,
            user_id=user_id, 
            db=db
        )
        log.info(f"Stage 1: Mental State Analyzed (Emotion: {mental_state.get('emotion')})")
        
        # Memory Context (Phase 3.0)
        memory_context = mental_state.get("historical_context", {}).get("digital_twin_memory")

        # 3. Risk Detection (Handled inside mental_engine but verified here)
        risk_level = mental_state.get("risk_level", "LOW")
        log.info(f"Stage 2: Risk Detector (Level: {risk_level})")

        # 4. Decision Engine (Path Selection)
        decision = decision_engine.determine_path(mental_state)
        log.info(f"Stage 3: Decision Engine (Selected Mode: {decision['selected_mode']})")

        # 5. Conversation Engine (Empathetic Generation)
        response_data = await conversation_engine.generate_response(
            user_input=req.message,
            mental_state=mental_state,
            mode=decision['selected_mode'],
            history=req.history,
            memory_context=memory_context
        )
        log.info("Stage 4: Conversation Engine (Response Generated)")

        # 6. Action Engine (Proactive support)
        recommended_action = action_engine.suggest_action(mental_state)

        # 7. Voice Interface (Optional Alexa-like TTS)
        voice_output = ""
        if req.use_voice_features:
            voice_output = await voice_interface.generate_speech(response_data["message"])
            log.info("Stage 5: Voice Interface (TTS Generated)")

        # Persistent Profile Update
        twin_profile = await digital_twin.update_profile(user_id, db)

        return {
            "message": response_data["message"],
            "voice_audio": voice_output,
            "emotion": mental_state.get("emotion"),
            "risk_level": risk_level,
            "mode": decision['selected_mode'],
            "mental_state": mental_state.get("mental_state"),
            "recommended_action": recommended_action,
            "digital_twin": twin_profile,
            "modality_contribution": mental_state.get("modality_contribution")
        }

    except Exception as e:
        log.error(f"INTEGRATION ERROR: {e}")
        raise HTTPException(status_code=500, detail="Intelligence Engine Pipeline failed.")

@router.get("/profile/twin")
async def get_digital_twin_profile(
    user_id: str = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    profile = await digital_twin.update_profile(user_id, db)
    return profile
