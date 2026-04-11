from fastapi import APIRouter, Depends, HTTPException
from models import TextAnalysisRequest, VoiceAnalysisRequest, FaceAnalysisRequest, ChatRequest, AnalysisResult
from ai_modules.text_processor import text_analyzer
from ai_modules.voice_processor import voice_analyzer
from ai_modules.face_processor import face_analyzer
from ai_modules.rag_chatbot import chat_with_persona
from core.security import get_current_user
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(tags=["Analysis Modules"])

@router.post("/text-analysis", response_model=AnalysisResult)
async def analyze_text(req: TextAnalysisRequest, user_id: str = Depends(get_current_user)):
    result = text_analyzer.analyze(req.text)
    return result

@router.post("/voice-analysis", response_model=AnalysisResult)
async def analyze_voice(req: VoiceAnalysisRequest, user_id: str = Depends(get_current_user)):
    result = voice_analyzer.analyze(req.audio_base64)
    return result

@router.post("/face-analysis", response_model=AnalysisResult)
async def analyze_face(req: FaceAnalysisRequest, user_id: str = Depends(get_current_user)):
    result = face_analyzer.analyze(req.image_base64)
    return result

class ChatMessage(BaseModel):
    role: str
    content: str

class PersonaChatRequest(BaseModel):
    prompt: str
    persona: Optional[str] = "companion"  # companion | guide | neurologist | career
    history: Optional[List[ChatMessage]] = []

@router.post("/chat")
async def therapy_chat(req: PersonaChatRequest, user_id: str = Depends(get_current_user)):
    history = [{"role": m.role, "content": m.content} for m in (req.history or [])]
    response = await chat_with_persona(req.prompt, req.persona or "companion", history)
    return {"response": response, "persona": req.persona}

