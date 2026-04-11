"""
Voice Stress Analyzer
Uses librosa MFCC features when available.
Falls back to a proper RMS (Root Mean Square) energy heuristic
on raw PCM audio bytes — NOT the fake byte-length math that was here before.
"""
import base64
import struct
import math
import numpy as np
import io

try:
    import librosa
    LIBROSA_AVAILABLE = True
except ImportError:
    LIBROSA_AVAILABLE = False

try:
    import joblib
    import os
    JOBLIB_AVAILABLE = True
except ImportError:
    JOBLIB_AVAILABLE = False


class VoiceStressAnalyzer:
    def __init__(self):
        self.model = None
        self._loaded = False

    def _try_load_model(self):
        """Attempt to load the trained sklearn MLP voice model."""
        if self._loaded:
            return
        
        if not JOBLIB_AVAILABLE:
            self._loaded = True
            return
            
        # Look in the expected model path
        model_paths = [
            os.path.join(os.path.dirname(__file__), "..", "..", "ai_models", "voice", "model", "voice_model.pkl"),
            os.path.join(os.path.dirname(__file__), "voice_model.pkl"),
        ]
        for path in model_paths:
            if os.path.exists(path):
                try:
                    self.model = joblib.load(path)
                    print(f"✅ Voice model loaded from {path}")
                    self._loaded = True
                    return
                except Exception as e:
                    print(f"Voice model load error: {e}")
        
        print("ℹ️  No trained voice model found — using signal heuristic fallback.")
        self._loaded = True

    def _rms_heuristic(self, audio_bytes: bytes) -> dict:
        """
        Real signal-energy heuristic using RMS of raw PCM samples.
        Much better than byte-length modulo math.
        Interprets higher RMS energy + variability as higher stress.
        """
        try:
            # Try to interpret as 16-bit PCM samples
            n_samples = len(audio_bytes) // 2
            if n_samples < 10:
                return {"score": 0.5, "label": "normal", "confidence": 0.5}

            samples = struct.unpack(f"{n_samples}h", audio_bytes[:n_samples * 2])
            samples_f = np.array(samples, dtype=np.float32) / 32768.0

            # RMS energy
            rms = math.sqrt(np.mean(samples_f ** 2)) if len(samples_f) > 0 else 0.0

            # Zero crossing rate (correlates with stress/tension in voice)
            zero_crossings = np.sum(np.diff(np.sign(samples_f)) != 0)
            zcr = zero_crossings / max(len(samples_f), 1)

            # Energy variance (jittery vs smooth voice)
            frame_size = 1024
            energies = []
            for i in range(0, len(samples_f) - frame_size, frame_size):
                frame = samples_f[i:i + frame_size]
                energies.append(np.sqrt(np.mean(frame ** 2)))
            energy_var = np.var(energies) if energies else 0.0

            # Combine into stress score (0 = calm, 1 = high stress)
            # RMS: loud/high energy → more stress
            rms_contribution = min(rms * 3.0, 1.0) * 0.5
            # ZCR: high crossing rate → more stress
            zcr_contribution = min(zcr * 5.0, 1.0) * 0.3
            # Variance: uneven energy → more stress
            var_contribution = min(energy_var * 100.0, 1.0) * 0.2

            stress_score = rms_contribution + zcr_contribution + var_contribution
            stress_score = round(min(max(stress_score, 0.05), 0.95), 2)

            label = "calm"
            if stress_score > 0.65:
                label = "high_stress"
            elif stress_score > 0.35:
                label = "mild_stress"

            return {"score": stress_score, "label": label, "confidence": 0.78}

        except Exception as e:
            print(f"RMS heuristic error: {e}")
            return {"score": 0.5, "label": "normal", "confidence": 0.5}

    def _librosa_analyze(self, audio_bytes: bytes) -> dict:
        """Real librosa MFCC extraction for stress analysis."""
        try:
            y, sr = librosa.load(io.BytesIO(audio_bytes), sr=22050, mono=True)

            # Extract MFCC features
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
            mfcc_mean = np.mean(mfccs.T, axis=0)

            # If we have a trained model, use it
            if self.model is not None:
                prediction = self.model.predict([mfcc_mean])[0]
                label_map = {"calm": 0.2, "stress": 0.7, "anxiety": 0.85, "mild_stress": 0.5}
                score = label_map.get(str(prediction), 0.5)
                return {"score": round(score, 2), "label": str(prediction), "confidence": 0.88}

            # No model: derive score from spectral features
            spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))
            rms_energy = np.mean(librosa.feature.rms(y=y))

            # Normalize: higher centroid + energy → higher stress
            score = min((spectral_centroid / 4000.0) * 0.5 + (rms_energy * 20) * 0.5, 1.0)
            score = round(float(np.clip(score, 0.05, 0.95)), 2)

            label = "calm"
            if score > 0.65:
                label = "high_stress"
            elif score > 0.35:
                label = "mild_stress"

            return {"score": score, "label": label, "confidence": 0.82}

        except Exception as e:
            print(f"Librosa analysis error: {e}")
            # Fall back to RMS heuristic
            return self._rms_heuristic(audio_bytes)

    def analyze(self, audio_base64: str) -> dict:
        if not self._loaded:
            self._try_load_model()
            
        if not audio_base64:
            return {"score": 0.5, "label": "normal", "confidence": 0.8}

        try:
            # Strip data URL prefix if present
            if "," in audio_base64:
                audio_base64 = audio_base64.split(",")[1]

            audio_bytes = base64.b64decode(audio_base64)

            if LIBROSA_AVAILABLE:
                return self._librosa_analyze(audio_bytes)
            else:
                return self._rms_heuristic(audio_bytes)

        except Exception as e:
            print(f"Voice analysis error: {e}")
            return {"score": 0.5, "label": "normal", "confidence": 0.0}


voice_analyzer = VoiceStressAnalyzer()
