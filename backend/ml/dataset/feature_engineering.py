import re
try:
    import librosa
except ImportError:
    librosa = None
import numpy as np

class FeatureEngineer:
    def __init__(self):
        self.risk_keywords = ['stress', 'tired', 'alone', 'giving up', 'hate myself', 'pain', 'hopeless']
        self.negation_words = ['not', 'no', 'never', 'none', "don't", "can't", "won't", "shouldn't", "wouldn't", "couldn't"]

    def extract_text_features(self, text: str) -> dict:
        """Extracts engineered heuristics from text beyond just LLM embeddings."""
        text_lower = str(text).lower()
        words = text_lower.split()
        
        # 1. Length features
        word_count = len(words)
        char_count = len(text_lower)
        
        # 2. Keyword detection
        risk_score = sum(1 for kw in self.risk_keywords if kw in text_lower)
        
        # 3. Negation detection
        negation_count = sum(1 for word in words if word in self.negation_words)
        
        return {
            "word_count": word_count,
            "char_count": char_count,
            "risk_score_heuristic": risk_score,
            "negations": negation_count
        }

    @staticmethod
    def extract_audio_features(file_path: str, sr=16000, duration=3.0) -> np.ndarray:
        """Extracts deep acoustic features: MFCC, pitch, and energy."""
        if librosa is None:
            raise ImportError("librosa is required for audio feature extraction.")
            
        y, _sr = librosa.load(file_path, sr=sr, duration=duration)
        
        # 1. MFCC (Mel-frequency cepstral coefficients)
        mfcc = librosa.feature.mfcc(y=y, sr=_sr, n_mfcc=13)
        mfcc_mean = np.mean(mfcc.T, axis=0) # 13 dims
        
        # 2. Energy (Root-mean-square)
        rms = librosa.feature.rms(y=y)
        rms_mean = np.mean(rms.T, axis=0) # 1 dim
        
        # 3. Pitch (Zero Crossing Rate as a proxy, or spectral centroid)
        zcr = librosa.feature.zero_crossing_rate(y)
        zcr_mean = np.mean(zcr.T, axis=0) # 1 dim
        
        # Speech rate proxy: number of times energy crosses a threshold
        energy_peaks = np.sum(rms > (np.mean(rms) + np.std(rms)))
        speech_rate = np.array([energy_peaks], dtype=np.float32)
        
        # Total features: 13 + 1 + 1 + 1 = 16 dimensions
        return np.concatenate((mfcc_mean, rms_mean, zcr_mean, speech_rate))
