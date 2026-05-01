"""
MindfulAI — Emotion Model Inference Wrapper
Loads fine-tuned DistilBERT emotion classifier and exposes a clean predict() API.
"""

import os
import torch
from core.logging import log

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/models/emotion_model")

ID2LABEL = {0: "joy", 1: "sadness", 2: "anger", 3: "fear", 4: "neutral"}


class EmotionModel:
    def __init__(self):
        self.model     = None
        self.tokenizer = None
        # _load() removed from init for lazy loading

    def _load(self):
        """Lazy-load the fine-tuned DistilBERT model."""
        if not os.path.exists(MODEL_PATH):
            log.warning(
                f"EmotionModel: No trained model found at {MODEL_PATH}. "
                "Falling back to keyword heuristic. Run scripts/training/train_emotion.py first."
            )
            return

        try:
            from transformers import AutoTokenizer, AutoModelForSequenceClassification
            import torch.nn.functional as F
            log.info("EmotionModel: Loading fine-tuned DistilBERT emotion classifier...")
            self.tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
            self.model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
            self.model.eval()
            log.info("EmotionModel: ✅ Loaded successfully.")
        except Exception as e:
            log.error(f"EmotionModel: Failed to load — {e}")

    def predict(self, text: str) -> dict:
        """
        Predict emotion from text.

        Returns:
            {
                "emotion": "sadness",      # one of: joy, sadness, anger, fear, neutral
                "confidence": 0.91,
                "source": "model" | "heuristic"
            }
        """
        if not text or not text.strip():
            return {"emotion": "neutral", "confidence": 1.0, "source": "default"}

        self._load()
        if self.model and self.tokenizer:
            try:
                import torch
                import torch.nn.functional as F
                enc = self.tokenizer(text[:512], return_tensors="pt", truncation=True, max_length=128)
                with torch.no_grad():
                    logits = self.model(**enc).logits
                probs = F.softmax(logits, dim=-1)
                pred  = probs.argmax(dim=-1).item()
                conf  = probs[0][pred].item()
                return {
                    "emotion":    ID2LABEL.get(pred, "neutral"),
                    "confidence": round(conf, 4),
                    "source":     "model",
                }
            except Exception as e:
                log.error(f"EmotionModel.predict() error: {e}")

        # ── Heuristic fallback (if model not loaded) ──────────────────────────
        return self._heuristic_predict(text)

    def _heuristic_predict(self, text: str) -> dict:
        """Basic keyword-based emotion fallback."""
        text_lower = text.lower()
        if any(w in text_lower for w in ["happy", "joy", "great", "excited", "wonderful", "amazing"]):
            return {"emotion": "joy", "confidence": 0.7, "source": "heuristic"}
        if any(w in text_lower for w in ["sad", "hopeless", "worthless", "depressed", "cry", "lonely", "tired"]):
            return {"emotion": "sadness", "confidence": 0.7, "source": "heuristic"}
        if any(w in text_lower for w in ["angry", "furious", "rage", "hate", "frustrated"]):
            return {"emotion": "anger", "confidence": 0.7, "source": "heuristic"}
        if any(w in text_lower for w in ["scared", "afraid", "anxious", "terrified", "panic", "worried"]):
            return {"emotion": "fear", "confidence": 0.7, "source": "heuristic"}
        return {"emotion": "neutral", "confidence": 0.6, "source": "heuristic"}


# Singleton
emotion_model = EmotionModel()
