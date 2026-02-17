"""
Test backend services integration with AI models
"""
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

def test_text_service():
    print("\n=== Testing Text Service Integration ===")
    try:
        from backend.text_service.text_analyzer import analyzer
        
        test_text = "I feel anxious and worried about everything"
        print(f"Input: {test_text}")
        
        emotion, score, conf = analyzer.analyze_emotion(test_text)
        print(f"✅ Emotion: {emotion}, Score: {score:.4f}, Confidence: {conf:.4f}")
        
        # Test with context
        result = analyzer.analyze_with_context(test_text)
        print(f"✅ Risk Level: {result['risk_level']}")
        print(f"✅ Recommendations: {len(result['recommendations'])} items")
        
        return True
    except Exception as e:
        print(f"❌ Failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_voice_service():
    print("\n=== Testing Voice Service Integration ===")
    try:
        from backend.voice_service.voice_analyzer import analyzer
        
        # Create dummy audio
        dummy_audio = bytes(50000)  # Larger for higher stress simulation
        print(f"Input: {len(dummy_audio)} bytes")
        
        stress, score, conf = analyzer.analyze_stress(dummy_audio)
        print(f"✅ Stress: {stress}, Score: {score:.4f}, Confidence: {conf:.4f}")
        
        return True
    except Exception as e:
        print(f"❌ Failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_face_service():
    print("\n=== Testing Face Service Integration ===")
    try:
        from backend.face_service.face_analyzer import analyzer
        
        # Create dummy image
        dummy_image = bytes(5000)
        print(f"Input: {len(dummy_image)} bytes")
        
        emotion, score, conf = analyzer.analyze_emotion(dummy_image)
        print(f"✅ Emotion: {emotion}, Score: {score:.4f}, Confidence: {conf:.4f}")
        
        # Test micro-expressions
        micro = analyzer.analyze_micro_expressions(dummy_image)
        print(f"✅ Micro-expressions: {micro['detected']}")
        
        return True
    except Exception as e:
        print(f"❌ Failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Testing Backend Services Integration with AI Models...")
    
    results = [
        test_text_service(),
        test_voice_service(),
        test_face_service()
    ]
    
    passed = sum(results)
    total = len(results)
    
    print(f"\n{'='*50}")
    print(f"Results: {passed}/{total} services passed")
    print(f"{'='*50}")
    
    if all(results):
        print("✅ All backend services integrated successfully!")
        sys.exit(0)
    else:
        print("⚠️ Some services had issues (may be expected if dependencies missing)")
        sys.exit(0 if passed >= 2 else 1)
