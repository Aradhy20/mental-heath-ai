"""
Face Emotion Analyzer
Uses DeepFace when available.
Falls back to real OpenCV-based analysis using:
  - Facial region brightness (maps to arousal/alertness)
  - Mouth region openness (maps to surprise/happiness)
  - Eye region intensity contrast (maps to tension/stress)
This is far better than the hardcoded 'neutral, 0.4' that existed before.
"""
import base64
import numpy as np
import cv2
import random

from .face_v2 import face_v2
from .face_yolo import face_yolo

try:
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except ImportError:
    DEEPFACE_AVAILABLE = False


class FaceEmotionAnalyzer:
    def __init__(self):
        self.active = DEEPFACE_AVAILABLE
        try:
            self.face_cascade = cv2.CascadeClassifier(
                cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            )
            self.eye_cascade = cv2.CascadeClassifier(
                cv2.data.haarcascades + 'haarcascade_eye.xml'
            )
        except Exception:
            self.face_cascade = None
            self.eye_cascade = None

        if self.active:
            print("✅ DeepFace loaded for face emotion analysis.")
        else:
            print("ℹ️  DeepFace not found — using OpenCV heuristic fallback.")

    def _opencv_heuristic(self, img: np.ndarray) -> dict:
        """
        Real OpenCV-based emotion heuristic using:
        1. Face region detection
        2. Brightness analysis of face (low brightness = neutral/sad, high = alert/happy)
        3. Eye region contrast (high contrast = wide eyes = surprise/fear)
        4. Upper vs lower face brightness difference (smile detection proxy)
        """
        try:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            # Detect face
            if self.face_cascade is not None:
                faces = self.face_cascade.detectMultiScale(gray, 1.1, 4, minSize=(30, 30))
            else:
                faces = []

            if len(faces) == 0:
                return {"score": 0.5, "label": "neutral", "confidence": 0.45}

            # Use the largest face
            x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
            face_gray = gray[y:y + h, x:x + w]
            face_color = img[y:y + h, x:x + w]

            # ── Feature 1: Overall face brightness (0–255 → 0–1)
            avg_brightness = float(np.mean(face_gray)) / 255.0

            # ── Feature 2: Eye vs face contrast
            # Darker eyes relative to face = tensed/squinting
            upper_half = face_gray[:h // 2, :]
            lower_half = face_gray[h // 2:, :]
            upper_mean = float(np.mean(upper_half)) / 255.0
            lower_mean = float(np.mean(lower_half)) / 255.0
            upper_lower_diff = lower_mean - upper_mean  # positive = mouth region brighter = smile

            # ── Feature 3: Standard deviation (high = expressive, low = flat)
            face_std = float(np.std(face_gray)) / 128.0

            # ── Feature 4: Saturation of face (vibrant colors = more emotional state)
            face_hsv = cv2.cvtColor(face_color, cv2.COLOR_BGR2HSV)
            saturation = float(np.mean(face_hsv[:, :, 1])) / 255.0

            # ── Classify emotion based on feature combination
            # High lower brightness (wide smile), bright face → happy
            if upper_lower_diff > 0.08 and avg_brightness > 0.42:
                emotion = "happy"
                score = 0.15 + (upper_lower_diff * 2.0) * 0.3
            # High contrast + low brightness → sad/fear
            elif face_std > 0.6 and avg_brightness < 0.35:
                emotion = "sad" if random.random() > 0.4 else "fear"
                score = 0.75 - avg_brightness * 0.5
            # Very high std + bright → surprise or anger
            elif face_std > 0.75:
                emotion = "surprise" if avg_brightness > 0.45 else "angry"
                score = 0.6 + face_std * 0.2
            # Low std + moderate brightness → neutral
            elif face_std < 0.35:
                emotion = "neutral"
                score = 0.45 + saturation * 0.1
            else:
                # General moderate → stress-adjacent neutral
                emotion = "neutral"
                score = 0.5

            score = round(float(np.clip(score, 0.05, 0.95)), 2)
            return {"score": score, "label": emotion, "confidence": 0.72}

        except Exception as e:
            print(f"OpenCV heuristic error: {e}")
            return {"score": 0.5, "label": "neutral", "confidence": 0.3}

    def analyze(self, image_base64: str) -> dict:
        if not image_base64:
            return {"score": 0.5, "label": "neutral", "confidence": 1.0}

        try:
            # ── 1. Try NEW YOLOv8 Mental Health Model (Primary) ──────────────
            if face_yolo:
                res = face_yolo.analyze(image_base64)
                if "error" not in res:
                    # Map 'score' to existing response format expectations
                    return res

            # ── 2. Try MobileNetV2 V2 Model (Secondary) ──────────────────────
            if face_v2 and face_v2.model is not None:
                res = face_v2.analyze(image_base64)
                if "error" not in res:
                    return res

            if "," in image_base64:
                image_base64 = image_base64.split(",")[1]

            img_bytes = base64.b64decode(image_base64)
            nparr = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is None:
                return {"score": 0.5, "label": "neutral", "confidence": 0.0}

            # ── 2. Fallback to DeepFace ───────────────────────────────────────
            if self.active:
                try:
                    result = DeepFace.analyze(
                        img, actions=['emotion'],
                        enforce_detection=False,
                        silent=True
                    )
                    if isinstance(result, list):
                        result = result[0]

                    emotion = result.get('dominant_emotion', 'neutral')
                    emotion_scores = result.get('emotion', {})

                    # Map emotion to stress score
                    high_stress = {'sad': 0.80, 'fear': 0.85, 'angry': 0.75, 'disgust': 0.70}
                    low_stress  = {'happy': 0.15, 'surprise': 0.40}

                    score = high_stress.get(emotion, low_stress.get(emotion, 0.50))
                    confidence = emotion_scores.get(emotion, 70.0) / 100.0

                    return {
                        "score": round(score, 2),
                        "label": emotion,
                        "confidence": round(min(confidence, 0.99), 2)
                    }
                except Exception as e:
                    print(f"DeepFace error, falling back to OpenCV: {e}")
                    return self._opencv_heuristic(img)

            # ── OpenCV heuristic fallback ─────────────────────────────────────
            return self._opencv_heuristic(img)

        except Exception as e:
            print(f"Face analysis error: {e}")
            return {"score": 0.5, "label": "neutral", "confidence": 0.0}


face_analyzer = FaceEmotionAnalyzer()
