"""
MindfulAI — Audio Emotion Model Training
Dataset: confit/cremad-parquet (HuggingFace mirror of CREMA-D / Kaggle)
Method: librosa MFCC (40 coeff) + Pitch + Energy + ZCR → PyTorch 3-layer MLP
Output: backend/ml/models/audio_model.pt
"""

import os
import io
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import librosa
from datasets import load_dataset
from sklearn.metrics import accuracy_score, f1_score, classification_report
from sklearn.model_selection import train_test_split
from torch.utils.data import DataLoader, TensorDataset
from tqdm import tqdm

# ─── CONFIG ──────────────────────────────────────────────────────────────────
DATASET_ID  = "confit/cremad-parquet"
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "../../ml/models/audio_model.pt")
NUM_EPOCHS  = 15
BATCH_SIZE  = 64
LR          = 1e-3
N_MFCC      = 40

# CREMA-D emotion labels → our unified system
CREMA_LABEL_MAP = {
    "ANG": "anger",
    "DIS": "neutral",   # disgust → neutral (closest available)
    "FEA": "fear",
    "HAP": "joy",
    "NEU": "neutral",
    "SAD": "sadness",
}
EMOTION_TO_ID = {"joy": 0, "sadness": 1, "anger": 2, "fear": 3, "neutral": 4}
ID_TO_EMOTION = {v: k for k, v in EMOTION_TO_ID.items()}
NUM_CLASSES   = len(EMOTION_TO_ID)

# ─── DEVICE ──────────────────────────────────────────────────────────────────
if torch.backends.mps.is_available():
    device = torch.device("mps")
    print("✅ Using Apple Silicon MPS GPU")
elif torch.cuda.is_available():
    device = torch.device("cuda")
    print("✅ Using CUDA GPU")
else:
    device = torch.device("cpu")
    print("⚠️  Using CPU")

# ─── FEATURE EXTRACTION ──────────────────────────────────────────────────────
def extract_features(audio_array: np.ndarray, sr: int = 16000) -> np.ndarray:
    """
    Extract a 45-dim feature vector from raw audio:
    - MFCC x40
    - Pitch (mean)
    - Energy (RMS mean)
    - ZCR (mean)
    - Spectral Centroid (mean)
    - Spectral Rolloff (mean)
    """
    # Ensure mono + normalize
    if audio_array.ndim > 1:
        audio_array = audio_array.mean(axis=0)
    audio_array = audio_array.astype(np.float32)
    if audio_array.max() > 1.0:
        audio_array = audio_array / 32768.0  # int16 → float

    # MFCC (40 coefficients)
    mfccs = librosa.feature.mfcc(y=audio_array, sr=sr, n_mfcc=N_MFCC)
    mfcc_mean = np.mean(mfccs, axis=1)   # shape: (40,)

    # Pitch
    pitches, magnitudes = librosa.piptrack(y=audio_array, sr=sr)
    pitch_vals = pitches[magnitudes > 0]
    pitch_mean = float(np.mean(pitch_vals)) if len(pitch_vals) > 0 else 0.0

    # Energy (RMS)
    rms = librosa.feature.rms(y=audio_array)
    energy_mean = float(np.mean(rms))

    # Zero Crossing Rate
    zcr = librosa.feature.zero_crossing_rate(y=audio_array)
    zcr_mean = float(np.mean(zcr))

    # Spectral Centroid
    spec_centroid = librosa.feature.spectral_centroid(y=audio_array, sr=sr)
    centroid_mean = float(np.mean(spec_centroid))

    # Spectral Rolloff
    rolloff = librosa.feature.spectral_rolloff(y=audio_array, sr=sr)
    rolloff_mean = float(np.mean(rolloff))

    features = np.concatenate([
        mfcc_mean,
        [pitch_mean, energy_mean, zcr_mean, centroid_mean, rolloff_mean]
    ])  # shape: (45,)

    return features.astype(np.float32)

# ─── LOAD DATASET & EXTRACT FEATURES ─────────────────────────────────────────
print(f"\n📦 Loading {DATASET_ID}...")
raw = load_dataset(DATASET_ID, split="train")
print(f"   Total samples: {len(raw)}")
print(f"   Columns: {raw.column_names}")

features_list = []
labels_list   = []
skipped       = 0

print("\n🔧 Extracting audio features (MFCC + Pitch + Energy)...")
for sample in tqdm(raw, desc="Processing audio"):
    try:
        # Get emotion label
        raw_label = sample.get("emotion") or sample.get("label") or sample.get("EmotionCode")
        if raw_label is None:
            skipped += 1
            continue

        raw_label = str(raw_label).strip().upper()
        mapped_emotion = CREMA_LABEL_MAP.get(raw_label)
        if mapped_emotion is None:
            # Try partial match
            for k in CREMA_LABEL_MAP:
                if k in raw_label:
                    mapped_emotion = CREMA_LABEL_MAP[k]
                    break
        if mapped_emotion is None:
            skipped += 1
            continue

        label_id = EMOTION_TO_ID[mapped_emotion]

        # Get audio
        audio_col = sample.get("audio") or sample.get("Audio")
        if audio_col is None:
            skipped += 1
            continue

        # HF audio column is a dict with 'array' and 'sampling_rate'
        if isinstance(audio_col, dict):
            arr = np.array(audio_col["array"])
            sr  = audio_col.get("sampling_rate", 16000)
        else:
            skipped += 1
            continue

        feat = extract_features(arr, sr=sr)
        features_list.append(feat)
        labels_list.append(label_id)

    except Exception as e:
        skipped += 1

