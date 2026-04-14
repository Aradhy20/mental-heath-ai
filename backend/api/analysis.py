from fastapi import APIRouter, Depends, HTTPException
from models import TextAnalysisRequest, VoiceAnalysisRequest, FaceAnalysisRequest, ChatRequest, AnalysisResult
from ml.engines.chatbot.chatbot_engine import MentalHealthChatbot
from ml.engines.face.face_engine import FaceEngine
from ml.engines.voice.inference.voice_analyzer import VoiceAnalyzer
from database import analysis_logs_collection
from core.security import get_optional_user
import datetime
import base64
import numpy as np
import cv2
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(tags=["AI Analysis 2.0"])

# Initialize Engines
chatbot = MentalHealthChatbot()
face_engine = FaceEngine()
voice_analyzer = VoiceAnalyzer()

# ── Voice Emotion (ML + Heuristics) ───────────────────────────────────────────
@router.post("/voice-analysis", response_model=AnalysisResult)
async def analyze_voice(req: VoiceAnalysisRequest, user_id: str = Depends(get_optional_user)):
    try:
        # Decode base64 audio
        audio_bytes = base64.b64decode(req.audio_base64)
        
        # Process with VoiceAnalyzer
        label, score, confidence = voice_analyzer.analyze_stress(audio_bytes)
        
        result = AnalysisResult(
            label=label,
            score=score,
            confidence=confidence
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Audio processing failed: {str(e)}")
    
    # Persist
    log_entry = {
        "user_id": user_id,
        "type": "voice",
        "result": result.model_dump(),
        "timestamp": datetime.datetime.now(datetime.timezone.utc)
    }
    await analysis_logs_collection.insert_one(log_entry)
    
    return result

# ── Text Emotion (LLM Powered) ──────────────────────────────────────────────
@router.post("/text-analysis", response_model=AnalysisResult)
async def analyze_text(req: TextAnalysisRequest, user_id: str = Depends(get_optional_user)):
    # Use SmolLM2 for zero-shot mood analysis
    analysis = chatbot.get_mood_analysis(req.text)
    
    result = AnalysisResult(
        label=analysis.get("mood", "neutral"),
        confidence=analysis.get("confidence", 0.5),
        analysis=f"LLM-derived sentiment for: {req.text[:30]}..."
    )
    
    # Persist to NoSQL (MongoDB)
    log_entry = {
        "user_id": user_id,
        "type": "text",
        "input": req.text[:500],
        "result": result.model_dump(),
        "timestamp": datetime.datetime.now(datetime.timezone.utc)
    }
    await analysis_logs_collection.insert_one(log_entry)
    
    return result

# ── Facial Emotion (MediaPipe Powered) ────────────────────────────────────────
@router.post("/face-analysis", response_model=AnalysisResult)
async def analyze_face(req: FaceAnalysisRequest, user_id: str = Depends(get_optional_user)):
    try:
        # Decode base64 image
        header, data = req.image_base64.split(",", 1) if "," in req.image_base64 else (None, req.image_base64)
        image_bytes = base64.b64decode(data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Process with FaceEngine
        analysis = face_engine.process_frame(frame)
        
        result = AnalysisResult(
            label=analysis["emotion"],
            confidence=analysis["confidence"],
            analysis=f"MediaPipe Face Analysis (Detected: {analysis['detected']})"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image processing failed: {str(e)}")
    
    # Persist
    log_entry = {
        "user_id": user_id,
        "type": "face",
        "result": result.model_dump(),
        "timestamp": datetime.datetime.now(datetime.timezone.utc)
    }
    await analysis_logs_collection.insert_one(log_entry)
    
    return result

# Legacy chat removed. Use the new v3.0 Intelligent Chat API at /api/v1/chat

# ── Dashboard Stats (Synthetic Data Integration) ──────────────────────────
@router.get("/dashboard/stats")
async def get_dashboard_stats(user_id: str = Depends(get_optional_user)):
    # In a real app, query your SQLite or NoSQL DB here
    # For this demo, we'll return the aggregate stats derived from our database logic
    return {
        "wellness_score": 82,
        "stress_index": 0.24,
        "sleep_quality": "72%",
        "active_sessions": 12,
        "timeline": [
            { "time": 'Mon', "mood": 4 },
            { "time": 'Tue', "mood": 3 },
            { "time": 'Wed', "mood": 2 },
            { "time": 'Thu', "mood": 5 },
            { "time": 'Fri', "mood": 4 },
            { "time": 'Sat', "mood": 4 },
            { "time": 'Sun', "mood": 5 },
        ],
        "emotion_distribution": [
            { "name": 'Happy', "value": 35, "color": '#10b981' },
            { "name": 'Anxious', "value": 25, "color": '#8b5cf6' },
            { "name": 'Sad', "value": 20, "color": '#3b82f6' },
            { "name": 'Neutral', "value": 20, "color": '#94a3b8' },
        ],
        "insights": [
            { "title": "Anomaly Detected", "time": "12m ago", "desc": "Slight tremor picked up in voice frequency. Rest is advised." },
            { "title": "Peak Resilience", "time": "2h ago", "desc": "Your cognitive load capacity is at an all-time high today." }
        ]
    }
