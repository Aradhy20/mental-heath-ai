"""
Text Emotion Analyzer
Primary: HuggingFace j-hartmann/emotion-english-distilroberta-base (loads from cache if available)
Fallback: Keyword-based multi-class emotion classifier (much better than returning 'neutral' always)
"""
import os
import re

# ─── Keyword-based emotion classifier (always available, no model required) ───
EMOTION_KEYWORDS = {
    "joy": [
        "happy", "happiness", "joy", "joyful", "excited", "excited", "love", "amazing",
        "wonderful", "great", "fantastic", "awesome", "cheerful", "elated", "delighted",
        "glad", "pleased", "thrilled", "grateful", "hopeful", "content", "smile", "laugh",
        "celebrate", "good day", "feeling good", "feeling great", "proud", "inspired"
    ],
    "sadness": [
        "sad", "sadness", "depressed", "depression", "unhappy", "cry", "crying", "tears",
        "miserable", "hopeless", "heartbroken", "grief", "grieving", "lonely", "alone",
        "empty", "numb", "worthless", "broken", "lost", "devastated", "sorrowful", "gloomy",
        "disappointed", "hurt", "down", "blue", "feel bad", "feel awful", "terrible day"
    ],
    "anger": [
        "angry", "anger", "mad", "furious", "rage", "frustrated", "frustration", "irritated",
        "annoyed", "outraged", "resentful", "hostile", "bitter", "livid", "hate", "hateful",
        "aggressive", "violent", "enraged", "infuriated", "fed up", "sick of", "can't stand"
    ],
    "fear": [
        "afraid", "fear", "scared", "terrified", "anxious", "anxiety", "panic", "panicking",
        "worried", "worry", "nervous", "nervous", "dread", "dreading", "phobia", "frightened",
        "tense", "uneasy", "apprehensive", "stressed", "overwhelmed", "catastrophize", "what if"
    ],
    "disgust": [
        "disgusted", "disgust", "gross", "revolting", "sick", "nauseated", "repulsed",
        "awful", "horrified", "appalled", "disturbed"
    ],
    "surprise": [
        "surprised", "shock", "shocked", "unexpected", "unbelievable", "can't believe",
        "wow", "omg", "oh my", "astonished", "amazed", "stunned", "blown away"
    ],
    "neutral": [
        "fine", "okay", "ok", "alright", "normal", "so-so", "meh", "nothing special"
    ]
}

def keyword_classify(text: str) -> dict:
    """Score text against emotion keyword lists and return the best match."""
    text_lower = text.lower()
    # Remove punctuation
    text_clean = re.sub(r"[^\w\s]", " ", text_lower)
    words = set(text_clean.split())

    scores = {}
    for emotion, kws in EMOTION_KEYWORDS.items():
        # Count single-word hits + phrase hits
        hit_count = 0
        for kw in kws:
            if " " in kw:  # phrase match
                if kw in text_lower:
                    hit_count += 2
            elif kw in words:
                hit_count += 1
        scores[emotion] = hit_count

    best_emotion = max(scores, key=scores.get)
    best_score = scores[best_emotion]

    # If no keywords matched at all → neutral
    if best_score == 0:
        best_emotion = "neutral"

    # Confidence: 0.5 base + up to 0.45 from keyword density
    total_words = max(len(words), 1)
    confidence = min(0.5 + (best_score / total_words) * 3.0, 0.95)

    # Map emotion to stress/wellness score (0 = positive, 1 = high stress)
    stress_map = {
        "joy":      0.10,
        "surprise": 0.40,
        "neutral":  0.50,
        "disgust":  0.65,
        "fear":     0.75,
        "anger":    0.80,
        "sadness":  0.82,
    }
    score = stress_map.get(best_emotion, 0.50)
    # Add slight variance based on keyword density
    score = round(min(max(score + (best_score * 0.02), 0.05), 0.95), 2)

    return {
        "score": score,
        "label": best_emotion,
        "confidence": round(confidence, 2)
    }


class TextEmotionAnalyzer:
    def __init__(self):
        self.classifier = None
        self.active = False
        self._loaded = False

    def _try_load_model(self):
        """Try to load the HuggingFace pipeline. Non-blocking if it fails."""
        if self._loaded:
            return
        
        try:
            from transformers import pipeline
            print("Loading RoBERTa text emotion model (may download ~120MB)...")
            self.classifier = pipeline(
                "text-classification",
                model="j-hartmann/emotion-english-distilroberta-base",
                top_k=1
            )
            self.active = True
            print("✅ RoBERTa text emotion model loaded successfully.")
        except Exception as e:
            print(f"ℹ️  RoBERTa model not available: {e}")
            print("   Using keyword-based emotion classifier as fallback.")
            self.active = False
        finally:
            self._loaded = True

    def analyze(self, text: str) -> dict:
        if not text or not text.strip():
            return {"score": 0.5, "label": "neutral", "confidence": 1.0}

        # Lazy load on first real request
        if not self._loaded:
            self._try_load_model()

        # ── Try HuggingFace first ──────────────────────────────────────────────
        if self.active and self.classifier:
            try:
                result = self.classifier(text[:512])[0][0]  # limit to 512 chars
                label = result['label']
                confidence = round(result['score'], 2)

                # Map to stress scalar
                high_stress = ['sadness', 'fear', 'anger', 'disgust']
                low_stress  = ['joy', 'surprise']

                if label in high_stress:
                    score = round(0.5 + (confidence * 0.45), 2)
                elif label in low_stress:
                    score = round(0.5 - (confidence * 0.45), 2)
                else:
                    score = 0.50

                return {"score": score, "label": label, "confidence": confidence}

            except Exception as e:
                print(f"RoBERTa inference error, falling back to keywords: {e}")

        # ── Keyword fallback ──────────────────────────────────────────────────
        return keyword_classify(text)


text_analyzer = TextEmotionAnalyzer()
