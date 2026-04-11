from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, JSON
from database import Base
import datetime as dt

# ================= SQL MODELS (Identity) =================
class DBUser(Base):
    __tablename__ = "users"
    
    user_id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, default=dt.datetime.utcnow)
    created_at = Column(DateTime, default=dt.datetime.utcnow)

# ================= AUTH REQUESTS/RESPONSES =================
class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    full_name: Optional[str] = None
    phone: Optional[str] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

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
