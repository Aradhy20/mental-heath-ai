"""
Mental Health Chatbot Demo
Interactive demonstration of chatbot capabilities
"""

import sys
import os

# Add path
sys.path.append(os.getcwd())

# Fix Windows console encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout.reconfigure(encoding='utf-8')

from ai_models.chatbot.chatbot_engine import MentalHealthChatbot

def demo_conversation():
    """Demo a full chatbot conversation"""
    print("\n" + "="*60)
    print("MENTAL HEALTH CHATBOT DEMO")
    print("="*60)
    
    chatbot = MentalHealthChatbot()
    
    # Scenario 1: Morning check-in
    print("\n" + "-"*60)
    print("Scenario 1: Morning Check-In")
    print("-"*60)
    
    print(f"\nBot: {chatbot.get_greeting()}")
    
    # User shares mood
    user_input = "I'm feeling anxious and overwhelmed with work"
    print(f"\nUser: {user_input}")
    
    mood_result = chatbot.process_mood(user_input)
    print(f"\nBot: {mood_result['message']}")
    print(f"     (Detected mood: {mood_result['mood_level']})")
    print(f"\nBot: {mood_result['follow_up']}")
    
    # Offer coping strategies
    print(f"\n\nBot: Let me share some coping strategies...")
    print(chatbot.get_coping_strategies('anxiety'))
    
    # Scenario 2: Journaling
    print("\n\n" + "-"*60)
    print("Scenario 2: Journaling Session")
    print("-"*60)
    
    print(f"\nBot: {chatbot.get_journaling_prompt()}")
    
    # Scenario 3: Positive mood
    print("\n\n" + "-"*60)
    print("Scenario 3: Positive Mood")
    print("-"*60)
    
    positive_input = "I'm feeling great today! Got a promotion at work."
    print(f"\nUser: {positive_input}")
    
    mood_result = chatbot.process_mood(positive_input)
    print(f"\nBot: {mood_result['message']}")
    
    # Scenario 4: Daily check-in questions
    print("\n\n" + "-"*60)
    print("Scenario 4: Daily Check-In Questions")
    print("-"*60)
    
    print("\nBot: Let's do a quick daily check-in!")
    questions = chatbot.get_daily_checkin_questions()
    for i, question in enumerate(questions, 1):
        print(f"  {i}. {question}")
    
    # Scenario 5: Resources
    print("\n\n" + "-"*60)
    print("Scenario 5: Mental Health Resources")
    print("-"*60)
    
    print(chatbot.get_resources())
    
    print("\n\n" + "="*60)
    print("DEMO COMPLETE")
    print("="*60)
    print("\nChatbot Features Demonstrated:")
    print("  [+] Mood tracking and analysis")
    print("  [+] Emotion-aware responses")
    print("  [+] Coping strategies")
    print("  [+] Journaling prompts")
    print("  [+] Daily check-ins")
    print("  [+] Mental health resources")

def demo_mood_tracking():
    """Demo mood tracking over time"""
    print("\n\n" + "="*60)
    print("MOOD TRACKING DEMO")
    print("="*60)
    
    chatbot = MentalHealthChatbot()
    user_id = 1
    
    # Simulate multiple mood entries
    mood_entries = [
        ("I'm feeling really happy today!", "Day 1"),
        ("Feeling a bit down", "Day 2"),
        ("Anxious about tomorrow", "Day 3"),
        ("Much better today", "Day 4"),
        ("Great day!", "Day 5")
    ]
    
    print("\nTracking mood over 5 days:")
    for mood, day in mood_entries:
        result = chatbot.process_mood(mood, user_id)
        print(f"\n{day}: '{mood}' -> {result['mood_level']}")
    
    # Show mood history
    print(f"\n\nMood History for User {user_id}:")
    if user_id in chatbot.user_mood_history:
        for entry in chatbot.user_mood_history[user_id]:
            print(f"  - {entry['mood']}: {entry['input']}")

def interactive_demo():
    """Interactive chatbot demo"""
    print("\n\n" + "="*60)
    print("INTERACTIVE CHATBOT")
    print("="*60)
    print("\nType 'quit' to exit\n")
    
    chatbot = MentalHealthChatbot()
    print(f"Bot: {chatbot.get_greeting()}\n")
    
    while True:
        try:
            user_input = input("You: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'bye']:
                print(f"\nBot: Take care! Remember, you're doing great.")
                break
            
            if not user_input:
                continue
            
            # Check for specific commands
            if 'journal' in user_input.lower():
                print(f"\nBot: {chatbot.get_journaling_prompt()}\n")
            elif 'coping' in user_input.lower() or 'strategies' in user_input.lower():
                category = 'anxiety' if 'anx' in user_input.lower() else 'general'
                print(f"\nBot: {chatbot.get_coping_strategies(category)}\n")
            elif 'resource' in user_input.lower() or 'help' in user_input.lower():
                print(f"\n{chatbot.get_resources()}\n")
            elif 'checkin' in user_input.lower() or 'check-in' in user_input.lower():
                questions = chatbot.get_daily_checkin_questions()
                print("\nBot: Daily Check-In Questions:")
                for i, q in enumerate(questions, 1):
                    print(f"  {i}. {q}")
                print()
            else:
                # Process as mood input
                result = chatbot.process_mood(user_input)
                print(f"\nBot: {result['message']}")
                print(f"Bot: {result['follow_up']}\n")
        
        except KeyboardInterrupt:
            print(f"\n\nBot: Goodbye! Take care.")
            break
        except EOFError:
            break

if __name__ == "__main__":
    # Run demos
    demo_conversation()
    demo_mood_tracking()
    
    # Ask if user wants interactive mode
    print("\n\nWould you like to try interactive mode? (y/n): ", end="")
    try:
        if input().lower().startswith('y'):
            interactive_demo()
    except:
        pass
    
    print("\n\nChatbot module ready for integration!")
