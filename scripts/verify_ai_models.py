import sys
import os
import numpy as np

# Add project root to path
sys.path.append(os.getcwd())

def test_text_model():
    print("\n=== Testing Text Model ===")
    try:
        from ai_models.text.inference.text_analyzer import TextAnalyzer
        analyzer = TextAnalyzer()
        
        test_text = "I am feeling very happy and excited about this project!"
        print(f"Input: {test_text}")
        
        emotion, score, conf = analyzer.analyze_emotion(test_text)
        print(f"Output: Emotion={emotion}, Score={score:.4f}, Confidence={conf:.4f}")
        
        if analyzer.is_mock:
            print("Status: MOCK implementation used (Transformers not found or model load failed)")
        else:
            print("Status: REAL Transformers model used")
            
        return True
    except Exception as e:
        print(f"FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_voice_model():
    print("\n=== Testing Voice Model ===")
    try:
        from ai_models.voice.inference.voice_analyzer import VoiceAnalyzer
        analyzer = VoiceAnalyzer()
        
        # Create dummy audio data (1 second of silence)
        dummy_audio = bytes(32000) 
        print(f"Input: {len(dummy_audio)} bytes of audio data")
        
        stress, score, conf = analyzer.analyze_stress(dummy_audio)
        print(f"Output: Stress={stress}, Score={score:.4f}, Confidence={conf:.4f}")
        
        return True
    except Exception as e:
        print(f"FAILED: {e}")
        traceback.print_exc()
        return False

def test_face_model():
    print("\n=== Testing Face Model ===")
    try:
        from ai_models.face.inference.face_analyzer import FaceAnalyzer
        analyzer = FaceAnalyzer()
        
        # Create dummy image data
        dummy_image = bytes(1000)
        print(f"Input: {len(dummy_image)} bytes of image data")
        
        emotion, score, conf = analyzer.analyze_emotion(dummy_image)
        print(f"Output: Emotion={emotion}, Score={score:.4f}, Confidence={conf:.4f}")
        
        return True
    except Exception as e:
        print(f"FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_fusion_engine():
    print("\n=== Testing Fusion Engine ===")
    try:
        from ai_models.fusion.fusion_engine import FusionEngine
        engine = FusionEngine()
        
        text_res = {'emotion': 'joy', 'score': 0.9, 'confidence': 0.8}
        voice_res = {'stress': 'calm', 'score': 0.1, 'confidence': 0.7}
        face_res = {'emotion': 'happy', 'score': 0.8, 'confidence': 0.9}
        
        print("Inputs:")
        print(f"  Text: {text_res}")
        print(f"  Voice: {voice_res}")
        print(f"  Face: {face_res}")
        
        result = engine.fuse_results(text_res, voice_res, face_res)
        print("Output:")
        print(f"  Overall Score: {result['overall_score']:.4f}")
        print(f"  Risk Level: {result['risk_level']}")
        print(f"  Analysis: {result['analysis']}")
        
        return True
    except Exception as e:
        print(f"FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Starting AI Models Verification...")
    
    results = [
        test_text_model(),
        test_voice_model(),
        test_face_model(),
        test_fusion_engine()
    ]
    
    if all(results):
        print("\n✅ All AI models verified successfully!")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed.")
        sys.exit(1)
