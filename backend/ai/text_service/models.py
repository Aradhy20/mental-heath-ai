from pydantic import BaseModel
from typing import Optional, List, Dict

class TextInput(BaseModel):
    text: str
    user_id: int

class TextAnalysisResult(BaseModel):
    text_id: int
    user_id: int
    input_text: str
    emotion_label: str
    emotion_score: float
    confidence: float

class TextAnalysisResponse(BaseModel):
    result: TextAnalysisResult
    message: str

# New models for RAG-based analysis
class ContextualAnalysisRequest(BaseModel):
    text: str
    user_id: int

class KnowledgeDocument(BaseModel):
    id: str
    content: str
    metadata: Optional[Dict]
    distance: Optional[float]

class ContextualAnalysisResult(BaseModel):
    emotion_analysis: Dict
    contextual_response: str
    relevant_knowledge: List[KnowledgeDocument]
    risk_level: str
    recommendations: List[str]

class ContextualAnalysisResponse(BaseModel):
    result: ContextualAnalysisResult
    message: str

class WellnessFactorsInput(BaseModel):
    mood_score: Optional[float] = 50.0
    anxiety_level: Optional[float] = 50.0
    stress_level: Optional[float] = 50.0
    sleep_quality: Optional[float] = 50.0
    exercise_frequency: Optional[float] = 50.0
    social_interaction: Optional[float] = 50.0
    medication_adherence: Optional[float] = 100.0
    therapy_attendance: Optional[float] = 100.0
    meditation_practice: Optional[float] = 0.0
    journaling_frequency: Optional[float] = 0.0
    substance_use: Optional[float] = 0.0
    self_harm_thoughts: Optional[float] = 0.0

class WellnessScoreResult(BaseModel):
    overall_score: float
    category_scores: Dict[str, float]
    strengths: List[str]
    areas_for_improvement: List[str]
    recommendations: List[str]
    trend: str

class WellnessResponse(BaseModel):
    result: WellnessScoreResult
    message: str

class GoalRequest(BaseModel):
    user_id: int
    user_profile: Optional[Dict] = None
    wellness_data: Optional[Dict] = None
    therapy_notes: Optional[List[Dict]] = None

class GoalItem(BaseModel):
    title: str
    description: str
    category: str
    difficulty: str
    target_date: str
    milestones: List[str]

class GoalsResponse(BaseModel):
    result: List[GoalItem]
    message: str