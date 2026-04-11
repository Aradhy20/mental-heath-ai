"""
Voice Analyzer - Inference Engine
Uses trained MLPClassifier model with librosa MFCC feature extraction
for real-time stress/emotion detection from audio.
"""

import numpy as np
import os
import io
from typing import Tuple

try:
    import librosa
    HAS_LIBROSA = True
except ImportError:
    HAS_LIBROSA = False

try:
    import joblib
    HAS_JOBLIB = True
except ImportError:
    HAS_JOBLIB = False


class VoiceAnalyzer:
    def __init__(self, model_path=None):
        """
        Initialize Voice Analyzer.
        Loads the trained MLP model if available, otherwise falls back to heuristic rules.
        """
        self.stress_levels = ["calm", "mild_stress", "moderate_stress", "high_stress", "anxiety", "depression"]
        self.is_mock = False
        self.model = None
        self._model_path = None

        # Resolve model path
        if model_path and os.path.exists(model_path):
            self._model_path = model_path
        else:
            # Look for model relative to this file
            default_path = os.path.join(os.path.dirname(__file__), '..', 'model', 'voice_model.pkl')
            default_path = os.path.normpath(default_path)
            if os.path.exists(default_path):
                self._model_path = default_path

        if self._model_path and HAS_JOBLIB:
            try:
                self.model = joblib.load(self._model_path)
                print(f"Voice model loaded from {self._model_path}")
            except Exception as e:
                print(f"Warning: Could not load voice model: {e}. Falling back to heuristic mode.")
                self.is_mock = True
        else:
            if not self._model_path:
                print("Warning: voice_model.pkl not found. Using heuristic mode.")
            self.is_mock = True

        if not HAS_LIBROSA:
            print("Warning: librosa not available. Audio feature extraction will be limited.")

    def extract_features(self, audio_data: bytes) -> dict:
        """
        Extract voice features from raw audio bytes using librosa.
        Falls back to size-based heuristics if librosa is unavailable.
        """
        audio_size = len(audio_data)

        if not HAS_LIBROSA:
            return {
                "pitch": min(100 + (audio_size / 1000), 400),
                "intensity": min(50 + (audio_size / 500), 110),
                "jitter": min(0.01 + (audio_size / 100000), 0.12),
                "duration": audio_size / 10000,
                "mfccs": None
            }

        try:
            audio_buffer = io.BytesIO(audio_data)
            audio, sample_rate = librosa.load(audio_buffer, sr=22050, res_type='kaiser_fast', mono=True)

            mfccs = np.mean(librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40).T, axis=0)

            # Also extract auxiliary features
            pitches, magnitudes = librosa.piptrack(y=audio, sr=sample_rate)
            pitch_values = pitches[magnitudes > np.median(magnitudes)]
            pitch = float(np.mean(pitch_values)) if len(pitch_values) > 0 else 150.0

            rms = librosa.feature.rms(y=audio)
            intensity = float(np.mean(rms) * 110)  # scale to dB-like range

            duration = librosa.get_duration(y=audio, sr=sample_rate)

            return {
                "pitch": pitch,
                "intensity": min(intensity, 110),
                "jitter": 0.05,  # simplified jitter placeholder
                "duration": duration,
                "mfccs": mfccs
            }
        except Exception as e:
            print(f"Audio feature extraction error: {e}. Using size-based fallback.")
            return {
                "pitch": min(100 + (audio_size / 1000), 400),
                "intensity": min(50 + (audio_size / 500), 110),
                "jitter": min(0.01 + (audio_size / 100000), 0.12),
                "duration": audio_size / 10000,
                "mfccs": None
            }

    def analyze_stress(self, audio_data: bytes) -> Tuple[str, float, float]:
        """
        Analyze voice recording for stress and emotional indicators.
        Returns: (stress_label, stress_score, confidence)
        """
        features = self.extract_features(audio_data)

        # Use ML model if available
        if self.model is not None and features.get("mfccs") is not None:
            try:
                mfccs = features["mfccs"].reshape(1, -1)
                predicted_label = self.model.predict(mfccs)[0]
                proba = self.model.predict_proba(mfccs)[0]
                confidence = float(np.max(proba))

                # Map class labels to stress scores
                stress_score_map = {
                    "calm": 0.1,
                    "mild_stress": 0.35,
                    "moderate_stress": 0.55,
                    "stress": 0.55,
                    "high_stress": 0.75,
                    "anxiety": 0.85,
                    "depression": 0.7
                }
                stress_score = stress_score_map.get(predicted_label, 0.5)

                # Duration-boosted confidence
                duration_boost = min(features["duration"] / 10.0, 0.15)
                confidence = min(confidence + duration_boost, 0.97)

                return predicted_label, stress_score, confidence
            except Exception as e:
                print(f"Model inference error: {e}. Falling back to heuristics.")

        # Heuristic fallback
        pitch = features["pitch"]
        intensity = features["intensity"]
        jitter = features["jitter"]

        pitch_score = min(max((pitch - 100) / 300, 0), 1)
        intensity_score = min(max((intensity - 50) / 60, 0), 1)
        jitter_score = min(max((jitter - 0.01) / 0.11, 0), 1)

        stress_score = (pitch_score * 0.4 + intensity_score * 0.4 + jitter_score * 0.2)

        if stress_score < 0.2:
            stress_label = "calm"
        elif stress_score < 0.4:
            stress_label = "mild_stress"
        elif stress_score < 0.6:
            stress_label = "moderate_stress"
        elif stress_score < 0.8:
            stress_label = "high_stress"
        elif pitch > 300:
            stress_label = "anxiety"
        else:
            stress_label = "depression"

        confidence = min(0.5 + (features["duration"] / 10), 0.90)
        return stress_label, stress_score, confidence


if __name__ == "__main__":
    analyzer = VoiceAnalyzer()
    print(f"Voice Analyzer initialized (mock={analyzer.is_mock})")
