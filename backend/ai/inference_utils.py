import torch
import os
import sys
from pathlib import Path
from typing import Dict, Any, Tuple

# Add training folder to path to load model classes
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR / "ml" / "training"))
from ml.training.models import TextClassifier, AudioStressModel, RiskSentinel

class InferenceEngine:
    def __init__(self):
        self.device = torch.device("cpu") # Default to CPU for stability
        self.base_path = BASE_DIR / "ml" / "weights"
        
        # Load Models
        self.text_model = self._load_model(TextClassifier(), "text_classifier.pth")
        self.audio_model = self._load_model(AudioStressModel(), "audio_stress.pth")
        self.risk_model = self._load_model(RiskSentinel(), "risk_sentinel.pth")
        
        self.emotions = ["happy", "sad", "anxious", "angry", "neutral"]
        self.risks = ["LOW", "MODERATE", "HIGH"]

    def _load_model(self, model, filename):
        path = os.path.join(self.base_path, filename)
        if os.path.exists(path):
            try:
                model.load_state_dict(torch.load(path, map_location=self.device))
                model.eval()
                return model
            except:
                return None
        return None

    def predict_context(self, embedding: torch.Tensor) -> Dict[str, Any]:
        """Predicts emotion, risk, and patterns from text embeddings"""
        if self.text_model is None:
            return {"emotion": "neutral", "pattern": "none"}
            
        with torch.no_grad():
            emo_logits, pat_logits = self.text_model(embedding.unsqueeze(0))
            emo_idx = torch.argmax(emo_logits, dim=1).item()
            return {
                "emotion": self.emotions[emo_idx],
                "confidence": float(torch.softmax(emo_logits, dim=1).max())
            }

    def predict_risk(self, embedding: torch.Tensor) -> str:
        if self.risk_model is None:
            return "LOW"
            
        with torch.no_grad():
            logits = self.risk_model(embedding.unsqueeze(0))
            idx = torch.argmax(logits, dim=1).item()
            return self.risks[idx]

    def predict_stress(self, features: list) -> float:
        if self.audio_model is None:
            return 0.5
            
        with torch.no_grad():
            feat_tensor = torch.tensor(features, dtype=torch.float32).unsqueeze(0)
            score = self.audio_model(feat_tensor).item()
            return float(score)

# Singleton instance
inference_engine = InferenceEngine()
