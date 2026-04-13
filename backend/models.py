from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, JSON
from database import Base
import datetime as dt

# ================= SQL MODELS (Identity) =================
class DBUser(Base):
    __tablename__ = "users"
    
    user_id = Column(String(50), primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255))
    full_name = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, default=dt.datetime.utcnow)
    created_at = Column(DateTime, default=dt.datetime.utcnow)

class MoodLog(Base):
    __tablename__ = "mood_logs"
    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), index=True)
    score = Column(String(50)) # Using string for flexibility, or Integer
    feelings = Column(String(255))
    activities = Column(String(255))
    note = Column(String(500))
    created_at = Column(DateTime, default=dt.datetime.utcnow)

class DBJournal(Base):
    __tablename__ = "journal_entries"
    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), index=True)
    title = Column(String(255))
    content = Column(String(5000))
    tags = Column(String(255))
    sentiment = Column(String(50), default="neutral")
    word_count = Column(String(10), default="0")
    created_at = Column(DateTime, default=dt.datetime.utcnow)
    updated_at = Column(DateTime, default=dt.datetime.utcnow)

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
    token: Optional[str] = None
    token_type: str
    user_id: str
    user: Optional[dict] = None

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

class MoodEntry(BaseModel):
    score: int  # 1-5
    feelings: Optional[List[str]] = []
    activities: Optional[List[str]] = []
    note: Optional[str] = ""
    user_id: Optional[str] = "guest"

class JournalEntry(BaseModel):
    id: Optional[str] = None
    title: str
    content: str
    tags: Optional[List[str]] = []
    sentiment: Optional[str] = "neutral"
    word_count: Optional[int] = 0
    user_id: Optional[str] = "guest"
    
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
