import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import load_dataset
import numpy as np
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average='weighted')
    acc = accuracy_score(labels, preds)
    return {
        'accuracy': acc,
        'f1': f1,
        'precision': precision,
        'recall': recall
    }

def train_text_model(dataset_path=None, output_dir="../model", epochs=3):
    """
    Train/Fine-tune the text emotion model
    """
    print("Initializing Text Model Training...")
    
    model_name = "j-hartmann/emotion-english-distilroberta-base"
    
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=7)
    
    # Load dataset
    if dataset_path and os.path.exists(dataset_path):
        # Load local dataset (CSV/JSON)
        dataset = load_dataset('csv', data_files=dataset_path)
        # Assuming dataset has 'text' and 'label' columns
    else:
        print("No local dataset provided. Using 'emotion' dataset from Hugging Face for demonstration.")
        dataset = load_dataset("emotion")
    
    def tokenize_function(examples):
        return tokenizer(examples["text"], padding="max_length", truncation=True)
    
    tokenized_datasets = dataset.map(tokenize_function, batched=True)
    
    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=epochs,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
        logging_steps=10,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
    )
    
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_datasets["train"],
        eval_dataset=tokenized_datasets["validation"] if "validation" in tokenized_datasets else tokenized_datasets["test"],
        compute_metrics=compute_metrics,
    )
    
    print("Starting training...")
    trainer.train()
    
    print(f"Saving model to {output_dir}...")
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
    print("Training complete.")

if __name__ == "__main__":
    # Example usage
    train_text_model()
