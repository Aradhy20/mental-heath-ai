from fastapi import APIRouter, Depends, HTTPException
from models import TextAnalysisRequest, VoiceAnalysisRequest, FaceAnalysisRequest, ChatRequest, AnalysisResult
from ai_modules.text_processor import text_analyzer
from ai_modules.voice_processor import voice_analyzer
from ai_modules.face_processor import face_analyzer
from ai_modules.rag_chatbot import chat_with_persona
from database import analysis_logs_collection
from core.security import get_optional_user
import datetime
from zoneinfo import ZoneInfo
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(tags=["Analysis Modules"])

# ── Text Emotion ──────────────────────────────────────────────────────────────
@router.post("/text-analysis", response_model=AnalysisResult)
async def analyze_text(req: TextAnalysisRequest, user_id: str = Depends(get_optional_user)):
    result = text_analyzer.analyze(req.text)
    
    # Persist to NoSQL (MongoDB)
    log_entry = {
        "user_id": user_id,
        "type": "text",
        "input": req.text[:500], # truncation for DB safety
        "result": result.model_dump(),
        "timestamp": datetime.datetime.now(datetime.timezone.utc)
    }
    await analysis_logs_collection.insert_one(log_entry)
    
    return result

# ── Voice Stress ──────────────────────────────────────────────────────────────
@router.post("/voice-analysis", response_model=AnalysisResult)
async def analyze_voice(req: VoiceAnalysisRequest, user_id: str = Depends(get_optional_user)):
    result = voice_analyzer.analyze(req.audio_base64)
    
    # Persist to NoSQL (MongoDB)
    log_entry = {
        "user_id": user_id,
        "type": "voice",
        "result": result.model_dump(),
        "timestamp": datetime.datetime.now(datetime.timezone.utc)
    }
    await analysis_logs_collection.insert_one(log_entry)
    
    return result

# ── Facial Emotion ────────────────────────────────────────────────────────────
@router.post("/face-analysis", response_model=AnalysisResult)
async def analyze_face(req: FaceAnalysisRequest, user_id: str = Depends(get_optional_user)):
    result = face_analyzer.analyze(req.image_base64)
    
    # Persist to NoSQL (MongoDB)
    log_entry = {
        "user_id": user_id,
        "type": "face",
        "result": result.model_dump(),
        "timestamp": datetime.datetime.now(datetime.timezone.utc)
    }
    await analysis_logs_collection.insert_one(log_entry)
    
    return result

# ── Chat (Persona) ────────────────────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str
    content: str

class PersonaChatRequest(BaseModel):
    prompt: str
    persona: Optional[str] = "companion"   # companion | guide | neurologist | career
    history: Optional[List[ChatMessage]] = []

@router.post("/chat")
async def therapy_chat(req: PersonaChatRequest, user_id: str = Depends(get_optional_user)):
    history = [{"role": m.role, "content": m.content} for m in (req.history or [])]
    response = await chat_with_persona(req.prompt, req.persona or "companion", history)
    return {"response": response, "persona": req.persona, "user_id": user_id}
