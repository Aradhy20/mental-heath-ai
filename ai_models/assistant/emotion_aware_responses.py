"""
Emotion-Aware Response System
Adjusts assistant responses based on detected emotional state
"""

from typing import Dict, Optional, List
from enum import Enum

class EmotionCategory(Enum):
    """Emotion categories"""
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
    CRISIS = "crisis"

class EmotionAwareResponses:
    """Generates emotion-appropriate responses"""
    
    # Emotion to category mapping
    EMOTION_CATEGORIES = {
        "joy": EmotionCategory.POSITIVE,
        "happiness": EmotionCategory.POSITIVE,
        "contentment": EmotionCategory.POSITIVE,
        
        "sadness": EmotionCategory.NEGATIVE,
        "fear": EmotionCategory.NEGATIVE,
        "anxiety": EmotionCategory.NEGATIVE,
        "anger": EmotionCategory.NEGATIVE,
        "disgust": EmotionCategory.NEGATIVE,
        "stress": EmotionCategory.NEGATIVE,
        
        "neutral": EmotionCategory.NEUTRAL,
        
        # Crisis indicators
        "despair": EmotionCategory.CRISIS,
        "hopelessness": EmotionCategory.CRISIS,
    }
    
    # Crisis keywords
    CRISIS_KEYWORDS = [
        "suicide", "kill myself", "end it all", "no point",
        "harm myself", "hurt myself", "self-harm", "cutting",
        "don't want to live", "better off dead"
    ]
    
    def __init__(self):
        self.emotion_context_templates = self._init_templates()
    
    def _init_templates(self) -> Dict:
        """Initialize emotion-specific response templates"""
        return {
            EmotionCategory.POSITIVE: {
                "acknowledgment": "I'm glad to hear you're feeling {emotion}!",
                "follow_up": "What's contributing to these positive feelings?",
                "reinforcement": "It's wonderful that you're experiencing {emotion}. Let's explore what's working well for you."
            },
            EmotionCategory.NEGATIVE: {
                "acknowledgment": "I understand you're feeling {emotion}. That must be difficult.",
                "validation": "It's completely okay to feel {emotion}. Your feelings are valid.",
                "support": "I'm here to help you through this {emotion}. Would you like to talk about what's causing it?"
            },
            EmotionCategory.NEUTRAL: {
                "acknowledgment": "I'm here to listen and support you.",
                "engagement": "How are things going for you today?"
            },
            EmotionCategory.CRISIS: {
                "immediate": "I'm really concerned about what you're sharing. Your safety is the top priority.",
                "resource": "Please reach out to a crisis helpline immediately: National Suicide Prevention Lifeline: 988 or 1-800-273-8255",
                "urgent": "If you're in immediate danger, please call 911 or go to your nearest emergency room."
            }
        }
    
    def detect_crisis(self, text: str) -> bool:
        """Detect if text contains crisis indicators"""
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in self.CRISIS_KEYWORDS)
    
    def get_emotion_category(self, emotion: str, score: float) -> EmotionCategory:
        """Categorize emotion"""
        # Check for crisis first
        if emotion in ["despair", "hopelessness"] or score > 0.9:
            return EmotionCategory.CRISIS
        
        return self.EMOTION_CATEGORIES.get(emotion.lower(), EmotionCategory.NEUTRAL)
    
    def create_emotion_context(self, emotion_data: Dict) -> str:
        """
        Create context string for LLM based on detected emotion
        
        Args:
            emotion_data: {emotion, score, confidence, stress_level, etc.}
        
        Returns:
            Context string to prepend to system prompt
        """
        emotion = emotion_data.get("emotion", "neutral")
        score = emotion_data.get("score", 0.5)
        stress_level = emotion_data.get("stress_level", "unknown")
        
        category = self.get_emotion_category(emotion, score)
        
        context = f"""
CURRENT USER EMOTIONAL STATE:
- Detected Emotion: {emotion} (confidence: {score:.2f})
- Stress Level: {stress_level}
- Category: {category.value}

RESPONSE GUIDANCE:
"""
        
        if category == EmotionCategory.CRISIS:
            context += """
- CRISIS DETECTED: Prioritize immediate safety
- Provide crisis resources
- Encourage professional help
- Be supportive but directive
"""
        elif category == EmotionCategory.NEGATIVE:
            context += """
- Validate their feelings
- Show empathy and understanding
- Offer support and coping strategies
- Ask open-ended questions to explore
"""
        elif category == EmotionCategory.POSITIVE:
            context += """
- Celebrate their positive state
- Explore what's working well
- Reinforce healthy behaviors
- Build on strengths
"""
        else:
            context += """
- Maintain supportive presence
- Encourage open communication
- Assess needs
"""
        
        return context
    
    def get_safety_response(self, crisis_detected: bool = False) -> Optional[str]:
        """Get immediate safety response if crisis detected"""
        if not crisis_detected:
            return None
        
        return """I'm very concerned about what you're sharing, and I want you to know that your safety is the most important thing right now.

Please reach out to one of these resources immediately:

🆘 **Crisis Resources:**
- National Suicide Prevention Lifeline: **988** or **1-800-273-8255** (24/7)
- Crisis Text Line: Text **HOME** to **741741**
- International: findahelpline.com

If you're in immediate danger, please call **911** or go to your nearest emergency room.

You don't have to go through this alone. These trained professionals are ready to help you right now. Would you like to talk about reaching out to them?"""
    
    def enhance_prompt_with_emotion(
        self,
        base_prompt: str,
        emotion_data: Optional[Dict] = None,
        user_message: Optional[str] = None
    ) -> str:
        """Enhance system prompt with emotional context"""
        if not emotion_data:
            return base_prompt
        
        emotion_context = self.create_emotion_context(emotion_data)
        
        # Check for crisis in user message
        if user_message and self.detect_crisis(user_message):
            emotion_context += "\n⚠️ CRISIS LANGUAGE DETECTED IN USER MESSAGE\n"
        
        return base_prompt + "\n\n" + emotion_context

# Example usage
if __name__ == "__main__":
    ear = EmotionAwareResponses()
    
    # Test emotion categorization
    test_emotions = [
        {"emotion": "joy", "score": 0.9, "stress_level": "low"},
        {"emotion": "fear", "score": 0.85, "stress_level": "high"},
        {"emotion": "neutral", "score": 0.5, "stress_level": "moderate"},
    ]
    
    for emotion_data in test_emotions:
        print(f"\nEmotion: {emotion_data['emotion']}")
        print("-" * 50)
        context = ear.create_emotion_context(emotion_data)
        print(context)
    
    # Test crisis detection
    crisis_texts = [
        "I'm feeling a bit down today",
        "I don't want to live anymore",
        "Everything seems hopeless"
    ]
    
    print("\n\nCrisis Detection Tests:")
    for text in crisis_texts:
        is_crisis = ear.detect_crisis(text)
        print(f"'{text}' -> Crisis: {is_crisis}")
