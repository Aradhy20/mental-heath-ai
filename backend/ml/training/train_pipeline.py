import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import json
import numpy as np
import os
from models import TextClassifier, AudioStressModel, RiskSentinel

# 🧠 DATASET CLASSES
class ClinicalTextDataset(Dataset):
    def __init__(self, data, embeddings):
        self.data = data
        self.embeddings = embeddings
        self.emotion_map = {"happy": 0, "sad": 1, "anxious": 2, "angry": 3, "neutral": 4}
        self.pattern_map = {"none": 0, "overthinking": 1, "catastrophizing": 2, "self-blame": 3}
        self.risk_map = {"LOW": 0, "MODERATE": 1, "HIGH": 2}

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        item = self.data[idx]
        emb = torch.tensor(self.embeddings[idx], dtype=torch.float32)
        emo = torch.tensor(self.emotion_map[item["label_emotion"]], dtype=torch.long)
        pat = torch.tensor(self.pattern_map[item["label_pattern"]], dtype=torch.long)
        risk = torch.tensor(self.risk_map[item["label_risk"]], dtype=torch.long)
        return emb, emo, pat, risk

class AudioFeaturesDataset(Dataset):
    def __init__(self, data):
        self.data = data

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        features = torch.tensor(self.data[idx]["features"], dtype=torch.float32)
        label = torch.tensor(self.data[idx]["label_stress"], dtype=torch.float32)
        return features, label

# 🧠 TRAINER
def train_model(model, train_loader, val_loader, criterion, optimizer, epochs=5, is_multi_head=False):
    model.train()
    for epoch in range(epochs):
        total_loss = 0
        for batch in train_loader:
            optimizer.zero_grad()
            
            if is_multi_head:
                emb, emo, pat, risk = batch
                out_emo, out_pat = model(emb)
                loss = criterion(out_emo, emo) + criterion(out_pat, pat)
            else:
                feat, label = batch
                output = model(feat).squeeze()
                loss = criterion(output, label)
                
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        
        print(f"Epoch {epoch+1}/{epochs} - Loss: {total_loss/len(train_loader):.4f}")

def run_training():
    os.makedirs("backend/ml/weights", exist_ok=True)
    
    # 1. LOAD DATA
    with open("backend/ml/data/text_clinical.json", "r") as f:
        text_raw = json.load(f)
    with open("backend/ml/data/audio_clinical.json", "r") as f:
        audio_raw = json.load(f)
        
    # Generate dummy embeddings (placeholder for SentenceTransformer)
    # In a real run, we would use: model.encode([t["text"] for t in text_raw])
    text_embeddings = np.random.normal(0, 1, (len(text_raw), 384))

    # 2. PREPARE DATALOADERS
    text_dataset = ClinicalTextDataset(text_raw, text_embeddings)
    audio_dataset = AudioFeaturesDataset(audio_raw)
    
    # 70/15/15 Split (Simplified for demo)
    train_size = int(0.7 * len(text_dataset))
    val_size = len(text_dataset) - train_size
    text_train, _ = torch.utils.data.random_split(text_dataset, [train_size, val_size])
    audio_train, _ = torch.utils.data.random_split(audio_dataset, [train_size, val_size])

    train_loader_text = DataLoader(text_train, batch_size=32, shuffle=True)
    train_loader_audio = DataLoader(audio_train, batch_size=32, shuffle=True)

    # 3. TRAIN TEXT CLASSIFIER
    print("🚀 Training Text Classifier...")
    text_model = TextClassifier()
    optimizer = optim.Adam(text_model.parameters(), lr=0.001)
    criterion = nn.CrossEntropyLoss()
    train_model(text_model, train_loader_text, None, criterion, optimizer, epochs=5, is_multi_head=True)
    torch.save(text_model.state_dict(), "backend/ml/weights/text_classifier.pth")

    # 4. TRAIN AUDIO MODEL
    print("🚀 Training Audio Stress Model...")
    audio_model = AudioStressModel()
    optimizer = optim.Adam(audio_model.parameters(), lr=0.001)
    criterion = nn.MSELoss()
    train_model(audio_model, train_loader_audio, None, criterion, optimizer, epochs=5)
    torch.save(audio_model.state_dict(), "backend/ml/weights/audio_stress.pth")

    # 5. TRAIN RISK SENTINEL
    print("🚀 Training Risk Sentinel...")
    risk_model = RiskSentinel()
    optimizer = optim.Adam(risk_model.parameters(), lr=0.001)
    criterion = nn.CrossEntropyLoss()
    # Using same text embeddings for risk training
    def risk_batch_iter():
        for batch in train_loader_text:
            emb, _, _, risk = batch
            yield emb, risk
            
    for epoch in range(5):
        total_loss = 0
        for emb, risk in risk_batch_iter():
            optimizer.zero_grad()
            output = risk_model(emb)
            loss = criterion(output, risk)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch+1}/5 - Risk Loss: {total_loss/len(train_loader_text):.4f}")
    
    torch.save(risk_model.state_dict(), "backend/ml/weights/risk_sentinel.pth")

    print("✅ All models trained and saved to backend/ml/weights/")

if __name__ == "__main__":
    run_training()
