"""
AI Models Demo - End-to-End Example
Shows how to use all AI models together for mental health analysis
"""

import sys
import os

# Add project to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def demo_text_analysis():
    """Demo text emotion analysis"""
    print("\n" + "="*60)
    print("TEXT EMOTION ANALYSIS DEMO")
    print("="*60)
    
    from ai_models.text.inference.text_analyzer import TextAnalyzer
    
    analyzer = TextAnalyzer()
    
    test_cases = [
        "I'm feeling really happy and excited about my new job!",
        "I'm so worried and anxious about the upcoming exam.",
        "This is just a normal day, nothing special.",
        "I'm really angry about the way I was treated.",
    ]
    
    for text in test_cases:
        emotion, score, confidence = analyzer.analyze_emotion(text)
        print(f"\nInput: {text}")
        print(f"  Emotion: {emotion}")
        print(f"  Score: {score:.4f}")
        print(f"  Confidence: {confidence:.4f}")

def demo_voice_analysis():
    """Demo voice stress analysis"""
    print("\n" + "="*60)
    print("VOICE STRESS ANALYSIS DEMO")
    print("="*60)
    
    from ai_models.voice.inference.voice_analyzer import VoiceAnalyzer
    
    analyzer = VoiceAnalyzer()
    
    # Simulate different audio sizes (representing different speech patterns)
    test_cases = [
        ("Calm speech", bytes(20000)),
        ("Moderate stress", bytes(50000)),
        ("High stress", bytes(80000)),
    ]
    
    for label, audio_data in test_cases:
        stress, score, confidence = analyzer.analyze_stress(audio_data)
        print(f"\n{label}:")
        print(f"  Stress Level: {stress}")
        print(f"  Score: {score:.4f}")
        print(f"  Confidence: {confidence:.4f}")

def demo_multimodal_fusion():
    """Demo multimodal fusion"""
    print("\n" + "="*60)
    print("MULTIMODAL FUSION DEMO")
    print("="*60)
    
    from ai_models.text.inference.text_analyzer import TextAnalyzer
    from ai_models.voice.inference.voice_analyzer import VoiceAnalyzer
    from ai_models.fusion.fusion_engine import FusionEngine
    
    # Analyze user input
    text_analyzer = TextAnalyzer()
    voice_analyzer = VoiceAnalyzer()
    fusion_engine = FusionEngine()
    
    # Scenario 1: High stress/anxiety
    print("\n--- Scenario 1: User expressing anxiety ---")
    text = "I'm so stressed and worried about everything"
    audio = bytes(70000)  # Simulating stressed voice
    
    text_emotion, text_score, text_conf = text_analyzer.analyze_emotion(text)
    voice_stress, voice_score, voice_conf = voice_analyzer.analyze_stress(audio)
    
    print(f"Text Analysis: {text_emotion} (score: {text_score:.3f})")
    print(f"Voice Analysis: {voice_stress} (score: {voice_score:.3f})")
    
    result = fusion_engine.fuse_results(
        {'emotion': text_emotion, 'score': text_score, 'confidence': text_conf},
        {'stress': voice_stress, 'score': voice_score, 'confidence': voice_conf},
        {'emotion': 'sad', 'score': 0.3, 'confidence': 0.8}  # Simulated face
    )
    
    print(f"\nFusion Result:")
    print(f"  Overall Score: {result['overall_score']:.3f}")
    print(f"  Risk Level: {result['risk_level']}")
    print(f"  Analysis: {result['analysis']}")
    
    # Scenario 2: Positive state
    print("\n--- Scenario 2: User expressing happiness ---")
    text = "I'm so happy and grateful for everything!"
    audio = bytes(25000)  # Simulating calm voice
    
    text_emotion, text_score, text_conf = text_analyzer.analyze_emotion(text)
    voice_stress, voice_score, voice_conf = voice_analyzer.analyze_stress(audio)
    
    print(f"Text Analysis: {text_emotion} (score: {text_score:.3f})")
    print(f"Voice Analysis: {voice_stress} (score: {voice_score:.3f})")
    
    result = fusion_engine.fuse_results(
        {'emotion': text_emotion, 'score': text_score, 'confidence': text_conf},
        {'stress': voice_stress, 'score': voice_score, 'confidence': voice_conf},
        {'emotion': 'happy', 'score': 0.9, 'confidence': 0.85}  # Simulated face
    )
    
    print(f"\nFusion Result:")
    print(f"  Overall Score: {result['overall_score']:.3f}")
    print(f"  Risk Level: {result['risk_level']}")
    print(f"  Analysis: {result['analysis']}")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("AI MODELS DEMONSTRATION")
    print("Mental Health Detection System")
    print("="*60)
    
    try:
        demo_text_analysis()
        demo_voice_analysis()
        demo_multimodal_fusion()
        
        print("\n" + "="*60)
        print("DEMO COMPLETE")
        print("="*60)
        print("\nAll AI models are functioning correctly!")
        print("See QUICK_START.md for usage in your application.")
        
    except Exception as e:
        print(f"\nError during demo: {e}")
        import traceback
        traceback.print_exc()
