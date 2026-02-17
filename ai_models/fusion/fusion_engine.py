from typing import Dict, Any

class FusionEngine:
    def __init__(self):
        self.weights = {
            "text": 0.3,
            "voice": 0.3,
            "face": 0.4
        }
        
    def fuse_results(self, text_result: Dict[str, Any], voice_result: Dict[str, Any], face_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Combine results from all modalities
        
        Expected input format:
        text_result: {'emotion': str, 'score': float (0-1), 'confidence': float}
        voice_result: {'stress': str, 'score': float (0-1, higher=stress), 'confidence': float}
        face_result: {'emotion': str, 'score': float (0-1, higher=positive), 'confidence': float}
        """
        
        # Normalize scores to "Wellness Score" (0-1, higher is better)
        
        # Text: Assuming score is confidence of emotion. 
        # We need to check if emotion is positive or negative.
        # For simplicity, let's assume the caller passes a "positivity score" or we map it here.
        # But the current text_analyzer returns (label, score, confidence).
        # We need a mapping.
        
        text_emotion = text_result.get('emotion', 'neutral')
        text_conf = text_result.get('confidence', 0.5)
        text_positivity = self._get_emotion_positivity(text_emotion) * text_conf
        
        # Voice: Score is stress level (0-1). 
        # Wellness = 1 - Stress
        voice_stress = voice_result.get('score', 0.5)
        voice_wellness = 1.0 - voice_stress
        
        # Face: Score is "face score" which we defined as higher = more positive
        face_positivity = face_result.get('score', 0.5)
        
        # Calculate weighted average
        overall_score = (
            text_positivity * self.weights['text'] +
            voice_wellness * self.weights['voice'] +
            face_positivity * self.weights['face']
        )
        
        return {
            "overall_score": overall_score,
            "components": {
                "text_positivity": text_positivity,
                "voice_wellness": voice_wellness,
                "face_positivity": face_positivity
            },
            "weights": self.weights,
            "analysis": self._generate_analysis(overall_score),
            "risk_level": self._calculate_risk(overall_score)
        }

    def _get_emotion_positivity(self, emotion: str) -> float:
        """Map emotion to positivity score (0-1)"""
        emotion = emotion.lower()
        mapping = {
            "joy": 1.0,
            "happy": 1.0,
            "surprise": 0.7,
            "neutral": 0.5,
            "sadness": 0.3,
            "sad": 0.3,
            "fear": 0.2,
            "anger": 0.1,
            "disgust": 0.1
        }
        return mapping.get(emotion, 0.5)

    def _generate_analysis(self, score: float) -> str:
        if score >= 0.7:
            return "Mental state appears positive and stable. Multiple modalities indicate good well-being."
        elif score >= 0.4:
            return "Mental state appears moderate. Some indicators of stress or negative emotion present."
        else:
            return "Mental state appears low. Significant stress or negative emotions detected across modalities."

    def _calculate_risk(self, score: float) -> str:
        if score < 0.3:
            return "high"
        elif score < 0.6:
            return "medium"
        else:
            return "low"

if __name__ == "__main__":
    engine = FusionEngine()
    print("Fusion Engine initialized")
