import os
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import classification_report
import sys

# Add parent directory to path to import analyzer for feature extraction
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.append(parent_dir)

try:
    import librosa
    from voice.inference.voice_analyzer import VoiceAnalyzer
except ImportError:
    print("Librosa or VoiceAnalyzer not found. Training script requires dependencies.")
    sys.exit(1)

def extract_features_from_file(file_path):
    """
    Extract features from audio file using Librosa
    """
    try:
        audio, sample_rate = librosa.load(file_path, res_type='kaiser_fast')
        mfccs = np.mean(librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40).T, axis=0)
        return mfccs
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def train_voice_model(data_dir="dataset", output_dir="../model"):
    """
    Train voice stress detection model
    """
    print("Initializing Voice Model Training...")
    
    if not os.path.exists(data_dir):
        print(f"Dataset directory {data_dir} not found. Please populate with audio files organized by class.")
        # Create dummy data for demonstration
        print("Generating dummy data for demonstration...")
        X = np.random.rand(100, 40) # 40 MFCCs
        y = np.random.choice(['calm', 'stress', 'anxiety'], 100)
    else:
        # Load real data
        X = []
        y = []
        for label in os.listdir(data_dir):
            class_dir = os.path.join(data_dir, label)
            if os.path.isdir(class_dir):
                for file in os.listdir(class_dir):
                    if file.endswith('.wav'):
                        feat = extract_features_from_file(os.path.join(class_dir, file))
                        if feat is not None:
                            X.append(feat)
                            y.append(label)
        X = np.array(X)
        y = np.array(y)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train MLP Classifier
    print("Training MLP Classifier...")
    model = MLPClassifier(hidden_layer_sizes=(256, 128), max_iter=500, alpha=0.0001,
                         solver='adam', verbose=10,  random_state=21,tol=0.000000001)
    model.fit(X_train, y_train)
    
    # Evaluate
    print("\nEvaluating model...")
    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred))
    
    # Save model
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    model_path = os.path.join(output_dir, "voice_model.pkl")
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_voice_model()
