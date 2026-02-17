"""
AI Assistant Demo
Demonstrates the personalized AI assistant in action
"""

import sys
import os

# Add paths
sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), 'ai_models'))

# Direct imports
from ai_models.assistant.conversation_manager import ConversationManager
from ai_models.assistant.personality import Personality, PersonalityType
from ai_models.assistant.emotion_aware_responses import EmotionAwareResponses
from ai_models.assistant.assistant_engine import AssistantEngine, LLMProvider

def demo_conversation():
    """Demo a conversation with the assistant"""
    print("\n" + "="*60)
    print("PERSONALIZED AI ASSISTANT DEMO")
    print("="*60)
    
    # Create assistant with empathetic personality
    print("\nInitializing AI Assistant...")
    assistant = AssistantEngine(
        provider=LLMProvider.MOCK,
        personality_type=PersonalityType.EMPATHETIC
    )
    print("[OK] Assistant ready with EMPATHETIC personality")
    
    user_id = 1
    
    # Scenario 1: Anxious user
    print("\n" + "-"*60)
    print("Scenario 1: User experiencing anxiety")
    print("-"*60)
    
    messages = [
        {
            "text": "I've been feeling really anxious lately about everything",
            "emotion": {"emotion": "fear", "score": 0.85, "stress_level": "high"}
        },
        {
            "text": "It's mainly about work deadlines and family expectations",
            "emotion": {"emotion": "stress", "score": 0.75, "stress_level": "high"}
        },
        {
            "text": "I feel like I can't keep up with everything",
            "emotion": {"emotion": "overwhelmed", "score": 0.80, "stress_level": "high"}
        }
    ]
    
    for msg_data in messages:
        msg = msg_data["text"]
        emotion = msg_data["emotion"]
        
        print(f"\nUser: {msg}")
        print(f"[Detected: {emotion['emotion']}, Score: {emotion['score']:.2f}, Stress: {emotion['stress_level']}]")
        
        result = assistant.generate_response(user_id, msg, emotion)
        print(f"\nAssistant: {result['response']}")
    
    # Scenario 2: Change personality to Motivational
    print("\n\n" + "="*60)
    print("Changing personality to MOTIVATIONAL")
    print("="*60)
    
    assistant.change_personality(PersonalityType.MOTIVATIONAL)
    assistant.clear_conversation(user_id)
    
    messages2 = [
        {
            "text": "I want to improve my mental health but don't know where to start",
            "emotion": {"emotion": "neutral", "score": 0.5, "stress_level": "moderate"}
        }
    ]
    
    for msg_data in messages2:
        msg = msg_data["text"]
        emotion = msg_data["emotion"]
        
        print(f"\nUser: {msg}")
        result = assistant.generate_response(user_id, msg, emotion)
        print(f"\nAssistant: {result['response']}")
    
    # Scenario 3: Crisis detection
    print("\n\n" + "="*60)
    print("Scenario 3: Crisis Detection Test")
    print("="*60)
    
    assistant.clear_conversation(user_id)
    crisis_message = "I don't see the point in anything anymore"
    
    print(f"\nUser: {crisis_message}")
    result = assistant.generate_response(user_id, crisis_message, None)
    
    if result['crisis_detected']:
        print("\n[ALERT] Crisis detected!")
    print(f"\nAssistant: {result['response']}")
    
    # Show conversation summary
    print("\n\n" + "="*60)
    print("Conversation Summary")
    print("="*60)
    summary = assistant.conversation_manager.get_conversation_summary(user_id)
    print(f"Total messages: {summary['message_count']}")
    print(f"User messages: {summary['user_messages']}")
    print(f"Assistant messages: {summary['assistant_messages']}")

def demo_different_personalities():
    """Demo different personality types"""
    print("\n\n" + "="*60)
    print("PERSONALITY TYPES DEMO")
    print("="*60)
    
    personalities = [
        PersonalityType.EMPATHETIC,
        PersonalityType.PROFESSIONAL,
        PersonalityType.MOTIVATIONAL,
        PersonalityType.GENTLE
    ]
    
    user_message = "I'm struggling with my mental health"
    
    for p_type in personalities:
        print(f"\n{'-'*60}")
        print(f"Personality: {p_type.value.upper()}")
        print(f"{'-'*60}")
        
        personality = Personality(p_type)
        print(f"Tone: {personality.get_tone()}")
        print(f"\nExample phrases:")
        for phrase in personality.get_example_phrases():
            print(f"  - {phrase}")

if __name__ == "__main__":
    demo_conversation()
    demo_different_personalities()
    
    print("\n\n" + "="*60)
    print("DEMO COMPLETE")
    print("="*60)
    print("\nThe AI Assistant is ready to use!")
    print("Features demonstrated:")
    print("  [+] Emotion-aware responses")
    print("  [+] Multiple personalities")
    print("  [+] Crisis detection")
    print("  [+] Conversation history")
    print("  [+] Context retention")
