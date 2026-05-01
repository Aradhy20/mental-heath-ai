import torch
import torch.nn as nn
import torch.nn.functional as F

class FaceVisionModel(nn.Module):
    """
    Placeholder/Interface for Face processing.
    In practice, this will receive facial landmarks (e.g. MediaPipe: 478 x,y,z coords) 
    or an EfficientNet backbone passing an image.
    """
    def __init__(self, input_dim=(478 * 3), num_emotions=5):
        super(FaceVisionModel, self).__init__()
        
        self.net = nn.Sequential(
            nn.Linear(input_dim, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.3),
            
            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.3),
            
            nn.Linear(256, num_emotions)
        )

    def forward(self, x):
        # Fallback if no face detected in confidence map -> output zeros
        if torch.sum(x) == 0:
            return torch.zeros((x.size(0), 5), device=x.device)
            
        return self.net(x)
