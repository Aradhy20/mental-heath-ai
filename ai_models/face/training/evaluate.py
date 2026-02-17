import os
import sys
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report, confusion_matrix

def evaluate_face_model(model_path="../model/face_model.h5", test_dir="dataset/test"):
    """
    Evaluate the face emotion model
    """
    if not os.path.exists(model_path):
        print(f"Model not found at {model_path}")
        return
        
    if not os.path.exists(test_dir):
        print(f"Test directory {test_dir} not found.")
        return

    print(f"Loading model from {model_path}...")
    model = load_model(model_path)
    
    # Data Generator
    test_datagen = ImageDataGenerator(rescale=1./255)
    
    test_generator = test_datagen.flow_from_directory(
        test_dir,
        target_size=(48, 48),
        color_mode='grayscale',
        batch_size=64,
        class_mode='categorical',
        shuffle=False
    )
    
    print("Evaluating model...")
    # Evaluate
    loss, accuracy = model.evaluate(test_generator)
    print(f"Test Loss: {loss:.4f}")
    print(f"Test Accuracy: {accuracy:.4f}")
    
    # Predictions
    print("Generating predictions...")
    predictions = model.predict(test_generator)
    y_pred = np.argmax(predictions, axis=1)
    y_true = test_generator.classes
    
    # Classification Report
    class_labels = list(test_generator.class_indices.keys())
    print("\nClassification Report:")
    print(classification_report(y_true, y_pred, target_names=class_labels))
    
    # Confusion Matrix
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_true, y_pred))

if __name__ == "__main__":
    evaluate_face_model()
