import torch
import torch.nn as nn
import torch.nn.functional as F

class AudioCNNModel(nn.Module):
    """
    1D Convolutional Neural Network specifically for Audio MFCCs and metrics.
    Expects input shape: (batch_size, channels, sequence_length) 
    In our flat feature case (16 dims), we interpret it as 1 channel of 16 sequence length,
    or we can use it as a robust MLP if inputs are strictly flat means.
    """
    def __init__(self, input_dim=16, num_emotions=5):
        super(AudioCNNModel, self).__init__()
        # If we have fixed 16 flat features per audio:
        # We can still apply 1D convolutions by viewing input as (B, 1, 16)
        
        self.conv1 = nn.Conv1d(in_channels=1, out_channels=32, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm1d(32)
        
        self.conv2 = nn.Conv1d(in_channels=32, out_channels=64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm1d(64)
        
        self.pool = nn.MaxPool1d(2)
        
        self.fc1 = nn.Linear(64 * (input_dim // 2), 128)
        self.dropout = nn.Dropout(0.3)
        self.fc2 = nn.Linear(128, num_emotions)

    def forward(self, x):
        # x expected: (Batch, Features) -> reshape to (Batch, Channels, Features)
        if len(x.shape) == 2:
            x = x.unsqueeze(1)
            
        x = self.conv1(x)
        x = F.relu(self.bn1(x))
        
        x = self.conv2(x)
        x = F.relu(self.bn2(x))
        
        x = self.pool(x)
        
        # Flatten
        x = x.view(x.size(0), -1)
        
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        logits = self.fc2(x)
        
        return logits
