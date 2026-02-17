import torch
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import numpy as np
from typing import Tuple, Dict, List, Any
import os

class TextAnalyzer:
    def __init__(self, model_path=None):
        """
        Initialize the Text Analyzer with DistilRoBERTa model
        """
        self.model_name = "j-hartmann/emotion-english-distilroberta-base"
        self.emotions = ["anger", "disgust", "fear", "joy", "neutral", "sadness", "surprise"]
        self.is_mock = False
        
        try:
            # Check if Lite Mode is enabled
            if os.getenv("AI_LITE_MODE", "false").lower() == "true":
                print("AI Lite Mode enabled. Using mock implementation for speed.")
                self.is_mock = True
                self._init_mock()
                return

            # Detect GPU availability
            device = 0 if torch.cuda.is_available() else -1
            device_name = "GPU" if device == 0 else "CPU"
            print(f"Device set to use {device_name}")
            
            # Check if local model exists
            if model_path and os.path.exists(model_path):
                print(f"Loading local model from {model_path}...")
                self.classifier = pipeline("text-classification", model=model_path, return_all_scores=True, device=device)
            else:
                # Download/Load from Hugging Face
                print(f"Loading model {self.model_name} from Hugging Face...")
                self.classifier = pipeline("text-classification", model=self.model_name, return_all_scores=True, device=device)
                
        except Exception as e:
            print(f"Warning: Could not load model {self.model_name}. Using mock implementation. Error: {str(e)}")
            self.is_mock = True
            self._init_mock()

    def _init_mock(self):
        """Initialize mock weights for fallback"""
        self.mock_weights = {
            "joy": ["happy", "excited", "pleased", "delighted", "thrilled", "wonderful", "amazing", "fantastic"],
            "sadness": ["sad", "depressed", "lonely", "upset", "disappointed", "miserable", "gloomy", "melancholy"],
            "anger": ["angry", "furious", "irritated", "annoyed", "mad", "outraged", "enraged", "livid"],
            "fear": ["afraid", "scared", "terrified", "anxious", "worried", "nervous", "panicked", "frightened"],
            "disgust": ["disgusted", "repulsed", "revolted", "nauseated", "appalled", "offended", "sickened"],
            "surprise": ["surprised", "amazed", "astonished", "shocked", "stunned", "startled", "bewildered"],
            "neutral": ["normal", "okay", "fine", "regular", "standard", "typical", "usual", "common"]
        }

    def analyze_emotion(self, text: str) -> Tuple[str, float, float]:
        """
        Analyze text for emotional content
        Returns: (emotion_label, emotion_score, confidence)
        """
        if not text:
            return "neutral", 0.0, 0.0

        if self.is_mock:
            return self._analyze_mock(text)
        
        try:
            # Run inference
            results = self.classifier(text)[0]
            # results is a list of dicts: [{'label': 'anger', 'score': 0.01}, ...]
            
            # Find max score
            top_result = max(results, key=lambda x: x['score'])
            emotion_label = top_result['label']
            confidence = top_result['score']
            
            # For compatibility with existing system, we return confidence as score too
            # In a more complex system, score might be intensity
            emotion_score = confidence
            
            return emotion_label, emotion_score, confidence
            
        except Exception as e:
            print(f"Error during inference: {e}. Falling back to mock.")
            return self._analyze_mock(text)

    def _analyze_mock(self, text: str) -> Tuple[str, float, float]:
        """Mock analysis implementation"""
        text_lower = text.lower()
        emotion_scores = {}
        total_matches = 0
        
        for emotion, keywords in self.mock_weights.items():
            matches = sum(1 for keyword in keywords if keyword in text_lower)
            emotion_scores[emotion] = matches
            total_matches += matches
        
        if total_matches == 0:
            return "neutral", 0.5, 0.7
        
        dominant_emotion = max(emotion_scores, key=emotion_scores.get)
        max_matches = emotion_scores[dominant_emotion]
        
        emotion_score = min(max_matches / 10.0, 0.95)
        confidence = min(0.5 + (len(text.split()) * 0.02) + (max_matches / total_matches * 0.3), 0.95)
        
        return dominant_emotion, emotion_score, confidence

    def get_all_scores(self, text: str) -> Dict[str, float]:
        """Get scores for all emotions"""
        if self.is_mock:
            return {e: 0.14 for e in self.emotions} # Uniform distribution
            
        try:
            results = self.classifier(text)[0]
            return {res['label']: res['score'] for res in results}
        except Exception:
            return {e: 0.14 for e in self.emotions}

if __name__ == "__main__":
    # Test
    analyzer = TextAnalyzer()
    print(analyzer.analyze_emotion("I am so happy today!"))
