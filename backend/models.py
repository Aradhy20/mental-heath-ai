from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# ================= AUTH MODELS =================
class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class OTPRequest(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None

class OTPVerify(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    otp: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str

# ================= AI MODULE REQUESTS =================
class TextAnalysisRequest(BaseModel):
    text: str

class VoiceAnalysisRequest(BaseModel):
    audio_base64: str

class FaceAnalysisRequest(BaseModel):
    image_base64: str

class FusionRequest(BaseModel):
    text_score: Optional[float] = None
    voice_score: Optional[float] = None
    face_score: Optional[float] = None
    
# ================= CHAT (RAG) MODELS =================
class ChatRequest(BaseModel):
    prompt: str
    context: Optional[str] = None

# ================= DATABASE RESPONSES =================
class AnalysisResult(BaseModel):
    score: float
    label: str
    confidence: float

class SessionDocument(BaseModel):
    user_id: str
    text_score: float
    voice_score: float
    face_score: float
    final_score: float
    risk_level: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
