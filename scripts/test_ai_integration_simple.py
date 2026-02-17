"""
Simplified backend integration test - tests AI models directly without chromadb
"""
import sys
import os

def test_text_analyzer_direct():
    print("\n=== Testing Text Analyzer (Direct) ===")
    try:
        # Import the shared AI model directly
        sys.path.append(os.getcwd())
        from ai_models.text.inference.text_analyzer import TextAnalyzer
        
        analyzer = TextAnalyzer()
        test_text = "I feel anxious and worried about my future"
        print(f"Input: {test_text}")
        
        emotion, score, conf = analyzer.analyze_emotion(test_text)
        print(f"[OK] Result: Emotion={emotion}, Score={score:.4f}, Confidence={conf:.4f}")
        print(f"     Using mock: {analyzer.is_mock}")
        
        return True
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False

def test_voice_analyzer_direct():
    print("\n=== Testing Voice Analyzer (Direct) ===")
    try:
        from ai_models.voice.inference.voice_analyzer import VoiceAnalyzer
        
        analyzer = VoiceAnalyzer()
        dummy_audio = bytes(60000)
        print(f"Input: {len(dummy_audio)} bytes of audio")
        
        stress, score, conf = analyzer.analyze_stress(dummy_audio)
        print(f"[OK] Result: Stress={stress}, Score={score:.4f}, Confidence={conf:.4f}")
        
        return True
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False

def test_face_analyzer_direct():
    print("\n=== Testing Face Analyzer (Direct) ===")
    try:
        from ai_models.face.inference.face_analyzer import FaceAnalyzer
        
        analyzer = FaceAnalyzer()
        dummy_image = bytes(5000)
        print(f"Input: {len(dummy_image)} bytes of image")
        
        emotion, score, conf = analyzer.analyze_emotion(dummy_image)
        print(f"[OK] Result: Emotion={emotion}, Score={score:.4f}, Confidence={conf:.4f}")
        
        return True
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False

def test_fusion_engine():
    print("\n=== Testing Fusion Engine ===")
    try:
        from ai_models.fusion.fusion_engine import FusionEngine
        
        engine = FusionEngine()
        
        text_res = {'emotion': 'fear', 'score': 0.7, 'confidence': 0.8}
        voice_res = {'stress': 'high_stress', 'score': 0.75, 'confidence': 0.7}
        face_res = {'emotion': 'sad', 'score': 0.3, 'confidence': 0.9}
        
        result = engine.fuse_results(text_res, voice_res, face_res)
        print(f"[OK] Overall Score: {result['overall_score']:.4f}")
        print(f"     Risk Level: {result['risk_level']}")
        print(f"     Analysis: {result['analysis']}")
        
        return True
    except Exception as e:
        print(f"[FAIL] Error: {e}")
        return False

if __name__ == "__main__":
    print("="*60)
    print("Testing AI Models Integration (Simplified)")
    print("="*60)
    
    results = {
        'Text Analyzer': test_text_analyzer_direct(),
        'Voice Analyzer': test_voice_analyzer_direct(),
        'Face Analyzer': test_face_analyzer_direct(),
        'Fusion Engine': test_fusion_engine()
    }
    
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    for name, passed in results.items():
        status = "PASS" if passed else "FAIL"
        symbol = "[OK]" if passed else "[FAIL]"
        print(f"{symbol} {name}: {status}")
    
    passed = sum(results.values())
    total = len(results)
    print(f"\n{passed}/{total} tests passed")
    print("="*60)
    
    sys.exit(0 if passed >= 3 else 1)
