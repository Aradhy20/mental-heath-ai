"""
Face Analyzer - Inference Engine
Uses the trained sklearn MLP model (face_model_sklearn.pkl) as primary,
falls back to the Keras CNN (face_model.h5) if available, then to DeepFace,
and finally to a neutral heuristic if nothing is loadable.
"""

import sys
import os
import numpy as np
import io
from typing import Optional


# Resolve paths
current_dir   = os.path.dirname(os.path.abspath(__file__))
face_dir      = os.path.dirname(current_dir)
ai_models_dir = os.path.dirname(face_dir)
sys.path.insert(0, ai_models_dir)

MODEL_DIR = os.path.join(face_dir, "model")
EMOTIONS  = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

# ── optional imports ──────────────────────────────────────────────────────────
try:
    import joblib
    HAS_JOBLIB = True
except ImportError:
    HAS_JOBLIB = False

try:
    import cv2
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False


class FaceAnalyzer:
    def __init__(self, model_path=None):
        """
        Initialise FaceAnalyzer.
        Priority:
          1. Sklearn MLP (face_model_sklearn.pkl)  ← fastest, no TF needed
          2. Keras CNN   (face_model.h5)            ← needs TF
          3. DeepFace                               ← heavy but provider-agnostic
          4. Neutral heuristic fallback
        """
        self._mode       = "heuristic"
        self._sklearn_model = None
        self._emotion_labels = EMOTIONS

        # ── 1. Try sklearn model ──────────────────────────────────────────────
        sklearn_path = os.path.join(MODEL_DIR, "face_model_sklearn.pkl")
        if HAS_JOBLIB and os.path.exists(sklearn_path):
            try:
                self._sklearn_model = joblib.load(sklearn_path)
                labels_path = os.path.join(MODEL_DIR, "emotion_labels.npy")
                if os.path.exists(labels_path):
                    self._emotion_labels = list(np.load(labels_path))
                self._mode = "sklearn"
                print(f"FaceAnalyzer: loaded sklearn model from {sklearn_path}")
                return
            except Exception as e:
                print(f"FaceAnalyzer: sklearn load error ({e}), trying next option.")

        # ── 2. Try Keras CNN ──────────────────────────────────────────────────
        keras_path = model_path or os.path.join(MODEL_DIR, "face_model.h5")
        if os.path.exists(keras_path):
            try:
                from face.model.emotion_cnn import EmotionCNN
                self._cnn = EmotionCNN(keras_path)
                if self._cnn.model is not None:
                    self._mode = "keras"
                    print(f"FaceAnalyzer: loaded Keras CNN from {keras_path}")
                    return
            except Exception as e:
                print(f"FaceAnalyzer: Keras load error ({e}), trying next option.")

        # ── 3. Try DeepFace ───────────────────────────────────────────────────
        try:
            from deepface import DeepFace as _DF
            self._deepface = _DF
            self._mode = "deepface"
            print("FaceAnalyzer: using DeepFace backend.")
            return
        except ImportError:
            pass

        print("FaceAnalyzer: no model loaded — using heuristic fallback.")

    # ── Feature extraction (same logic as train_face_sklearn.py) ────────────
    def _extract_features(self, img_array: np.ndarray) -> np.ndarray:
        """img_array: float32 (48,48) normalised 0-1"""
        hist, _ = np.histogram(img_array, bins=16, range=(0.0, 1.0))
        hist = hist.astype(np.float32) / (hist.sum() + 1e-6)
        block_feats = []
        for r in range(0, 48, 8):
            for c in range(0, 48, 8):
                block = img_array[r:r+8, c:c+8]
                block_feats.extend([block.mean(), block.std()])
        return np.concatenate([hist, block_feats])

    def _bytes_to_gray48(self, image_data: bytes) -> Optional[np.ndarray]:
        """Decode image bytes → 48×48 float32 grayscale array (0-1)."""
        if HAS_CV2:
            nparr = np.frombuffer(image_data, np.uint8)
            img   = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
            if img is not None:
                img = cv2.resize(img, (48, 48))
                return img.astype(np.float32) / 255.0
        if HAS_PIL:
            try:
                img = Image.open(io.BytesIO(image_data)).convert("L").resize((48, 48))
                return np.array(img, dtype=np.float32) / 255.0
            except Exception:
                pass
        return None

    # ── Public API ────────────────────────────────────────────────────────────
    def analyze_emotion(self, image_data: bytes):
        """
        Analyse emotion from raw image bytes.
        Returns: (emotion_label, face_score, confidence)
          face_score: 0-1, higher = more positive emotion
        """
        emotion_scores = {
            'happy': 1.0, 'surprise': 0.8, 'neutral': 0.5,
            'sad': 0.3, 'fear': 0.2, 'angry': 0.1, 'disgust': 0.1,
            # Keras-style capitalised keys
            'Happy': 1.0, 'Surprise': 0.8, 'Neutral': 0.5,
            'Sad': 0.3, 'Fear': 0.2, 'Angry': 0.1, 'Disgust': 0.1,
        }

        # ── sklearn path ──────────────────────────────────────────────────────
        if self._mode == "sklearn" and self._sklearn_model is not None:
            gray = self._bytes_to_gray48(image_data)
            if gray is not None:
                feats = self._extract_features(gray).reshape(1, -1)
                label_idx  = self._sklearn_model.predict(feats)[0]
                proba      = self._sklearn_model.predict_proba(feats)[0]
                label      = self._emotion_labels[label_idx]
                confidence = float(np.max(proba))
                face_score = emotion_scores.get(label, 0.5)
                return label, face_score, confidence

        # ── Keras CNN path ────────────────────────────────────────────────────
        if self._mode == "keras":
            emotion_label, confidence, _ = self._cnn.predict_emotion(image_data)
            face_score = emotion_scores.get(emotion_label, 0.5)
            return emotion_label, face_score, confidence

        # ── DeepFace path ─────────────────────────────────────────────────────
        if self._mode == "deepface":
            try:
                import tempfile
                with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as f:
                    f.write(image_data)
                    tmp = f.name
                result = self._deepface.analyze(tmp, actions=["emotion"],
                                                enforce_detection=False)
                if isinstance(result, list):
                    result = result[0]
                emotion_label = result["dominant_emotion"]
                confidence    = result["emotion"][emotion_label] / 100.0
                face_score    = emotion_scores.get(emotion_label, 0.5)
                os.unlink(tmp)
                return emotion_label, face_score, confidence
            except Exception as e:
                print(f"DeepFace error: {e}")

        # ── Heuristic fallback ────────────────────────────────────────────────
        return "neutral", 0.5, 0.5

    def analyze_micro_expressions(self, image_data: bytes) -> dict:
        """Micro-expression analysis — planned for Phase 4."""
        return {
            'detected': False,
            'micro_expressions': [],
            'confidence': 0.0,
            'analysis': 'Micro-expression analysis not yet implemented.',
            'note': 'Requires specialised model for detecting brief facial movements (40–500 ms).',
        }


if __name__ == "__main__":
    analyzer = FaceAnalyzer()
    print(f"Face Analyzer initialized — mode: {analyzer._mode}")
