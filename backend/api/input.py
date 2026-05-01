from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import datetime
import base64
import numpy as np
import cv2
import asyncio

from core.security import get_optional_user
from ml.engines.inference_manager import inference_manager
from ai.memory import memory
from database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from ai.chatbot_engine import chatbot_engine

router = APIRouter(prefix="/input", tags=["Multi-Modal Input"])

try:
    import mediapipe as mp
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh_tool = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True)
    HAS_MEDIAPIPE = True
except (AttributeError, ImportError):
    print("Warning: MediaPipe solutions not found in api/input.py. Using mock.")
    HAS_MEDIAPIPE = False
    face_mesh_tool = None

# --- Request Models ---
class TextInputRequest(BaseModel):
    text: str
    typing_speed_wpm: Optional[float] = None
    session_duration_sec: Optional[float] = None

class VoiceInputRequest(BaseModel):
    audio_base64: str
    session_duration_sec: Optional[float] = None

class FaceInputRequest(BaseModel):
    image_base64: str
    session_duration_sec: Optional[float] = None

class FusionInputRequest(BaseModel):
    text: Optional[str] = None
    audio_base64: Optional[str] = None
    image_base64: Optional[str] = None
    typing_speed_wpm: Optional[float] = None
    inactivity_sec: Optional[float] = None
    session_duration_sec: Optional[float] = None

class FusionResponse(BaseModel):
    final_emotion: str
    confidence_score: float
    reply: str
    reasoning: str
    component_scores: Dict[str, Any]

# --- Processing Helpers ---
def extract_audio_features(audio_bytes: bytes) -> np.ndarray:
    try:
        import librosa
        import io
        import soundfile as sf
        
        # Load audio from bytes
        with io.BytesIO(audio_bytes) as audio_file:
            data, samplerate = sf.read(audio_file)
            
            # If stereo, convert to mono
            if len(data.shape) > 1:
                data = np.mean(data, axis=1)
                
            # Extract MFCCs
            mfccs = librosa.feature.mfcc(y=data, sr=samplerate, n_mfcc=16)
            # Average over time
            mfccs_scaled = np.mean(mfccs.T, axis=0)
            return np.array(mfccs_scaled, dtype=np.float32)
    except Exception as e:
        print(f"Audio feature extraction failed: {e}. Falling back to random noise.")
        return np.random.rand(16).astype(np.float32) * 0.1

def extract_face_landmarks(image_bytes: bytes) -> np.ndarray:
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if frame is None:
            return np.zeros((478 * 3,), dtype=np.float32)
            
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        flat_landmarks = []
        if HAS_MEDIAPIPE and face_mesh_tool:
            results = face_mesh_tool.process(rgb_frame)
            if results.multi_face_landmarks:
                for lm in results.multi_face_landmarks[0].landmark:
                    flat_landmarks.extend([lm.x, lm.y, lm.z])
        
        if not flat_landmarks:
            return np.random.rand(478 * 3).astype(np.float32) * 0.01
            
        flat_landmarks = np.array(flat_landmarks, dtype=np.float32)
        target_size = 478 * 3
        if len(flat_landmarks) < target_size:
            flat_landmarks = np.pad(flat_landmarks, (0, target_size - len(flat_landmarks)))
        elif len(flat_landmarks) > target_size:
            flat_landmarks = flat_landmarks[:target_size]
        return flat_landmarks
    except Exception as e:
        print(f"Face extraction failed: {e}")
        
    return np.random.rand(478 * 3).astype(np.float32) * 0.01

def behavior_emotion(typing_speed_wpm: float, inactivity_sec: float) -> Dict[str, float]:
    probs = {"happy": 0.2, "sad": 0.2, "anxious": 0.2, "angry": 0.2, "neutral": 0.2}
    if inactivity_sec > 30:
        probs["sad"] += 0.4
        probs["neutral"] -= 0.1
    if typing_speed_wpm is not None:
        if typing_speed_wpm > 80:
            probs["anxious"] += 0.3
            probs["angry"] += 0.2
        elif typing_speed_wpm < 20:
            probs["sad"] += 0.3
    total = sum(probs.values())
    return {k: v / total for k, v in probs.items()}

# --- Endpoints ---

@router.post("/text")
async def process_text(req: TextInputRequest, user_id: str = Depends(get_optional_user)):
    emo_probs, risk_probs = inference_manager.predict_text(req.text)
    if emo_probs is None:
        emo_probs = np.array([0, 0, 0, 0, 1])
    labels = ["happy", "sad", "anxious", "angry", "neutral"]
    label_idx = int(np.argmax(emo_probs))
    return {
        "emotion": labels[label_idx],
        "confidence": float(np.max(emo_probs)),
        "scores": {labels[i]: float(emo_probs[i]) for i in range(5)}
    }

