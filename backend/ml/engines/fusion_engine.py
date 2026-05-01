import numpy as np

class MultimodalFusionEngine:
    def __init__(self, text_weight=0.5, audio_weight=0.3, face_weight=0.2, temporal_alpha=0.7):
        """
        Initializes the fusion engine with modality weights and temporal smoothing scalar.
        temporal_alpha: Weight of the current prediction vs the past memory (1-alpha).
        """
        self.base_weights = {
            'text': text_weight,
            'audio': audio_weight,
            'face': face_weight
        }
        self.alpha = temporal_alpha
        
        # Maps model numerical outputs back to human-readable core emotions
        self.emotion_map = {0: "happy", 1: "sad", 2: "anxious", 3: "angry", 4: "neutral"}
        
    def fuse_current_state(self, text_prob, audio_prob, face_prob, face_confidence=1.0) -> np.ndarray:
        """
        Fuses modalities using dynamic weights based on runtime confidence.
        If face_confidence < 0.5, the face modality is discarded and weights are redistributed.
        """
        weights = dict(self.base_weights)
        
        # Confidence-based rejection
        if face_confidence < 0.5:
            weights['face'] = 0.0
            
        total_weight = sum(weights.values())
        if total_weight == 0:
            return np.ones(5) / 5.0 # Fallback uniform distribution
            
        # Normalize weights so they sum to 1.0 again 
        w_text = weights['text'] / total_weight
        w_audio = weights['audio'] / total_weight
        w_face = weights['face'] / total_weight
        
        # Weighted sum of emotion probability vectors
        fused_prob = (text_prob * w_text) + (audio_prob * w_audio) + (face_prob * w_face)
        return fused_prob

    def temporal_smoothing(self, current_prob, past_prob=None) -> np.ndarray:
        """
        Applies exponential moving average utilizing historical trajectory.
        """
        if past_prob is None:
            return current_prob
            
        smoothed_prob = (self.alpha * current_prob) + ((1 - self.alpha) * past_prob)
        return smoothed_prob
        
    def predict_emotion(self, smoothed_prob) -> str:
        """Returns the categorical emotion class from the fused normalized probability array."""
        idx = np.argmax(smoothed_prob)
        return self.emotion_map.get(idx, "neutral")
