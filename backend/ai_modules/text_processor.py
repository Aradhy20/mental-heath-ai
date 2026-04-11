from transformers import pipeline

class TextEmotionAnalyzer:
    def __init__(self):
        # We load a small, efficient pre-trained emotion Roberta model.
        # Ensure 'transformers' and 'torch' are installed.
        print("Loading RoBERTa text emotion model...")
        try:
            self.classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=1)
            self.active = True
        except Exception as e:
            print(f"Failed to load RoBERTa model for text: {e}")
            self.active = False
            
    def analyze(self, text: str):
        if not self.active or not text.strip():
            return {"score": 0.5, "label": "neutral", "confidence": 1.0}
            
        try:
            result = self.classifier(text)[0][0]
            label = result['label']
            confidence = result['score']
            
            # Map specific emotions to a stress/negativity scalar (0-1) where 1 = High Stress
            high_stress_emotions = ['sadness', 'fear', 'anger', 'disgust']
            low_stress_emotions = ['joy', 'surprise']
            
            if label in high_stress_emotions:
                score = 0.5 + (confidence * 0.5) # Scale to 0.5 - 1.0
            elif label in low_stress_emotions:
                score = 0.5 - (confidence * 0.5) # Scale to 0.0 - 0.5
            else:
                score = 0.5 # Neutral
                
            return {"score": round(score, 2), "label": label, "confidence": round(confidence, 2)}
        except Exception as e:
            print(f"Text analysis error: {e}")
            return {"score": 0.5, "label": "neutral", "confidence": 0.0}

text_analyzer = TextEmotionAnalyzer()