print(f"\n   Processed: {len(features_list)} samples | Skipped: {skipped}")

X = np.stack(features_list, axis=0)
y = np.array(labels_list, dtype=np.int64)

# Label distribution
from collections import Counter
dist = Counter([ID_TO_EMOTION[l] for l in y])
print(f"   Label distribution: {dict(dist)}")

# ─── TRAIN/VAL/TEST SPLIT ────────────────────────────────────────────────────
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
X_val,   X_test, y_val,   y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp)
print(f"   Train: {len(X_train)} | Val: {len(X_val)} | Test: {len(X_test)}")

# Normalize features (standardize per feature)
X_mean = X_train.mean(axis=0)
X_std  = X_train.std(axis=0) + 1e-8
X_train = (X_train - X_mean) / X_std
X_val   = (X_val   - X_mean) / X_std
X_test  = (X_test  - X_mean) / X_std

# Save normalization params alongside model
norm_params = {"mean": X_mean.tolist(), "std": X_std.tolist()}

to_tensor = lambda arr, lbl: TensorDataset(
    torch.tensor(arr, dtype=torch.float32),
    torch.tensor(lbl, dtype=torch.long)
)
train_loader = DataLoader(to_tensor(X_train, y_train), batch_size=BATCH_SIZE, shuffle=True)
val_loader   = DataLoader(to_tensor(X_val,   y_val),   batch_size=BATCH_SIZE)
test_loader  = DataLoader(to_tensor(X_test,  y_test),  batch_size=BATCH_SIZE)

# ─── MLP ARCHITECTURE ────────────────────────────────────────────────────────
class AudioEmotionMLP(nn.Module):
    def __init__(self, input_dim: int, num_classes: int):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.3),

            nn.Linear(256, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.3),

            nn.Linear(128, 64),
            nn.ReLU(),

            nn.Linear(64, num_classes),
        )

    def forward(self, x):
        return self.net(x)

model = AudioEmotionMLP(input_dim=X.shape[1], num_classes=NUM_CLASSES).to(device)
print(f"\n🤖 Model Architecture:\n{model}")
print(f"   Input dim: {X.shape[1]} | Output classes: {NUM_CLASSES}")

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LR)
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.5)

# ─── TRAINING LOOP ───────────────────────────────────────────────────────────
print(f"\n🚀 Training Audio MLP for {NUM_EPOCHS} epochs...")
best_val_f1 = 0.0
best_state  = None

for epoch in range(1, NUM_EPOCHS + 1):
    model.train()
    train_loss = 0.0
    for X_b, y_b in train_loader:
        X_b, y_b = X_b.to(device), y_b.to(device)
        optimizer.zero_grad()
        loss = criterion(model(X_b), y_b)
        loss.backward()
        optimizer.step()
        train_loss += loss.item()

    # Validation
    model.eval()
    val_preds, val_true = [], []
    with torch.no_grad():
        for X_b, y_b in val_loader:
            X_b = X_b.to(device)
            preds = model(X_b).argmax(dim=1).cpu().numpy()
            val_preds.extend(preds)
            val_true.extend(y_b.numpy())

    val_acc = accuracy_score(val_true, val_preds)
    val_f1  = f1_score(val_true, val_preds, average="weighted")
    scheduler.step()

    print(f"  Epoch {epoch:02d}/{NUM_EPOCHS} | Loss: {train_loss/len(train_loader):.4f} | Val Acc: {val_acc:.4f} | Val F1: {val_f1:.4f}")

    if val_f1 > best_val_f1:
        best_val_f1 = val_f1
        best_state = {k: v.clone() for k, v in model.state_dict().items()}

# ─── TEST EVALUATION ─────────────────────────────────────────────────────────
model.load_state_dict(best_state)
model.eval()

test_preds, test_true = [], []
with torch.no_grad():
    for X_b, y_b in test_loader:
        X_b = X_b.to(device)
        preds = model(X_b).argmax(dim=1).cpu().numpy()
        test_preds.extend(preds)
        test_true.extend(y_b.numpy())

test_acc = accuracy_score(test_true, test_preds)
test_f1  = f1_score(test_true, test_preds, average="weighted")

print(f"\n{'='*50}")
print(f"✅ AUDIO EMOTION MODEL RESULTS")
print(f"   Accuracy  : {test_acc:.4f}")
print(f"   F1 Score  : {test_f1:.4f}")
print(f"\n{classification_report(test_true, test_preds, target_names=list(EMOTION_TO_ID.keys()))}")
print(f"{'='*50}")

# ─── SAVE ────────────────────────────────────────────────────────────────────
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
torch.save({
    "model_state": best_state,
    "input_dim":   X.shape[1],
    "num_classes": NUM_CLASSES,
    "id2emotion":  ID_TO_EMOTION,
    "emotion2id":  EMOTION_TO_ID,
    "norm_mean":   X_mean.tolist(),
    "norm_std":    X_std.tolist(),
}, OUTPUT_PATH)
print(f"\n💾 Audio model saved → {OUTPUT_PATH}")
