import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import numpy as np
import pandas as pd
from sklearn.metrics import f1_score, accuracy_score
import sys

# Ensure modules resolve properly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

# Attempt to load custom modular architectures
try:
    from ml.models.text_model_hf import HFTextEmotionRiskModel
    from ml.models.audio_model import AudioCNNModel
    from ml.models.face_model import FaceVisionModel
    from ml.dataset.data_cleaning import DataCleaner
    from ml.dataset.feature_engineering import FeatureEngineer
    from transformers import AutoTokenizer
except ImportError as e:
    print(f"Module Resolution Error: {e}")

class ModularTrainer:
    def __init__(self, patience=3, epochs=10):
        self.patience = patience
        self.epochs = epochs
        self.device = torch.device('mps' if torch.backends.mps.is_available() else 'cpu')
        print(f"🚀 Using Device: {self.device}")

    def train_with_validation(self, model, train_loader, val_loader, criterion, optimizer, model_name="model"):
        """
        Executes a professional training loop with early stopping tracking F1-score and Validation Loss.
        """
        model.to(self.device)
        best_val_loss = float('inf')
        patience_counter = 0
        
        for epoch in range(self.epochs):
            # --- TRAINING PHASE ---
            model.train()
            total_train_loss = 0
            for batch in train_loader:
                optimizer.zero_grad()
                
                # Unpack generic batch based on multi-tasking
                if len(batch) == 4:
                    # Text Multi-Task: inputs, masks, emo_labels, risk_labels
                    inputs = batch[0].to(self.device).long()
                    masks = batch[1].to(self.device).long()
                    emo_labels = batch[2].to(self.device).long()
                    risk_labels = batch[3].to(self.device).long()
                    
                    emo_logits, risk_logits = model(inputs, masks)
                    
                    # Assuming passed criterion is a dict or multiple
                    loss = criterion['emotion'](emo_logits, emo_labels) + criterion['risk'](risk_logits, risk_labels)
                else:
                    # Generic Singletask: features, labels
                    features = batch[0].to(self.device).float()
                    labels = batch[1].to(self.device).long()
                    
                    logits = model(features)
                    loss = criterion(logits, labels)

                loss.backward()
                optimizer.step()
                total_train_loss += loss.item()
                
            avg_train_loss = total_train_loss / len(train_loader)
            
            # --- VALIDATION PHASE ---
            model.eval()
            total_val_loss = 0
            all_preds = []
            all_true = []
            
            with torch.no_grad():
                for batch in val_loader:
                    if len(batch) == 4:
                        inputs = batch[0].to(self.device).long()
                        masks = batch[1].to(self.device).long()
                        emo_labels = batch[2].to(self.device).long()
                        risk_labels = batch[3].to(self.device).long()
                        
                        emo_logits, risk_logits = model(inputs, masks)
                        loss = criterion['emotion'](emo_logits, emo_labels) + criterion['risk'](risk_logits, risk_labels)
                        
                        preds = torch.argmax(emo_logits, dim=1)
                        all_preds.extend(preds.cpu().numpy())
                        all_true.extend(emo_labels.cpu().numpy())
                    else:
                        features = batch[0].to(self.device).float()
                        labels = batch[1].to(self.device).long()
                        
                        logits = model(features)
                        loss = criterion(logits, labels)
                        
                        preds = torch.argmax(logits, dim=1)
                        all_preds.extend(preds.cpu().numpy())
                        all_true.extend(labels.cpu().numpy())
                        
                    total_val_loss += loss.item()
            
            avg_val_loss = total_val_loss / len(val_loader)
            
            if len(all_true) > 0:
                acc = accuracy_score(all_true, all_preds)
                f1 = f1_score(all_true, all_preds, average='weighted', zero_division=0)
            else:
                acc, f1 = 0, 0
                
            print(f"[Epoch {epoch+1}/{self.epochs}] Train Loss: {avg_train_loss:.4f} "
                  f"| Val Loss: {avg_val_loss:.4f} | Val Acc: {acc:.4f} | Val F1: {f1:.4f}")
            
            # --- EARLY STOPPING CHECK ---
            if avg_val_loss < best_val_loss:
                best_val_loss = avg_val_loss
                patience_counter = 0
                torch.save(model.state_dict(), f"backend/ml/weights/{model_name}_best.pth")
                print(f"🟢 Improvement! Saved {model_name}_best.pth")
            else:
                patience_counter += 1
                if patience_counter >= self.patience:
                    print(f"🛑 Early stopping triggered. Validation loss failed to improve for {self.patience} epochs.")
                    break

from torch.utils.data import TensorDataset

def create_text_dataset(df, max_len=128):
    try:
        from transformers import AutoTokenizer
        tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
    except ImportError:
        print("Install transformers to run text tokenization!")
        return None

    texts = df['content'].tolist()
    labels = df['core_emotion'].tolist()
    
    # Simple label maps
    emotion_map = {"happy": 0, "sad": 1, "anxious": 2, "angry": 3, "neutral": 4}
    # For tweet dataset, risk is mocked to 0 (LOW) for all to train emotion mainly
    risk_labels = [0] * len(texts)
    emo_mapped = [emotion_map.get(e, 4) for e in labels]

    encodings = tokenizer(texts, truncation=True, padding=True, max_length=max_len, return_tensors='pt')
    
    return TensorDataset(
        encodings['input_ids'], 
        encodings['attention_mask'], 
        torch.tensor(emo_mapped, dtype=torch.long), 
        torch.tensor(risk_labels, dtype=torch.long)
    )

