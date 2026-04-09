"""
Text Emotion Model - Fine-Tuning Script
Fine-tunes j-hartmann/emotion-english-distilroberta-base on the
Hugging Face 'dair-ai/emotion' dataset (or a local CSV).

For speed, uses a small subset (500 train / 100 eval samples) and 1 epoch
so the full training loop executes and the model is saved as a real artifact.
To use the full dataset, set SUBSET_SIZE = None.
"""

import os
import sys
import torch
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments,
)
from datasets import load_dataset
import numpy as np
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

# Number of samples to use for the training/eval. Set to None for full dataset.
SUBSET_SIZE = 500
EVAL_SUBSET = 100


def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    precision, recall, f1, _ = precision_recall_fscore_support(
        labels, preds, average='weighted', zero_division=0
    )
    acc = accuracy_score(labels, preds)
    return {
        'accuracy': acc,
        'f1': f1,
        'precision': precision,
        'recall': recall,
    }


def train_text_model(dataset_path=None, output_dir=None, epochs=1):
    """
    Fine-tune / train the text emotion classification model.
    Saves the full model + tokenizer to output_dir.
    """
    print("Initializing Text Model Training...")

    # Resolve output path relative to this file
    if output_dir is None:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        output_dir = os.path.normpath(os.path.join(script_dir, '..', 'model'))

    os.makedirs(output_dir, exist_ok=True)

    model_name = "j-hartmann/emotion-english-distilroberta-base"

    print(f"Loading tokenizer and model from '{model_name}' ...")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=7)

    # ---- Load dataset ---------------------------------------------------
    if dataset_path and os.path.exists(dataset_path):
        print(f"Loading local dataset from {dataset_path} ...")
        dataset = load_dataset('csv', data_files=dataset_path)
    else:
        print("No local dataset found. Downloading 'dair-ai/emotion' from Hugging Face ...")
        dataset = load_dataset("dair-ai/emotion", trust_remote_code=True)

    # ---- Optional subsetting for speed ----------------------------------
    if SUBSET_SIZE is not None:
        print(f"Using a subset: {SUBSET_SIZE} train / {EVAL_SUBSET} eval samples.")
        train_ds = dataset["train"].shuffle(seed=42).select(range(min(SUBSET_SIZE, len(dataset["train"]))))
        val_key = "validation" if "validation" in dataset else "test"
        eval_ds = dataset[val_key].shuffle(seed=42).select(range(min(EVAL_SUBSET, len(dataset[val_key]))))
    else:
        train_ds = dataset["train"]
        val_key = "validation" if "validation" in dataset else "test"
        eval_ds = dataset[val_key]

    # ---- Tokenization ---------------------------------------------------
    def tokenize_function(examples):
        return tokenizer(examples["text"], padding="max_length", truncation=True, max_length=128)

    print("Tokenizing datasets ...")
    train_ds = train_ds.map(tokenize_function, batched=True)
    eval_ds = eval_ds.map(tokenize_function, batched=True)

    # Rename 'label' → correct column expected by Trainer
    if "label" in train_ds.column_names:
        train_ds = train_ds.rename_column("label", "labels")
        eval_ds = eval_ds.rename_column("label", "labels")

    train_ds.set_format("torch", columns=["input_ids", "attention_mask", "labels"])
    eval_ds.set_format("torch", columns=["input_ids", "attention_mask", "labels"])

    # ---- Training arguments --------------------------------------------
    # Use CPU-safe settings (no_cuda=True when GPU unavailable)
    use_gpu = torch.cuda.is_available()
    logs_dir = os.path.join(output_dir, 'logs')
    os.makedirs(logs_dir, exist_ok=True)

    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=epochs,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        warmup_steps=10,
        weight_decay=0.01,
        logging_dir=logs_dir,
        logging_steps=10,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        no_cuda=not use_gpu,
        report_to="none",  # disable wandb/tensorboard external reporting
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_ds,
        eval_dataset=eval_ds,
        compute_metrics=compute_metrics,
    )

    print("Starting training ...")
    trainer.train()

    print(f"Saving fine-tuned model to {output_dir} ...")
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
    print("Text model training complete.")


if __name__ == "__main__":
    train_text_model()
