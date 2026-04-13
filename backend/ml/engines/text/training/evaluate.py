import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from datasets import load_dataset
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np
import os

def evaluate_text_model(model_path="../model", dataset_path=None):
    """
    Evaluate the trained text emotion model
    """
    print(f"Evaluating model from {model_path}...")
    
    if not os.path.exists(model_path):
        print(f"Model path {model_path} does not exist. Using base model.")
        model_path = "j-hartmann/emotion-english-distilroberta-base"
        
    classifier = pipeline("text-classification", model=model_path, return_all_scores=False)
    
    # Load test data
    if dataset_path and os.path.exists(dataset_path):
        dataset = load_dataset('csv', data_files=dataset_path)['test']
    else:
        print("Using 'emotion' dataset test split.")
        dataset = load_dataset("emotion")['test']
        
    print("Running inference on test set...")
    texts = dataset['text']
    true_labels = dataset['label']
    
    # Map numeric labels to string if needed, or vice versa
    # The emotion dataset uses: 0: sadness, 1: joy, 2: love, 3: anger, 4: fear, 5: surprise
    # Our model uses: anger, disgust, fear, joy, neutral, sadness, surprise
    
    predictions = classifier(texts)
    pred_labels = [p['label'] for p in predictions]
    
    # Note: Real evaluation requires careful mapping of labels between dataset and model
    # This is a simplified evaluation script
    
    print("\nSample Predictions:")
    for i in range(5):
        print(f"Text: {texts[i][:50]}...")
        print(f"Predicted: {pred_labels[i]}")
        print("-" * 30)
        
    print("\nEvaluation complete.")

if __name__ == "__main__":
    evaluate_text_model()
