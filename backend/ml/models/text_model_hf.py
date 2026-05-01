import torch
import torch.nn as nn
try:
    from transformers import AutoModel, AutoConfig
except ImportError:
    pass

class HFTextEmotionRiskModel(nn.Module):
    """
    Multi-task learning model utilizing DistilBERT.
    Predicts both Core Emotion and Risk Level simultaneously.
    """
    def __init__(self, model_name="distilbert-base-uncased", num_emotions=5, num_risk_levels=3):
        super(HFTextEmotionRiskModel, self).__init__()
        
        # Load pre-trained huggingface model backbone
        self.config = AutoConfig.from_pretrained(model_name)
        self.backbone = AutoModel.from_pretrained(model_name)
        
        # 768 is default hidden state size for DistilBERT
        hidden_size = self.config.hidden_size
        
        self.dropout = nn.Dropout(0.3)
        
        # Task 1: Emotion Classification Head
        self.emotion_head = nn.Sequential(
            nn.Linear(hidden_size, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, num_emotions)
        )
        
        # Task 2: Risk Classification Head (Low/Moderate/High)
        self.risk_head = nn.Sequential(
            nn.Linear(hidden_size, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, num_risk_levels)
        )

    def forward(self, input_ids, attention_mask):
        # Extract features mapped to last_hidden_state
        outputs = self.backbone(input_ids=input_ids, attention_mask=attention_mask)
        
        # Taking the [CLS] token equivalent representation (first token)
        hidden_state = outputs.last_hidden_state[:, 0, :]
        hidden_state = self.dropout(hidden_state)
        
        # Multi-task predictions
        emotion_logits = self.emotion_head(hidden_state)
        risk_logits = self.risk_head(hidden_state)
        
        return emotion_logits, risk_logits
