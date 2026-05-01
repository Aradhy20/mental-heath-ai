"""
MindfulAI — Depression / Risk Detection Model Training
Dataset: hugginglearners/reddit-depression-cleaned (HuggingFace)
Model: distilbert-base-uncased → binary (safe vs depressed), 3-tier at inference
Method: Pure PyTorch training loop (no Trainer API)
Output: backend/ml/models/risk_model/
"""

import os
import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
import numpy as np
from torch.utils.data import DataLoader, Dataset as TorchDataset
from datasets import load_dataset
from sklearn.metrics import accuracy_score, f1_score, classification_report
from sklearn.model_selection import train_test_split
from tqdm import tqdm

# ─── CONFIG ──────────────────────────────────────────────────────────────────
MODEL_NAME = "distilbert-base-uncased"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "../../ml/models/risk_model")
os.makedirs(OUTPUT_DIR, exist_ok=True)

NUM_EPOCHS = 3
BATCH_SIZE = 16
LR         = 2e-5
MAX_LEN    = 256

# Confidence thresholds for 3-tier mapping at inference
MODERATE_THRESHOLD = 0.50
HIGH_THRESHOLD     = 0.75

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

from transformers import AutoTokenizer, AutoModelForSequenceClassification

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

# ─── DATASET WRAPPER ─────────────────────────────────────────────────────────
class RedditDepressionDataset(TorchDataset):
    def __init__(self, texts, labels):
        self.texts  = texts
        self.labels = labels

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        enc = tokenizer(
            self.texts[idx],
            truncation=True,
            max_length=MAX_LEN,
            padding="max_length",
            return_tensors="pt",
        )
        return {
            "input_ids":      enc["input_ids"].squeeze(0),
            "attention_mask": enc["attention_mask"].squeeze(0),
            "label":          torch.tensor(self.labels[idx], dtype=torch.long),
        }

# ─── LOAD DATA ───────────────────────────────────────────────────────────────
print("\n📦 Loading reddit-depression-cleaned dataset...")
raw = load_dataset("hugginglearners/reddit-depression-cleaned", split="train")
df  = raw.to_pandas()
print(f"   Total: {len(df)} | Positive (depressed): {df['is_depression'].sum()}")

texts  = df["clean_text"].tolist()
labels = df["is_depression"].tolist()  # binary: 0=safe, 1=depressed

train_x, temp_x, train_y, temp_y = train_test_split(texts, labels, test_size=0.2, random_state=42, stratify=labels)
val_x, test_x, val_y, test_y     = train_test_split(temp_x, temp_y, test_size=0.5, random_state=42, stratify=temp_y)
print(f"   Train: {len(train_x)} | Val: {len(val_x)} | Test: {len(test_x)}")

train_loader = DataLoader(RedditDepressionDataset(train_x, train_y), batch_size=BATCH_SIZE, shuffle=True)
val_loader   = DataLoader(RedditDepressionDataset(val_x,   val_y),   batch_size=BATCH_SIZE)
test_loader  = DataLoader(RedditDepressionDataset(test_x,  test_y),  batch_size=BATCH_SIZE)

# ─── MODEL ───────────────────────────────────────────────────────────────────
print(f"\n🤖 Loading {MODEL_NAME} (binary classification)...")
model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=2,
    id2label={0: "safe", 1: "depressed"},
    label2id={"safe": 0, "depressed": 1},
    ignore_mismatched_sizes=True,
)
model = model.to(device)

optimizer = optim.AdamW(model.parameters(), lr=LR)
criterion = nn.CrossEntropyLoss()

# ─── TRAINING LOOP ───────────────────────────────────────────────────────────
def evaluate(loader):
    model.eval()
    all_preds, all_labels = [], []
    with torch.no_grad():
        for batch in loader:
            ids    = batch["input_ids"].to(device)
            mask   = batch["attention_mask"].to(device)
            logits = model(input_ids=ids, attention_mask=mask).logits
            preds  = logits.argmax(dim=-1).cpu().numpy()
            all_preds.extend(preds)
            all_labels.extend(batch["label"].numpy())
    acc = accuracy_score(all_labels, all_preds)
    f1  = f1_score(all_labels, all_preds, average="weighted")
    return acc, f1

print(f"\n🚀 Training for {NUM_EPOCHS} epochs (device: {device})...")
best_val_f1 = 0.0

for epoch in range(1, NUM_EPOCHS + 1):
    model.train()
    total_loss = 0.0
    for batch in tqdm(train_loader, desc=f"Epoch {epoch}/{NUM_EPOCHS}"):
        ids    = batch["input_ids"].to(device)
        mask   = batch["attention_mask"].to(device)
        labs   = batch["label"].to(device)
        optimizer.zero_grad()
        logits = model(input_ids=ids, attention_mask=mask).logits
        loss   = criterion(logits, labs)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    val_acc, val_f1 = evaluate(val_loader)
    avg_loss = total_loss / len(train_loader)
    print(f"  Epoch {epoch} | Loss: {avg_loss:.4f} | Val Acc: {val_acc:.4f} | Val F1: {val_f1:.4f}")

    if val_f1 > best_val_f1:
        best_val_f1 = val_f1
        model.save_pretrained(OUTPUT_DIR)
        tokenizer.save_pretrained(OUTPUT_DIR)
        print(f"  💾 New best model saved (F1={val_f1:.4f})")

# ─── FINAL TEST EVALUATION ───────────────────────────────────────────────────
model = AutoModelForSequenceClassification.from_pretrained(OUTPUT_DIR).to(device)
test_acc, test_f1 = evaluate(test_loader)

print(f"\n{'='*50}")
print(f"✅ RISK MODEL — FINAL TEST RESULTS (binary)")
print(f"   Accuracy  : {test_acc:.4f}")
print(f"   F1 Score  : {test_f1:.4f}")
print(f"{'='*50}")

# ─── 3-TIER INFERENCE DEMO ───────────────────────────────────────────────────
print("\n🧪 3-Tier Risk Predictions (safe / moderate / high):")
model.eval()
demo_phrases = [
    "I had a great day and feel really positive about everything",
    "I've been feeling a bit low lately, things are tough but I'm managing",
    "I feel completely worthless. Nobody cares. I just want it to stop.",
    "Work has been stressful but I'm looking forward to the weekend",
    "Every day feels like a battle I'm losing. I'm exhausted and hopeless.",
]
for phrase in demo_phrases:
    enc = tokenizer(phrase, return_tensors="pt", truncation=True, max_length=MAX_LEN)
    enc = {k: v.to(device) for k, v in enc.items()}
    with torch.no_grad():
        logits = model(**enc).logits
        conf   = F.softmax(logits, dim=-1)[0][1].item()  # depressed confidence

    risk = "safe" if conf < MODERATE_THRESHOLD else ("moderate" if conf < HIGH_THRESHOLD else "high")
    print(f"  [{risk.upper():8}] (conf={conf:.2f}) — \"{phrase[:55]}\"")
