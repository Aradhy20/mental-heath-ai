"""
MindfulAI — Emotion Detection Model Training
Dataset: dair-ai/emotion (HuggingFace)
Model: distilbert-base-uncased → 5-label emotion classifier
Method: Pure PyTorch training loop (no Trainer API, avoids TF conflicts)
Output: backend/ml/models/emotion_model/
"""

import os
import sys
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from torch.utils.data import DataLoader, Dataset as TorchDataset
from datasets import load_dataset
from sklearn.metrics import accuracy_score, f1_score, classification_report
from tqdm import tqdm

# ─── CONFIG ──────────────────────────────────────────────────────────────────
MODEL_NAME = "distilbert-base-uncased"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "../../ml/models/emotion_model")
os.makedirs(OUTPUT_DIR, exist_ok=True)

NUM_EPOCHS = 4
BATCH_SIZE = 16
LR         = 2e-5
MAX_LEN    = 128

# dair-ai/emotion label mapping → our 5-class system
# Original: 0=sadness, 1=joy, 2=love, 3=anger, 4=fear, 5=surprise
LABEL_REMAP = {0: 1, 1: 0, 2: 0, 3: 2, 4: 3, 5: 4}
ID2LABEL = {0: "joy", 1: "sadness", 2: "anger", 3: "fear", 4: "neutral"}
NUM_CLASSES = 5

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

# ─── TOKENIZER (import directly, no Trainer) ─────────────────────────────────
from transformers import AutoTokenizer, AutoModelForSequenceClassification

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

# ─── DATASET WRAPPER ─────────────────────────────────────────────────────────
class EmotionDataset(TorchDataset):
    def __init__(self, hf_split):
        self.texts  = hf_split["text"]
        self.labels = [LABEL_REMAP[l] for l in hf_split["label"]]

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
print("\n📦 Loading dair-ai/emotion dataset...")
raw = load_dataset("dair-ai/emotion")
print(f"   Train: {len(raw['train'])} | Val: {len(raw['validation'])} | Test: {len(raw['test'])}")

train_loader = DataLoader(EmotionDataset(raw["train"]),      batch_size=BATCH_SIZE, shuffle=True)
val_loader   = DataLoader(EmotionDataset(raw["validation"]), batch_size=BATCH_SIZE)
test_loader  = DataLoader(EmotionDataset(raw["test"]),       batch_size=BATCH_SIZE)

# ─── MODEL ───────────────────────────────────────────────────────────────────
print(f"\n🤖 Loading {MODEL_NAME}...")
model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=NUM_CLASSES,
    id2label=ID2LABEL,
    label2id={v: k for k, v in ID2LABEL.items()},
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
            ids   = batch["input_ids"].to(device)
            mask  = batch["attention_mask"].to(device)
            labels = batch["label"]
            logits = model(input_ids=ids, attention_mask=mask).logits
            preds  = logits.argmax(dim=-1).cpu().numpy()
            all_preds.extend(preds)
            all_labels.extend(labels.numpy())
    acc = accuracy_score(all_labels, all_preds)
    f1  = f1_score(all_labels, all_preds, average="weighted")
    return acc, f1

print(f"\n🚀 Training for {NUM_EPOCHS} epochs (device: {device})...")
best_val_f1 = 0.0
best_model_path = os.path.join(OUTPUT_DIR, "best_model.pt")

for epoch in range(1, NUM_EPOCHS + 1):
    model.train()
    total_loss = 0.0
    for batch in tqdm(train_loader, desc=f"Epoch {epoch}/{NUM_EPOCHS}"):
        ids   = batch["input_ids"].to(device)
        mask  = batch["attention_mask"].to(device)
        labels = batch["label"].to(device)

        optimizer.zero_grad()
        logits = model(input_ids=ids, attention_mask=mask).logits
        loss   = criterion(logits, labels)
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
# Reload best model
model = AutoModelForSequenceClassification.from_pretrained(OUTPUT_DIR).to(device)
test_acc, test_f1 = evaluate(test_loader)

print(f"\n{'='*50}")
print(f"✅ EMOTION MODEL — FINAL TEST RESULTS")
print(f"   Accuracy  : {test_acc:.4f}")
print(f"   F1 Score  : {test_f1:.4f}")
print(f"{'='*50}")

# Per-class report
all_preds, all_labels = [], []
model.eval()
with torch.no_grad():
    for batch in test_loader:
        ids   = batch["input_ids"].to(device)
        mask  = batch["attention_mask"].to(device)
        logits = model(input_ids=ids, attention_mask=mask).logits
        all_preds.extend(logits.argmax(dim=-1).cpu().numpy())
        all_labels.extend(batch["label"].numpy())

print(classification_report(
    all_labels, all_preds,
    target_names=[ID2LABEL[i] for i in range(NUM_CLASSES)]
))

# ─── QUICK INFERENCE DEMO ────────────────────────────────────────────────────
print("\n🧪 Sample Predictions:")
test_phrases = [
    "I feel amazing and so grateful today!",
    "I am so sad and hopeless, nothing feels worth it",
    "This makes me incredibly angry",
    "I'm terrified something bad will happen",
    "Today was an ordinary, average kind of day",
]
model.eval()
for phrase in test_phrases:
    enc = tokenizer(phrase, return_tensors="pt", truncation=True, max_length=MAX_LEN)
    enc = {k: v.to(device) for k, v in enc.items()}
    with torch.no_grad():
        logits = model(**enc).logits
        probs = torch.softmax(logits, dim=-1)
        pred  = probs.argmax(dim=-1).item()
        conf  = probs[0][pred].item()
    print(f"  [{ID2LABEL[pred]:8}] ({conf:.2f}) — \"{phrase[:54]}\"")