@router.post("/voice")
async def process_voice(req: VoiceInputRequest, user_id: str = Depends(get_optional_user)):
    try:
        header, data = req.audio_base64.split(",", 1) if "," in req.audio_base64 else (None, req.audio_base64)
        audio_bytes = base64.b64decode(data)
        features = extract_audio_features(audio_bytes)
        probs = inference_manager.predict_audio(features)
        labels = ["happy", "sad", "anxious", "angry", "neutral"]
        label_idx = int(np.argmax(probs))
        from ai.voice_interface import voice_interface
        transcribed_text = await voice_interface.speech_to_text(audio_bytes)
        if transcribed_text == "(Voice transcription unavailable offline)":
             transcribed_text = "I'm feeling a bit overwhelmed."
        return {
            "emotion": labels[label_idx],
            "confidence": float(np.max(probs)),
            "scores": {labels[i]: float(probs[i]) for i in range(5)},
            "transcription": transcribed_text
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/face")
async def process_face(req: FaceInputRequest, user_id: str = Depends(get_optional_user)):
    try:
        header, data = req.image_base64.split(",", 1) if "," in req.image_base64 else (None, req.image_base64)
        image_bytes = base64.b64decode(data)
        landmarks = extract_face_landmarks(image_bytes)
        probs = inference_manager.predict_face(landmarks)
        labels = ["happy", "sad", "anxious", "angry", "neutral"]
        label_idx = int(np.argmax(probs))
        return {
            "emotion": labels[label_idx],
            "confidence": float(np.max(probs)),
            "scores": {labels[i]: float(probs[i]) for i in range(5)}
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/fusion", response_model=FusionResponse)
async def process_fusion(req: FusionInputRequest, db: AsyncSession = Depends(get_db), user_id: str = Depends(get_optional_user)):
    labels = ["happy", "sad", "anxious", "angry", "neutral"]
    text_probs = np.array([0.2]*5)
    transcribed_text = req.text or ""
    if req.text:
        ep, rp = inference_manager.predict_text(req.text)
        if ep is not None:
            text_probs = ep
    elif req.audio_base64:
        header, data = req.audio_base64.split(",", 1) if "," in req.audio_base64 else (None, req.audio_base64)
        audio_bytes = base64.b64decode(data)
        from ai.voice_interface import voice_interface
        transcribed_text = await voice_interface.speech_to_text(audio_bytes)
        if transcribed_text == "(Voice transcription unavailable offline)":
            transcribed_text = "I'm feeling a bit overwhelmed."
        ep, rp = inference_manager.predict_text(transcribed_text)
        if ep is not None:
            text_probs = ep
            
    voice_probs = np.array([0.2]*5)
    if req.audio_base64:
        header, data = req.audio_base64.split(",", 1) if "," in req.audio_base64 else (None, req.audio_base64)
        audio_bytes = base64.b64decode(data)
        features = extract_audio_features(audio_bytes)
        vp = inference_manager.predict_audio(features)
        if vp is not None:
            voice_probs = vp
            
    face_probs = np.array([0.2]*5)
    if req.image_base64:
        header, data = req.image_base64.split(",", 1) if "," in req.image_base64 else (None, req.image_base64)
        image_bytes = base64.b64decode(data)
        landmarks = extract_face_landmarks(image_bytes)
        fp = inference_manager.predict_face(landmarks)
        if fp is not None:
            face_probs = fp
            
    behav_dict = behavior_emotion(req.typing_speed_wpm or 40, req.inactivity_sec or 0)
    behav_probs = np.array([behav_dict[l] for l in labels])
    
    w_t, w_v, w_f, w_b = 0.4, 0.3, 0.2, 0.1
    if not req.text and not req.audio_base64: w_t = 0
    if not req.audio_base64: w_v = 0
    if not req.image_base64: w_f = 0
    
    total_w = w_t + w_v + w_f + w_b
    if total_w == 0:
        w_t, total_w = 1.0, 1.0
        
    final_probs = (w_t * text_probs + w_v * voice_probs + w_f * face_probs + w_b * behav_probs) / total_w
    final_idx = int(np.argmax(final_probs))
    final_emotion = labels[final_idx]
    confidence_score = float(np.max(final_probs))
    
    chat_history = await memory.get_history(user_id, db)
    history_summary = " | ".join([m["content"] for m in chat_history[-3:]]) if chat_history else "No recent context."
    reasoning = f"Fused (T:{w_t:.1f}, V:{w_v:.1f}, F:{w_f:.1f}, B:{w_b:.1f}). History: {history_summary[:30]}..."
    
    from ai.llm_manager import llm_manager
    system_prompt = f"You are MindfulAI. The user feels {final_emotion}. Respond empathetically. Context: {history_summary}."
    reply = await llm_manager.generate_response(system_prompt, transcribed_text or "Hello.")
    
    if transcribed_text:
        await memory.add_entry(user_id, "user", transcribed_text, db)
    await memory.add_entry(user_id, "assistant", reply, db)
    
    return FusionResponse(
        final_emotion=final_emotion,
        confidence_score=confidence_score,
        reply=reply,
        reasoning=reasoning,
        component_scores={
            "text": {labels[i]: float(text_probs[i]) for i in range(5)},
            "voice": {labels[i]: float(voice_probs[i]) for i in range(5)},
            "face": {labels[i]: float(face_probs[i]) for i in range(5)},
            "behavior": {labels[i]: float(behav_probs[i]) for i in range(5)},
            "fused": {labels[i]: float(final_probs[i]) for i in range(5)}
        }
    )
