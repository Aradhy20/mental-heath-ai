"""
MindfulAI — Audio Emotion Model Inference Wrapper
Loads PyTorch MLP trained on CREMA-D and predicts emotion from raw audio bytes.
"""

import os
import io
import torch
import numpy as np
from core.logging import log

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/models/audio_model.pt")


class AudioEmotionModel:
    def __init__(self):
        self.model       = None
        self.norm_mean   = None
        self.norm_std    = None
        self.id2emotion  = None
        # _load() removed from init for lazy loading

    def _load(self):
        if not os.path.exists(MODEL_PATH):
            log.warning(
                f"AudioEmotionModel: No trained model found at {MODEL_PATH}. "
                "Skipping audio emotion classification. Run scripts/training/train_audio.py first."
            )
            return

        try:
            log.info("AudioEmotionModel: Loading CREMA-D PyTorch MLP...")
            checkpoint = torch.load(MODEL_PATH, map_location="cpu")

            input_dim   = checkpoint["input_dim"]
            num_classes = checkpoint["num_classes"]
            self.id2emotion = checkpoint["id2emotion"]

            self.norm_mean = np.array(checkpoint["norm_mean"], dtype=np.float32)
            self.norm_std  = np.array(checkpoint["norm_std"],  dtype=np.float32)

            # Rebuild using the same AudioEmotionMLP class (preserves `net.` key prefix)
            import torch.nn as nn
            class AudioEmotionMLP(nn.Module):
                def __init__(self, input_dim, num_classes):
                    super().__init__()
                    self.net = nn.Sequential(
                        nn.Linear(input_dim, 256), nn.BatchNorm1d(256), nn.ReLU(), nn.Dropout(0.3),
                        nn.Linear(256, 128),       nn.BatchNorm1d(128), nn.ReLU(), nn.Dropout(0.3),
                        nn.Linear(128, 64),        nn.ReLU(),
                        nn.Linear(64, num_classes),
                    )
                def forward(self, x):
                    return self.net(x)

            self.model = AudioEmotionMLP(input_dim=input_dim, num_classes=num_classes)
            self.model.load_state_dict(checkpoint["model_state"])
            self.model.eval()
            log.info("AudioEmotionModel: ✅ Loaded successfully.")
        except Exception as e:
            log.error(f"AudioEmotionModel: Failed to load — {e}")

    def _extract_features(self, audio_bytes: bytes) -> np.ndarray:
        """Extract 45-dim feature vector from raw audio bytes using librosa."""
        try:
            import librosa
            audio_buffer = io.BytesIO(audio_bytes)
            audio, sr = librosa.load(audio_buffer, sr=16000, mono=True)
            audio = librosa.util.normalize(audio)

            mfccs      = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40)
            mfcc_mean  = np.mean(mfccs, axis=1)

            pitches, magnitudes = librosa.piptrack(y=audio, sr=sr)
            pitch_vals = pitches[magnitudes > 0]
            pitch_mean = float(np.mean(pitch_vals)) if len(pitch_vals) > 0 else 0.0

            energy_mean   = float(np.mean(librosa.feature.rms(y=audio)))
            zcr_mean      = float(np.mean(librosa.feature.zero_crossing_rate(y=audio)))
            centroid_mean = float(np.mean(librosa.feature.spectral_centroid(y=audio, sr=sr)))
            rolloff_mean  = float(np.mean(librosa.feature.spectral_rolloff(y=audio, sr=sr)))

            features = np.concatenate([
                mfcc_mean,
                [pitch_mean, energy_mean, zcr_mean, centroid_mean, rolloff_mean]
            ]).astype(np.float32)

            # Normalize using training statistics
            if self.norm_mean is not None:
                features = (features - self.norm_mean) / (self.norm_std + 1e-8)

            return features
        except Exception as e:
            log.error(f"AudioEmotionModel feature extraction error: {e}")
            return None

    def predict(self, audio_bytes: bytes) -> dict:
        """
        Predict emotion from raw audio bytes.

        Returns:
            {
                "emotion": "fear",
                "confidence": 0.83,
                "source": "model" | "unavailable"
            }
        """
        self._load()
        if self.model is None:
            return {"emotion": "neutral", "confidence": 0.0, "source": "unavailable"}

        features = self._extract_features(audio_bytes)
        if features is None:
            return {"emotion": "neutral", "confidence": 0.0, "source": "error"}

        try:
            x = torch.tensor(features, dtype=torch.float32).unsqueeze(0)
            with torch.no_grad():
                logits = self.model(x)
                probs  = torch.softmax(logits, dim=-1)
                pred   = probs.argmax(dim=-1).item()
                conf   = probs[0][pred].item()

            emotion = self.id2emotion.get(pred, "neutral")
            return {
                "emotion":    emotion,
                "confidence": round(conf, 4),
                "source":     "model",
            }
        except Exception as e:
            log.error(f"AudioEmotionModel.predict() error: {e}")
            return {"emotion": "neutral", "confidence": 0.0, "source": "error"}


# Singleton
audio_emotion_model = AudioEmotionModel()
