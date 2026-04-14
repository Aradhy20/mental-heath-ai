"""
MindfulAI Feature Extraction Pipeline
Standardizes and extracts features from Text, Audio, and Face inputs.
"""

import numpy as np
import cv2
import io
import re
from typing import Dict, List, Optional, Tuple, Any
import datetime

# Conditional imports for heavy libraries
try:
    import librosa
    HAS_LIBROSA = True
except ImportError:
    HAS_LIBROSA = False

try:
    import mediapipe as mp
    HAS_MEDIAPIPE = True
except ImportError:
    HAS_MEDIAPIPE = False

try:
    from sentence_transformers import SentenceTransformer
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False

class FeaturePipeline:
    def __init__(self):
        # Initialize MediaPipe
        if HAS_MEDIAPIPE:
            self.mp_face_mesh = mp.solutions.face_mesh
            self.face_mesh = self.mp_face_mesh.FaceMesh(
                static_image_mode=True,
                max_num_faces=1,
                refine_landmarks=True
            )
        
        # Initialize Text Embedder
        self.text_model = None
        if HAS_TRANSFORMERS:
            try:
                self.text_model = SentenceTransformer('all-MiniLM-L6-v2')
            except Exception as e:
                print(f"Text model load error: {e}")

        # Stress Keywords
        self.STRESS_KEYWORDS = ["tired", "alone", "overwhelmed", "exhausted", "hopeless", "sad", "anxious", "scared"]

    # ─── STEP 1: INPUT STANDARDIZATION ───────────────────────────────────────────

    def standardize_text(self, text: str) -> str:
        """Lowercase, remove special chars, tokenize basically"""
        text = text.lower()
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        return text

    def standardize_audio(self, audio_data: bytes) -> Tuple[np.ndarray, int]:
        """Convert to mono, 16kHz, normalize if librosa available"""
        if not HAS_LIBROSA:
            return np.array([]), 0
        
        try:
            audio_buffer = io.BytesIO(audio_data)
            audio, sr = librosa.load(audio_buffer, sr=16000, mono=True)
            # Normalize
            audio = librosa.util.normalize(audio)
            return audio, sr
        except Exception as e:
            print(f"Audio standardization error: {e}")
            return np.array([]), 0

    def standardize_face(self, frame: np.ndarray) -> np.ndarray:
        """Resize 224x224, normalize"""
        try:
            face_res = cv2.resize(frame, (224, 224))
            face_norm = face_res.astype(np.float32) / 255.0
            return face_norm
        except Exception as e:
            print(f"Face standardization error: {e}")
            return frame

    # ─── STEP 2: TEXT FEATURES ────────────────────────────────────────────────────

    def extract_text_features(self, text: str) -> Dict[str, Any]:
        raw_text = text
        clean_text = self.standardize_text(text)
        
        # Embeddings
        embedding = []
        if self.text_model:
            embedding = self.text_model.encode(raw_text).tolist()

        # Psychological Indicators
        words = clean_text.split()
        first_person_count = sum(1 for w in words if w in ['i', 'me', 'my', 'mine', 'myself'])
        negative_words = sum(1 for w in words if w in ['not', 'no', 'never', 'cant', 'cannot', 'wont'])
        stress_word_matches = [w for w in words if w in self.STRESS_KEYWORDS]
        
        # Linguistic
        sentence_length = len(words)
        
        return {
            "embedding": embedding,
            "indicators": {
                "first_person_ratio": first_person_count / max(len(words), 1),
                "negation_count": negative_words,
                "stress_keywords": stress_word_matches,
                "length": sentence_length
            },
            "sentiment": "neutral" # Placeholder for specialized sentiment engine
        }

    # ─── STEP 3: AUDIO FEATURES ───────────────────────────────────────────────────

    def extract_audio_features(self, audio_data: bytes) -> Dict[str, Any]:
        if not HAS_LIBROSA:
            return {"error": "librosa not installed"}
            
        audio, sr = self.standardize_audio(audio_data)
        if len(audio) == 0:
            return {"error": "audio processing failed"}

        # MFCC
        mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
        mfcc_mean = np.mean(mfccs, axis=1).tolist()
        
        # Pitch, Energy, ZCR
        pitches, magnitudes = librosa.piptrack(y=audio, sr=sr)
        pitch = np.mean(pitches[pitches > 0]) if np.any(pitches > 0) else 0
        energy = np.mean(librosa.feature.rms(y=audio))
        zcr = np.mean(librosa.feature.zero_crossing_rate(y=audio))
        
        # Speech Rate & Pauses
        # Simplified: non-silent intervals
        non_silent = librosa.effects.split(audio, top_db=30)
        pause_duration = 0
        if len(non_silent) > 0:
            total_duration = len(audio) / sr
            speech_duration = sum((end - start) for start, end in non_silent) / sr
            pause_duration = total_duration - speech_duration
            speech_rate = len(non_silent) / max(speech_duration, 0.1)
        else:
            speech_rate = 0

        return {
            "mfcc_mean": mfcc_mean,
            "pitch": float(pitch),
            "energy": float(energy),
            "zcr": float(zcr),
            "speech_rate": float(speech_rate),
            "pause_duration": float(pause_duration)
        }

    # ─── STEP 4: FACE FEATURES ────────────────────────────────────────────────────

    def extract_face_features(self, frame: np.ndarray) -> Dict[str, Any]:
        if not HAS_MEDIAPIPE:
            return {"error": "mediapipe not installed"}

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)
        
        if not results.multi_face_landmarks:
            return {"detected": False}

        landmarks = results.multi_face_landmarks[0].landmark
        
        # Smile Intensity (Mouth width)
        mouth_width = abs(landmarks[61].x - landmarks[291].x)
        mouth_opening = abs(landmarks[13].y - landmarks[14].y)
        
        # Eye Openness
        left_eye_open = abs(landmarks[159].y - landmarks[145].y)
        right_eye_open = abs(landmarks[386].y - landmarks[374].y)
        
        # Head Tilt (Simplified)
        head_tilt = abs(landmarks[10].x - landmarks[152].x)
        
        return {
            "detected": True,
            "smile_intensity": float(mouth_width),
            "mouth_opening": float(mouth_opening),
            "eye_openness": float((left_eye_open + right_eye_open) / 2),
            "head_tilt": float(head_tilt),
            "blink_likely": left_eye_open < 0.005 # rough heuristic
        }

    # ─── STEP 5: NORMALIZATION ───────────────────────────────────────────────────

    def normalize_features(self, features: Dict[str, Any]) -> Dict[str, Any]:
        # Simple manual scaling for demo purposes
        # In prod, use sklearn.preprocessing.StandardScaler
        return features

    def process_all(self, text: str = None, audio_data: bytes = None, face_frame: np.ndarray = None) -> Dict[str, Any]:
        results = {
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "text": self.extract_text_features(text) if text else None,
            "audio": self.extract_audio_features(audio_data) if audio_data else None,
            "face": self.extract_face_features(face_frame) if face_frame is not None else None
        }
        return results

# Singleton pipeline
feature_pipeline = FeaturePipeline()
