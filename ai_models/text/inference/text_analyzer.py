"""
Text Analyzer - Inference Engine
Priority:
  1. Trained sklearn TF-IDF + MLP (text_model_sklearn.pkl) — no PyTorch, fast
  2. HuggingFace transformers pipeline (j-hartmann/emotion-english-distilroberta-base) — if PyTorch available
  3. Keyword-based heuristic fallback
"""

import os
import sys
import numpy as np
from typing import Tuple, Dict, List, Any

# Resolve model directory
_INFERENCE_DIR = os.path.dirname(os.path.abspath(__file__))
_TEXT_DIR      = os.path.dirname(_INFERENCE_DIR)
_MODEL_DIR     = os.path.join(_TEXT_DIR, "model")

_SKLEARN_MODEL_PATH  = os.path.join(_MODEL_DIR, "text_model_sklearn.pkl")
_SKLEARN_LABELS_PATH = os.path.join(_MODEL_DIR, "text_emotion_labels.npy")

try:
    import joblib
    HAS_JOBLIB = True
except ImportError:
    HAS_JOBLIB = False


class TextAnalyzer:
    def __init__(self, model_path=None):
        """
        Initialize the Text Analyzer.
        Tries sklearn model first (no PyTorch required),
        then HuggingFace transformers pipeline,
        then keyword heuristic fallback.
        """
        self.is_mock = False
        self._mode   = "heuristic"
        self._sklearn_model  = None
        self._sklearn_labels = None
        self.emotions = ["anger", "disgust", "fear", "joy", "neutral", "sadness", "surprise"]

        # ── 1. Sklearn model ──────────────────────────────────────────────────
        if HAS_JOBLIB and os.path.exists(_SKLEARN_MODEL_PATH):
            try:
                self._sklearn_model = joblib.load(_SKLEARN_MODEL_PATH)
                if os.path.exists(_SKLEARN_LABELS_PATH):
                    self._sklearn_labels = list(np.load(_SKLEARN_LABELS_PATH))
                else:
                    self._sklearn_labels = ["sadness", "joy", "love", "anger", "fear", "surprise"]
                self._mode   = "sklearn"
                self.emotions = self._sklearn_labels
                print(f"TextAnalyzer: loaded sklearn model (mode=sklearn)")
                return
            except Exception as e:
                print(f"TextAnalyzer: sklearn load error ({e}), trying transformers.")

        # ── 2. HuggingFace transformers ───────────────────────────────────────
        # Only try if not in lite mode and PyTorch is importable
        if os.getenv("AI_LITE_MODE", "false").lower() != "true":
            try:
                import torch
                from transformers import pipeline as hf_pipeline

                hf_model_path = model_path or "j-hartmann/emotion-english-distilroberta-base"
                device = 0 if torch.cuda.is_available() else -1
                device_name = "GPU" if device == 0 else "CPU"
                print(f"TextAnalyzer: loading HuggingFace model on {device_name} …")

                self.classifier = hf_pipeline(
                    "text-classification",
                    model=hf_model_path,
                    return_all_scores=True,
                    device=device
                )
                self._mode = "transformers"
                print("TextAnalyzer: HuggingFace model loaded.")
                return
            except Exception as e:
                print(f"TextAnalyzer: transformers load error ({e}), falling back to heuristic.")

        # ── 3. Keyword heuristic ──────────────────────────────────────────────
        print("TextAnalyzer: using keyword heuristic fallback.")
        self.is_mock = True
        self._mode   = "heuristic"
        self._init_mock()

    def _init_mock(self):
        """Keyword weights for heuristic fallback."""
        self.mock_weights = {
            "joy":      ["happy", "excited", "pleased", "delighted", "thrilled", "wonderful", "amazing"],
            "sadness":  ["sad", "depressed", "lonely", "upset", "disappointed", "miserable", "gloomy"],
            "anger":    ["angry", "furious", "irritated", "annoyed", "mad", "outraged", "enraged"],
            "fear":     ["afraid", "scared", "terrified", "anxious", "worried", "nervous", "panicked"],
            "disgust":  ["disgusted", "repulsed", "revolted", "nauseated", "appalled", "sickened"],
            "surprise": ["surprised", "amazed", "astonished", "shocked", "stunned", "startled"],
            "neutral":  ["normal", "okay", "fine", "regular", "standard", "typical", "usual"],
        }

    # ── Public API ─────────────────────────────────────────────────────────────
    def analyze_emotion(self, text: str) -> Tuple[str, float, float]:
        """
        Analyze text for dominant emotion.
        Returns: (emotion_label, emotion_score, confidence)
        """
        if not text or not text.strip():
            return "neutral", 0.0, 0.0

        if self._mode == "sklearn" and self._sklearn_model is not None:
            return self._analyze_sklearn(text)

        if self._mode == "transformers":
            return self._analyze_transformers(text)

        return self._analyze_mock(text)

    def _analyze_sklearn(self, text: str) -> Tuple[str, float, float]:
        try:
            raw_label  = self._sklearn_model.predict([text])[0]
            proba      = self._sklearn_model.predict_proba([text])[0]
            # raw_label may be int index or string depending on the pipeline internals
            if isinstance(raw_label, (int, np.integer)):
                label = self._sklearn_labels[int(raw_label)]
            else:
                label = str(raw_label)
            confidence = float(np.max(proba))
            return label, confidence, confidence
        except Exception as e:
            print(f"TextAnalyzer sklearn inference error: {e}")
            return self._analyze_mock(text)

    def _analyze_transformers(self, text: str) -> Tuple[str, float, float]:
        try:
            results    = self.classifier(text)[0]
            top_result = max(results, key=lambda x: x['score'])
            label      = top_result['label']
            confidence = top_result['score']
            return label, confidence, confidence
        except Exception as e:
            print(f"TextAnalyzer transformers inference error: {e}")
            return self._analyze_mock(text)

    def _analyze_mock(self, text: str) -> Tuple[str, float, float]:
        text_lower    = text.lower()
        emotion_scores = {}
        total_matches  = 0
        for emotion, keywords in self.mock_weights.items():
            matches = sum(1 for kw in keywords if kw in text_lower)
            emotion_scores[emotion] = matches
            total_matches += matches
        if total_matches == 0:
            return "neutral", 0.5, 0.7
        dominant  = max(emotion_scores, key=emotion_scores.get)
        max_match = emotion_scores[dominant]
        score     = min(max_match / 10.0, 0.95)
        conf      = min(0.5 + (len(text.split()) * 0.02) + (max_match / total_matches * 0.3), 0.95)
        return dominant, score, conf

    def get_all_scores(self, text: str) -> Dict[str, float]:
        """Get probability scores for all emotion labels."""
        if self._mode == "sklearn" and self._sklearn_model is not None:
            try:
                proba  = self._sklearn_model.predict_proba([text])[0]
                return {label: float(p) for label, p in zip(self._sklearn_labels, proba)}
            except Exception:
                pass
        if self._mode == "transformers":
            try:
                results = self.classifier(text)[0]
                return {r['label']: r['score'] for r in results}
            except Exception:
                pass
        return {e: round(1.0 / len(self.emotions), 4) for e in self.emotions}


if __name__ == "__main__":
    analyzer = TextAnalyzer()
    print(f"Mode: {analyzer._mode}")
    sample = "I am so happy today, everything is going great!"
    print(f"Input: {sample!r}")
    print(f"Result: {analyzer.analyze_emotion(sample)}")