def main():
    print("🚀 Initializing End-to-End Enterprise Training Sequence...")
    os.makedirs("backend/ml/weights", exist_ok=True)
    
    trainer = ModularTrainer(epochs=3, patience=2) # Keep epochs low for immediate demonstration
    cleaner = DataCleaner()
    
    # -------------------------------------------------------------
    # 1. TEXT MODEL TRAINING (DistilBERT)
    # -------------------------------------------------------------
    print("\\n[1/3] Preparing TEXT Modality (DistilBERT)...")
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
    tweet_csv_path = os.path.join(project_root, "tweet_emotions.csv")
    
    if os.path.exists(tweet_csv_path):
        df_text = pd.read_csv(tweet_csv_path)
        df_text = cleaner.clean_text_data(df_text, text_col='content', label_col='sentiment')
        # Sub-sample heavily here just to prevent MPS from halting on 40,000 DistilBert epochs instantly
        df_text = df_text.sample(n=1000, random_state=42) 
        df_text = cleaner.balance_classes(df_text, strategy='oversample')
        
        train_df, val_df, _ = cleaner.split_data(df_text)
        
        train_ds = create_text_dataset(train_df)
        val_ds = create_text_dataset(val_df)
        
        train_loader = DataLoader(train_ds, batch_size=16, shuffle=True)
        val_loader = DataLoader(val_ds, batch_size=16, shuffle=False)
        
        print("Initializing HFTextEmotionRiskModel...")
        text_model = HFTextEmotionRiskModel(num_emotions=5, num_risk_levels=3)
        optimizer = optim.AdamW(text_model.parameters(), lr=2e-5)
        
        # Calculate dynamic class weights
        emo_weights = cleaner.get_class_weights(train_df).to(trainer.device)
        criterion = {
            'emotion': nn.CrossEntropyLoss(weight=emo_weights),
            'risk': nn.CrossEntropyLoss()
        }
        
        trainer.train_with_validation(text_model, train_loader, val_loader, criterion, optimizer, model_name="text_distilbert")
    else:
        print("⚠️ tweet_emotions.csv not found! Skipping Text Training.")

    # -------------------------------------------------------------
    # 2. AUDIO MODEL TRAINING (CNN)
    # -------------------------------------------------------------
    print("\\n[2/3] Preparing AUDIO Modality (CNN)...")
    import glob
    audio_wav_dir = os.path.join(project_root, "AudioWAV")
    if os.path.exists(audio_wav_dir):
        wav_files = glob.glob(os.path.join(audio_wav_dir, "*.wav"))[:200] # Super small sample for demo
        feature_list = []
        label_list = []
        emotion_map = {"HAP": 0, "SAD": 1, "FEA": 2, "ANG": 3, "NEU": 4, "DIS": 3}
        
        engineer = FeatureEngineer()
        for file in wav_files:
            filename = os.path.basename(file)
            parts = filename.split('_')
            if len(parts) >= 3:
                emo = parts[2]
                mapped_label = emotion_map.get(emo, 4)
                try:
                    feat = engineer.extract_audio_features(file)
                    feature_list.append(feat)
                    label_list.append(mapped_label)
                except Exception as e:
                    pass
        
        if feature_list:
            X = torch.tensor(np.array(feature_list), dtype=torch.float32)
            y = torch.tensor(label_list, dtype=torch.long)
            
            # Simple manual split given small sub-dataset
            split_idx = int(0.8 * len(X))
            train_ds = TensorDataset(X[:split_idx], y[:split_idx])
            val_ds = TensorDataset(X[split_idx:], y[split_idx:])
            
            train_loader = DataLoader(train_ds, batch_size=16, shuffle=True)
            val_loader = DataLoader(val_ds, batch_size=16)
            
            print("Initializing AudioCNNModel...")
            audio_model = AudioCNNModel(input_dim=16, num_emotions=5)
            optimizer_audio = optim.Adam(audio_model.parameters(), lr=0.001)
            criterion_audio = nn.CrossEntropyLoss()
            
            trainer.train_with_validation(audio_model, train_loader, val_loader, criterion_audio, optimizer_audio, model_name="audio_cnn")
    else:
        print("⚠️ AudioWAV directory not found! Skipping Audio Training.")

    # -------------------------------------------------------------
    # 3. FACE MODEL TRAINING (Placeholder Vision Interface)
    # -------------------------------------------------------------
    print("\\n[3/3] FACE Modality (Vision)...")
    print("Face model relies on dynamic MediaPipe arrays streaming from the frontend websocket. Model saved gracefully as placeholder.")
    face_model = FaceVisionModel()
    torch.save(face_model.state_dict(), "backend/ml/weights/face_efficientnet_best.pth")

if __name__ == "__main__":
    main()
