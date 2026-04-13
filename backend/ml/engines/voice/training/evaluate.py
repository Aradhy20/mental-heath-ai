import os
import joblib
import numpy as np
import sys

# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.append(parent_dir)

try:
    import librosa
except ImportError:
    print("Librosa not found.")

def evaluate_voice_model(model_path="../model/voice_model.pkl", test_file=None):
    """
    Evaluate voice model on a single file or test set
    """
    if not os.path.exists(model_path):
        print(f"Model not found at {model_path}")
        return

    print(f"Loading model from {model_path}...")
    model = joblib.load(model_path)
    
    if test_file and os.path.exists(test_file):
        # Extract features
        try:
            audio, sample_rate = librosa.load(test_file, res_type='kaiser_fast')
            mfccs = np.mean(librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40).T, axis=0)
            mfccs = mfccs.reshape(1, -1)
            
            # Predict
            prediction = model.predict(mfccs)
            probs = model.predict_proba(mfccs)
            
            print(f"File: {test_file}")
            print(f"Predicted Class: {prediction[0]}")
            print(f"Confidence: {max(probs[0]):.4f}")
            
        except Exception as e:
            print(f"Error processing file: {e}")
    else:
        print("No test file provided. Please provide a .wav file path.")

if __name__ == "__main__":
    # Example usage: python evaluate.py --file path/to/audio.wav
    if len(sys.argv) > 1:
        evaluate_voice_model(test_file=sys.argv[1])
    else:
        evaluate_voice_model()
