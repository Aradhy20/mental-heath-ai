"""
MindfulAI — Risk Detection Model Inference Wrapper
Loads fine-tuned DistilBERT risk classifier and maps confidence → safe/moderate/high.
"""

import os
import torch
import torch.nn.functional as F
from core.logging import log

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/models/risk_model")

# Confidence thresholds for 3-tier risk mapping
MODERATE_THRESHOLD = 0.50  # confidence >= 0.50 in "depressed" class → moderate
HIGH_THRESHOLD     = 0.75  # confidence >= 0.75 in "depressed" class → high


class RiskModel:
    def __init__(self):
        self.model     = None
        self.tokenizer = None
        # Keep keyword emergency triggers even with ML model
        self.crisis_keywords = [
            "suicide", "kill myself", "end my life", "die", "end it all",
            "hurt myself", "better off dead", "no reason to live", "want to die"
        ]
        # _load() removed from init for lazy loading

    def _load(self):
        """Lazy-load the fine-tuned DistilBERT risk model."""
        if not os.path.exists(MODEL_PATH):
            log.warning(
                f"RiskModel: No trained model found at {MODEL_PATH}. "
                "Falling back to keyword detection. Run scripts/training/train_risk.py first."
            )
            return

        try:
            from transformers import AutoModelForSequenceClassification, AutoTokenizer
            log.info("RiskModel: Loading fine-tuned DistilBERT risk classifier...")
            self.tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
            self.model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
            self.model.eval()
            log.info("RiskModel: ✅ Loaded successfully.")
        except Exception as e:
            log.error(f"RiskModel: Failed to load — {e}")

    def predict(self, text: str) -> dict:
        """
        Predict depression risk level from text.

        Returns:
            {
                "risk_level": "moderate",   # one of: safe, moderate, high
                "confidence": 0.78,
                "is_crisis": False,
                "source": "model" | "keyword" | "heuristic"
            }
        """
        if not text or not text.strip():
            return {"risk_level": "safe", "confidence": 1.0, "is_crisis": False, "source": "default"}

        text_lower = text.lower()

        # ── Crisis keyword override (always runs, highest priority) ──────────
        for kw in self.crisis_keywords:
            if kw in text_lower:
                log.warning(f"RiskModel: CRISIS keyword '{kw}' detected.")
                return {
                    "risk_level": "high",
                    "confidence": 1.0,
                    "is_crisis": True,
                    "source": "keyword",
                }

        self._load()
        # ── ML Model ─────────────────────────────────────────────────────────
        if self.model and self.tokenizer:
            try:
                enc = self.tokenizer(
                    text[:512],
                    return_tensors="pt",
                    truncation=True,
                    max_length=256,
                )
                with torch.no_grad():
                    logits = self.model(**enc).logits
                probs = F.softmax(logits, dim=-1)
                depressed_conf = float(probs[0][1])

                if depressed_conf < MODERATE_THRESHOLD:
                    risk_level = "safe"
                elif depressed_conf < HIGH_THRESHOLD:
                    risk_level = "moderate"
                else:
                    risk_level = "high"

                return {
                    "risk_level": risk_level,
                    "confidence": round(depressed_conf, 4),
                    "is_crisis": risk_level == "high",
                    "source": "model",
                }
            except Exception as e:
                log.error(f"RiskModel.predict() ML error: {e}")

        # ── Keyword heuristic fallback ────────────────────────────────────────
        return self._heuristic_predict(text_lower)

    def _heuristic_predict(self, text_lower: str) -> dict:
        moderate_kws = ["hopeless", "worthless", "depressed", "can't go on", "overwhelmed", "exhausted"]
        for kw in moderate_kws:
            if kw in text_lower:
                return {"risk_level": "moderate", "confidence": 0.65, "is_crisis": False, "source": "heuristic"}
        return {"risk_level": "safe", "confidence": 0.8, "is_crisis": False, "source": "heuristic"}


# Singleton
risk_model = RiskModel()
