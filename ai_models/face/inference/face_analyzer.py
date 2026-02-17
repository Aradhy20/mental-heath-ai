import sys
import os

# Add parent directory to path to allow importing model
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

try:
    from model.emotion_cnn import EmotionCNN
except ImportError:
    # Fallback if relative import fails (e.g. running from different dir)
    sys.path.append(os.path.dirname(parent_dir))
    from face.model.emotion_cnn import EmotionCNN

class FaceAnalyzer:
    def __init__(self, model_path=None):
        self.cnn = EmotionCNN(model_path)
        
    def analyze_emotion(self, image_data):
        """
        Analyze emotion from image data
        Args:
            image_data: bytes of image file
        Returns:
            tuple: (emotion_label, face_score, confidence)
        """
        emotion_label, confidence, _ = self.cnn.predict_emotion(image_data)
        
        # Calculate face score (0-1 scale, higher = more positive emotion)
        emotion_scores = {
            'Happy': 1.0,
            'Surprise': 0.8,
            'Neutral': 0.5,
            'Sad': 0.3,
            'Fear': 0.2,
            'Angry': 0.1,
            'Disgust': 0.1
        }
        
        face_score = emotion_scores.get(emotion_label, 0.5)
        
        return emotion_label, face_score, confidence

    def analyze_micro_expressions(self, image_data):
        """
        Analyze micro-expressions from image data (Phase 4 placeholder)
        """
        return {
            'detected': False,
            'micro_expressions': [],
            'confidence': 0.0,
            'analysis': 'Micro-expression analysis not yet implemented. Future integration planned.',
            'note': 'This feature requires specialized ML model for detecting brief facial movements (40-500ms duration)'
        }

if __name__ == "__main__":
    analyzer = FaceAnalyzer()
    print("Face Analyzer initialized")
