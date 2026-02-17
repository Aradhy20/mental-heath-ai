"""
AI Models Utility Functions
Helper functions for model management and inference
"""

import os
import json
from typing import Dict, Any, Optional

def get_model_info() -> Dict[str, Any]:
    """Get information about all installed models"""
    info = {
        'text': {
            'status': 'unknown',
            'model_name': 'j-hartmann/emotion-english-distilroberta-base',
            'type': 'transformer'
        },
        'voice': {
            'status': 'unknown',
            'model_path': 'ai_models/voice/model/voice_model.pkl',
            'type': 'sklearn_mlp'
        },
        'face': {
            'status': 'unknown',
            'model_path': 'ai_models/face/model/face_model.h5',
            'type': 'keras_cnn'
        }
    }
    
    # Check text model
    try:
        from ai_models.text.inference.text_analyzer import TextAnalyzer
        analyzer = TextAnalyzer()
        info['text']['status'] = 'mock' if analyzer.is_mock else 'operational'
    except Exception as e:
        info['text']['status'] = f'error: {str(e)}'
    
    # Check voice model
    try:
        from ai_models.voice.inference.voice_analyzer import VoiceAnalyzer
        _ = VoiceAnalyzer()
        info['voice']['status'] = 'operational'
    except Exception as e:
        info['voice']['status'] = f'error: {str(e)}'
    
    # Check face model
    try:
        from ai_models.face.inference.face_analyzer import FaceAnalyzer
        _ = FaceAnalyzer()
        info['face']['status'] = 'operational'
    except Exception as e:
        info['face']['status'] = f'error: {str(e)}'
    
    return info

def print_model_status():
    """Print status of all models"""
    print("AI Models Status Report")
    print("=" * 60)
    
    info = get_model_info()
    
    for model_name, model_info in info.items():
        print(f"\n{model_name.upper()} Model:")
        for key, value in model_info.items():
            print(f"  {key}: {value}")
    
    print("\n" + "=" * 60)

def save_fusion_config(weights: Dict[str, float], filepath: str = "ai_models/fusion/weights.json"):
    """Save fusion weights configuration"""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        json.dump(weights, f, indent=2)
    print(f"Fusion config saved to {filepath}")

def load_fusion_config(filepath: str = "ai_models/fusion/weights.json") -> Optional[Dict[str, float]]:
    """Load fusion weights configuration"""
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return json.load(f)
    return None

def check_dependencies():
    """Check if all required dependencies are installed"""
    print("Checking Dependencies...")
    print("=" * 60)
    
    dependencies = {
        'torch': 'PyTorch',
        'transformers': 'Hugging Face Transformers',
        'librosa': 'Librosa (Voice)',
        'cv2': 'OpenCV (Face)',
        'tensorflow': 'TensorFlow (Face Training)',
        'sklearn': 'Scikit-learn (Voice)',
        'datasets': 'Hugging Face Datasets'
    }
    
    results = {}
    for module, name in dependencies.items():
        try:
            __import__(module)
            results[name] = 'Installed'
        except ImportError:
            results[name] = 'NOT INSTALLED'
    
    for name, status in results.items():
        symbol = '[OK]' if status == 'Installed' else '[MISSING]'
        print(f"{symbol} {name}: {status}")
    
    print("=" * 60)
    return results

if __name__ == "__main__":
    print("\nModel Status:")
    print_model_status()
    
    print("\n\nDependency Check:")
    check_dependencies()
