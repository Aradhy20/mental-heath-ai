import sys
import os
import time

# Add project root to path
sys.path.append(os.getcwd())

print("Starting Lite Verification...")

def test_fusion():
    print("Testing Fusion (No heavy imports)...")
    try:
        from ai_models.fusion.fusion_engine import FusionEngine
        engine = FusionEngine()
        print("Fusion Engine initialized.")
        return True
    except Exception as e:
        print(f"Fusion Failed: {e}")
        return False

def test_voice():
    print("Testing Voice (Lightweight mock)...")
    try:
        from ai_models.voice.inference.voice_analyzer import VoiceAnalyzer
        analyzer = VoiceAnalyzer()
        print("Voice Analyzer initialized.")
        return True
    except Exception as e:
        print(f"Voice Failed: {e}")
        return False

def test_text():
    print("Testing Text (May hang on transformers import)...")
    try:
        # Set timeout or just try import
        print("Importing TextAnalyzer...")
        from ai_models.text.inference.text_analyzer import TextAnalyzer
        print("Initializing TextAnalyzer...")
        analyzer = TextAnalyzer()
        print(f"Text Analyzer initialized. Mock: {analyzer.is_mock}")
        return True
    except Exception as e:
        print(f"Text Failed: {e}")
        return False

def test_face():
    print("Testing Face (May hang on tensorflow import)...")
    try:
        print("Importing FaceAnalyzer...")
        from ai_models.face.inference.face_analyzer import FaceAnalyzer
        print("Initializing FaceAnalyzer...")
        analyzer = FaceAnalyzer()
        print("Face Analyzer initialized.")
        return True
    except Exception as e:
        print(f"Face Failed: {e}")
        return False

if __name__ == "__main__":
    test_fusion()
    test_voice()
    # test_text() # Commented out to avoid hang if that was the cause
    # test_face() # Commented out to avoid hang if that was the cause
    
    # Try importing text but catch it if it hangs (hard to do in script, but let's try just printing)
    print("\nAttempting heavier imports...")
    test_text()
    test_face()
    
    print("\nVerification Complete.")
