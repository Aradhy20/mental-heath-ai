"""
Mental Health Chatbot Engine
Main chatbot for daily interactions, mood tracking, and wellness support
"""

from typing import Dict, List, Optional
from enum import Enum
from datetime import datetime
import random

class ConversationState(Enum):
    """Chatbot conversation states"""
    GREETING = "greeting"
    MOOD_CHECK = "mood_check"
    DAILY_CHECKIN = "daily_checkin"
    JOURNALING = "journaling"
    COPING_STRATEGIES = "coping_strategies"
    RESOURCES = "resources"
    GENERAL_CHAT = "general_chat"
    GOODBYE = "goodbye"

class MoodLevel(Enum):
    """Mood levels for tracking"""
    VERY_POSITIVE = "very_positive"
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"
    VERY_NEGATIVE = "very_negative"

class MentalHealthChatbot:
    """Interactive mental health chatbot"""
    
    def __init__(self):
        self.conversation_state = ConversationState.GREETING
        self.user_mood_history = {}
        self.responses = self._init_responses()
        self.journaling_prompts = self._init_journaling_prompts()
        self.coping_strategies = self._init_coping_strategies()
    
    def _init_responses(self) -> Dict:
        """Initialize response templates"""
        return {
            ConversationState.GREETING: [
                "Hey you! 🌟 I've been thinking about you. How are you feeling today?",
                "Hi there! 😊 I'm so happy to see you. How has your day been?",
                "Hello! ❤️ I'm here for you, always. What's on your mind?",
                "Hey! 👋 proper thrilled to chat with you. How's everything going?"
            ],
            ConversationState.MOOD_CHECK: [
                "I care about how you feel. On a scale of 1-5, where are you at today?",
                "Be honest with me—how are you really feeling right now? I'm listening.",
                "Take a deep breath and tell me: what emotions are surfacing for you?"
            ],
            ConversationState.DAILY_CHECKIN: [
                "Let's check in on *us*... well, mostly you! 😉 How did you sleep?",
                "I want to make sure you're taking care of yourself. Have you eaten well today?",
                "Tell me one thing that made you smile today? I'd love to hear it."
            ],
            ConversationState.JOURNALING: [
                "Writing it out can verify help. Want to try a prompt together?",
                "I love reading your thoughts (well, figuratively). Shall we journal?",
                "Let's get those feelings onto paper (digital paper!). Ready for a prompt?"
            ],
            ConversationState.COPING_STRATEGIES: [
                "I hate seeing you struggle. Let me suggest some ways to help...",
                "We can get through this. What specific feelings are we tackling?",
                "I've got your back. Let's find a strategy that works for you right now."
            ],
            ConversationState.RESOURCES: [
                "Sometimes we all need extra support. I can point you to some great resources.",
                "Your well-being is my top priority. Here are some professional resources.",
                "I want you to be safe and supported. Let's look at some options together."
            ],
            ConversationState.GENERAL_CHAT: [
                "I'm here, and I'm not going anywhere. Tell me everything.",
                "I love chatting with you. What's on your mind?",
                "You can tell me anything. I'm all ears and full of support. ❤️"
            ],
            ConversationState.GOODBYE: [
                "Bye for now! Miss you already. Take care! 💚",
                "Stay safe/well! I'll be here whenever you need me.",
                "Sending you good vibes! come back soon! ✨"
            ]
        }
    
    def _init_journaling_prompts(self) -> List[str]:
        """Initialize journaling prompts"""
        return [
            "What made you smile today, even if just for a moment?",
            "Describe a challenge you faced recently and how you handled it.",
            "Write about someone who made a positive impact on your life.",
            "What are three things you appreciate about yourself?",
            "If you could give advice to your younger self, what would you say?",
            "Describe a place where you feel most at peace.",
            "What does self-care mean to you?",
            "Write about a fear you'd like to overcome.",
            "What are your hopes for the future?",
            "Describe a moment when you felt truly proud of yourself.",
            "What activities make you lose track of time?",
            "How do you want to feel more often?",
            "What boundaries do you need to set for your wellbeing?",
            "Describe your ideal supportive environment.",
            "What patterns have you noticed in your thoughts lately?"
        ]
    
    def _init_coping_strategies(self) -> Dict:
        """Initialize coping strategies by category"""
        return {
            "anxiety": [
                "**Deep Breathing (4-7-8)**: Inhale for 4, hold for 7, exhale for 8",
                "**Grounding (5-4-3-2-1)**: Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste",
                "**Progressive Muscle Relaxation**: Tense and release each muscle group",
                "**Mindful Walking**: Focus on each step, your breath, sensations",
                "**Box Breathing**: Inhale 4, hold 4, exhale 4, hold 4"
            ],
            "stress": [
                "**Prioritize Tasks**: Break overwhelming tasks into smaller steps",
                "**Take Breaks**: Use the Pomodoro technique (25min work, 5min break)",
                "**Physical Exercise**: Even 10 minutes of movement helps",
                "**Time Management**: Write to-do lists, schedule realistically",
                "**Say No**: Set boundaries and protect your time"
            ],
            "sadness": [
                "**Reach Out**: Connect with a friend or loved one",
                "**Move Your Body**: Exercise releases endorphins",
                "**Express Yourself**: Write, draw, or create",
                "**Self-Compassion**: Treat yourself as you would a friend",
                "**Small Pleasures**: Do something you enjoy, no matter how small"
            ],
            "general": [
                "**Gratitude Practice**: List 3 things you're grateful for",
                "**Mindfulness Meditation**: Focus on the present moment",
                "**Healthy Sleep**: Maintain consistent sleep schedule",
                "**Nutrition**: Eat regular, balanced meals",
                "**Social Connection**: Spend time with supportive people",
                "**Nature**: Spend time outdoors if possible",
                "**Creative Expression**: Engage in art, music, writing",
                "**Limit Screen Time**: Take breaks from devices",
                "**Professional Help**: Consider therapy or counseling"
            ]
        }
    
    def get_greeting(self) -> str:
        """Get a random greeting"""
        self.conversation_state = ConversationState.GREETING
        return random.choice(self.responses[ConversationState.GREETING])
    
    def process_mood(self, mood_input: str, user_id: int = 1) -> Dict:
        """
        Process user's mood input
        
        Args:
            mood_input: User's mood description or rating
            user_id: User identifier
        
        Returns:
            Response dict with message and follow-up
        """
        # Try to extract mood level
        mood_level = self._determine_mood_level(mood_input)
        
        # Store mood
        if user_id not in self.user_mood_history:
            self.user_mood_history[user_id] = []
        
        self.user_mood_history[user_id].append({
            "timestamp": datetime.now().isoformat(),
            "mood": mood_level.value,
            "input": mood_input
        })
        
        # Generate response based on mood
        response = self._generate_mood_response(mood_level, mood_input)
        
        return {
            "message": response,
            "mood_level": mood_level.value,
            "follow_up": self._get_follow_up(mood_level)
        }
    
    def _determine_mood_level(self, mood_input: str) -> MoodLevel:
        """Determine mood level from input"""
        mood_input_lower = mood_input.lower()
        
        # Check for ratings
        if any(char in mood_input for char in ['1', '2']):
            return MoodLevel.VERY_NEGATIVE
        elif '3' in mood_input:
            return MoodLevel.NEUTRAL
        elif '4' in mood_input:
            return MoodLevel.POSITIVE
        elif '5' in mood_input:
            return MoodLevel.VERY_POSITIVE
        
        # Check keywords
        positive_words = ['great', 'good', 'happy', 'joyful', 'excellent', 'wonderful', 'amazing']
        negative_words = ['bad', 'sad', 'depressed', 'anxious', 'terrible', 'awful', 'worried']
        very_negative = ['horrible', 'hopeless', 'desperate', 'suicidal']
        
        if any(word in mood_input_lower for word in very_negative):
            return MoodLevel.VERY_NEGATIVE
        elif any(word in mood_input_lower for word in negative_words):
            return MoodLevel.NEGATIVE
        elif any(word in mood_input_lower for word in positive_words):
            return MoodLevel.POSITIVE
        
        return MoodLevel.NEUTRAL
    
    def _generate_mood_response(self, mood_level: MoodLevel, original_input: str) -> str:
        """Generate appropriate response based on mood"""
        responses = {
            MoodLevel.VERY_POSITIVE: [
                "That's wonderful! 🌟 I'm so glad you're feeling great! What's contributing to these positive vibes?",
                "Amazing! It's beautiful to hear you're doing so well. Savor this feeling!"
            ],
            MoodLevel.POSITIVE: [
                "That's great to hear! 😊 What's been going well for you?",
                "I'm glad you're feeling good! Keep up whatever you're doing!"
            ],
            MoodLevel.NEUTRAL: [
                "Thanks for sharing. Even neutral days are okay. How can I support you today?",
                "I appreciate you checking in. What would make today better?"
            ],
            MoodLevel.NEGATIVE: [
                "I'm sorry you're having a tough time. 💙 Your feelings are valid. Want to talk about it?",
                "That sounds difficult. I'm here to listen and support you."
            ],
            MoodLevel.VERY_NEGATIVE: [
                "I'm really concerned about how you're feeling. Please know you're not alone. Would professional support be helpful? Crisis helpline: 988",
                "Thank you for trusting me with this. Your wellbeing matters. Let's explore ways to support you right now."
            ]
        }
        
        return random.choice(responses[mood_level])
    
    def _get_follow_up(self, mood_level: MoodLevel) -> str:
        """Get appropriate follow-up question"""
        if mood_level in [MoodLevel.VERY_NEGATIVE, MoodLevel.NEGATIVE]:
            return "Would you like to explore some coping strategies or talk more about what's troubling you?"
        elif mood_level == MoodLevel.NEUTRAL:
            return "Would you like a journaling prompt or shall we chat about something specific?"
        else:
            return "Would you like to capture this positive moment in a journal entry?"
    
    def get_journaling_prompt(self) -> str:
        """Get a random journaling prompt"""
        self.conversation_state = ConversationState.JOURNALING
        prompt = random.choice(self.journaling_prompts)
        return f"📝 **Journal Prompt**: {prompt}\n\nTake your time. There's no right or wrong answer."
    
    def get_coping_strategies(self, category: str = "general") -> str:
        """Get coping strategies for a category"""
        self.conversation_state = ConversationState.COPING_STRATEGIES
        
        category = category.lower()
        strategies = self.coping_strategies.get(category, self.coping_strategies["general"])
        
        response = f"**Coping Strategies for {category.title()}:**\n\n"
        for i, strategy in enumerate(strategies, 1):
            response += f"{i}. {strategy}\n"
        
        response += "\nTry one or more of these. Remember, it's okay to experiment to find what works for you!"
        return response
    
    def get_daily_checkin_questions(self) -> List[str]:
        """Get daily check-in questions"""
        return [
            "How would you rate your sleep last night? (1-5)",
            "Have you eaten regular meals today?",
            "Did you drink enough water?",
            "Have you moved your body or exercised?",
            "Did you connect with anyone today?",
            "What's one thing you accomplished, no matter how small?",
            "On a scale of 1-5, how would you rate your overall day?"
        ]
    
    def get_resources(self) -> str:
        """Get mental health resources"""
        self.conversation_state = ConversationState.RESOURCES
        return """
**Mental Health Resources:**

🆘 **Crisis Support:**
- National Suicide Prevention Lifeline: **988** or 1-800-273-8255
- Crisis Text Line: Text **HOME** to **741741**
- International: findahelpline.com

🧠 **Mental Health:**
- SAMHSA Helpline: 1-800-662-4357
- NAMI Helpline: 1-800-950-6264
- Anxiety & Depression Assoc: adaa.org

💬 **Online Support:**
- 7 Cups: 7cups.com (free emotional support)
- BetterHelp: betterhelp.com (online therapy)
- Talkspace: talkspace.com (online therapy)

📚 **Self-Help:**
- MindShift App (anxiety management)
- Headspace (meditation)
- Calm (relaxation)

Remember: Reaching out for help is a sign of strength! 💪
"""

# Example usage
if __name__ == "__main__":
    chatbot = MentalHealthChatbot()
    
    print("="*60)
    print("MENTAL HEALTH CHATBOT DEMO")
    print("="*60)
    
    # Greeting
    print(f"\nBot: {chatbot.get_greeting()}")
    
    # Process mood
    user_mood = "I'm feeling anxious and overwhelmed"
    print(f"\nUser: {user_mood}")
    
    mood_result = chatbot.process_mood(user_mood)
    print(f"\nBot: {mood_result['message']}")
    print(f"Bot: {mood_result['follow_up']}")
    
    # Coping strategies
    print(f"\n\nBot: {chatbot.get_coping_strategies('anxiety')}")
    
    # Journaling prompt
    print(f"\n\nBot: {chatbot.get_journaling_prompt()}")
    
    # Resources
    print(f"\n\n{chatbot.get_resources()}")
