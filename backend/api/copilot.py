from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import get_optional_user
from database import get_db
from models import (
    AnalyzeEmotionRequest,
    AnalyzeEmotionResponse,
    ChatTherapyRequest,
    ChatTherapyResponse,
    PredictMoodRequest,
    PredictMoodResponse,
    RecommendActionsRequest,
    RecommendActionsResponse,
)
from services.action_engine import ActionEngine
from services.emotion_engine import EmotionEngine
from services.memory_engine import MemoryEngine
from services.prediction_engine import PredictionEngine
from services.therapy_engine import TherapyEngine


router = APIRouter(tags=["AI Emotional Copilot"])

memory_engine = MemoryEngine()
emotion_engine = EmotionEngine()
therapy_engine = TherapyEngine()
prediction_engine = PredictionEngine()
action_engine = ActionEngine()


@router.post("/analyze-emotion", response_model=AnalyzeEmotionResponse)
async def analyze_emotion(
    request: AnalyzeEmotionRequest,
    user_id: str = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    memory = await memory_engine.build_snapshot(db, user_id)
    state = emotion_engine.analyze(request, memory)
    action_bias = memory.helpful_actions[0] if memory.helpful_actions else ""
    action = action_engine.recommend(
        emotion=state.primary_emotion,
        stress_score=state.stress_score,
        energy_score=max(0.1, 1 - state.emotional_fatigue_score),
        available_minutes=(request.context.available_minutes if request.context else 5) or 5,
        memory_bias=action_bias,
    )
    return AnalyzeEmotionResponse(
        emotion=state.primary_emotion,
        confidence=state.confidence,
        risk_level=state.risk_level,
        emotional_fatigue_score=state.emotional_fatigue_score,
        burnout_risk=state.burnout_risk,
        recommended_action=action,
        state=state,
    )


@router.post("/chat-therapy", response_model=ChatTherapyResponse)
async def chat_therapy(
    request: ChatTherapyRequest,
    user_id: str = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    memory = await memory_engine.build_snapshot(db, user_id)
    emotion_request = AnalyzeEmotionRequest(text=request.message, context=request.context)
    state = emotion_engine.analyze(emotion_request, memory)
    therapy = therapy_engine.respond(request, state, memory)
    action_bias = memory.helpful_actions[0] if memory.helpful_actions else ""
    action = action_engine.recommend(
        emotion=state.primary_emotion,
        stress_score=state.stress_score,
        energy_score=max(0.1, 1 - state.emotional_fatigue_score),
        available_minutes=(request.context.available_minutes if request.context else 5) or 5,
        memory_bias=action_bias,
    )
    return ChatTherapyResponse(
        reply=therapy["reply"],
        mode=therapy["mode"],
        detected_distortions=therapy["detected_distortions"],
        risk_level=state.risk_level,
        next_action=action,
        state=state,
        memory_summary=memory.summary if request.include_context else None,
    )


@router.post("/predict-mood", response_model=PredictMoodResponse)
async def predict_mood(
    request: PredictMoodRequest,
    user_id: str = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    return await prediction_engine.predict(db, user_id, request.horizon_days)


@router.post("/recommend-actions", response_model=RecommendActionsResponse)
async def recommend_actions(
    request: RecommendActionsRequest,
    user_id: str = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    memory = await memory_engine.build_snapshot(db, user_id)
    action_bias = memory.helpful_actions[0] if memory.helpful_actions else ""
    action = action_engine.recommend(
        emotion=request.emotion,
        stress_score=request.stress_score,
        energy_score=request.energy_score or 0.5,
        available_minutes=request.available_minutes or 5,
        memory_bias=action_bias,
    )
    return RecommendActionsResponse(
        recommended_actions=[action],
        rationale="Actions are ranked by current emotion, stress load, available time, and recent user history.",
    )
