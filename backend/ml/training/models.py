import torch
import torch.nn as nn
import torch.nn.functional as F

# ─── TEXT MODELS ─────────────────────────────────────────────────────────────

class TextClassifier(nn.Module):
    """
    Classifies emotion and cognitive patterns from text embeddings.
    Input: SentenceTransformer Embedding (dim=384 for MiniLM)
    """
    def __init__(self, input_dim=384, num_emotions=5, num_patterns=4):
        super(TextClassifier, self).__init__()
        self.shared = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 128),
            nn.ReLU()
        )
        # Multi-head output
        self.emotion_head = nn.Linear(128, num_emotions)
        self.pattern_head = nn.Linear(128, num_patterns)

    def forward(self, x):
        features = self.shared(x)
        emotions = self.emotion_head(features)
        patterns = self.pattern_head(features)
        return emotions, patterns

class RiskSentinel(nn.Module):
    """
    Dedicated Binary/Ternary Classifier for clinical risk detection.
    """
    def __init__(self, input_dim=384):
        super(RiskSentinel, self).__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 3) # LOW, MODERATE, HIGH
        )

    def forward(self, x):
        return self.net(x)

# ─── AUDIO MODELS ────────────────────────────────────────────────────────────

class AudioStressModel(nn.Module):
    """
    CNN-based model for stress detection from audio features (MFCCs).
    """
    def __init__(self, input_dim=15): # 13 MFCC + Pitch + Energy
        super(AudioStressModel, self).__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1), # Stress score 0 to 1
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x)

# ─── FACE MODELS ─────────────────────────────────────────────────────────────

class LandmarkClassifier(nn.Module):
    """
    Classifies mental state from facial landmarks (e.g. results from MediaPipe).
    """
    def __init__(self, input_dim=478 * 3): # 478 landmarks with (x,y,z)
        super(LandmarkClassifier, self).__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Linear(128, 3) # Anxiety, Depression, Normal
        )

    def forward(self, x):
        return self.net(x)

# ─── FUSION & TEMPORAL ───────────────────────────────────────────────────────

class LateFusionEngine:
    """
    Logic-based fusion of modality outputs.
    """
    def fuse(self, text_score, audio_score, face_score, confidences):
        # Weighted average based on modality availability
        weights = torch.tensor([0.5, 0.3, 0.2]) * confidences
        weights = weights / weights.sum()
        
        fused = (text_score * weights[0] + 
                 audio_score * weights[1] + 
                 face_score * weights[2])
        return fused
