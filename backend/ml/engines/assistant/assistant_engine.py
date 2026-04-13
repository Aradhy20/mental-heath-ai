"""
AI Assistant Engine  
Main orchestration for conversational AI with LLM integration
"""

from typing import Dict, Optional, List
import os
from enum import Enum

# Import assistant components
from .conversation_manager import ConversationManager
from .personality import Personality, PersonalityType
from .emotion_aware_responses import EmotionAwareResponses

class LLMProvider(Enum):
    """Supported LLM providers"""
    OPENAI = "openai"
    OLLAMA = "ollama"
    HUGGINGFACE = "huggingface"
    MOCK = "mock"  # For testing without LLM

class AssistantEngine:
    """Main AI Assistant orchestration"""
    
    def __init__(
        self,
        provider: LLMProvider = LLMProvider.MOCK,
        model_name: Optional[str] = None,
        personality_type: PersonalityType = PersonalityType.EMPATHETIC,
        api_key: Optional[str] = None
    ):
        self.provider = provider
        self.model_name = model_name or self._get_default_model()
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        
        # Initialize components
        self.conversation_manager = ConversationManager()
        self.personality = Personality(personality_type)
        self.emotion_aware = EmotionAwareResponses()
        
        # Initialize LLM client
        self.llm_client = self._init_llm_client()
    
    def _get_default_model(self) -> str:
        """Get default model for provider"""
        defaults = {
            LLMProvider.OPENAI: "gpt-3.5-turbo",
            LLMProvider.OLLAMA: "llama2",
            LLMProvider.HUGGINGFACE: "google/flan-t5-large",
            LLMProvider.MOCK: "mock-model"
        }
        return defaults.get(self.provider, "mock-model")
    
    def _init_llm_client(self):
        """Initialize LLM client based on provider"""
        if self.provider == LLMProvider.OPENAI:
            try:
                import openai
                openai.api_key = self.api_key
                return openai
            except ImportError:
                print("Warning: openai not installed. Using mock.")
                return None
        
        elif self.provider == LLMProvider.OLLAMA:
            try:
                import ollama
                return ollama
            except ImportError:
                print("Warning: ollama not installed. Using mock.")
                return None
        
        elif self.provider == LLMProvider.HUGGINGFACE:
            try:
                from transformers import pipeline
                return pipeline("text2text-generation", model=self.model_name)
            except ImportError:
                print("Warning: transformers not installed. Using mock.")
                return None
        
        return None  # Mock provider
   
    def generate_response(
        self,
        user_id: int,
        user_message: str,
        emotion_data: Optional[Dict] = None
    ) -> Dict:
        """
        Generate assistant response
        
        Args:
            user_id: User identifier
            user_message: User's message
            emotion_data: Optional emotion detection results
        
        Returns:
            {response, metadata}
        """
        # Check for crisis
        crisis_detected = self.emotion_aware.detect_crisis(user_message)
        if crisis_detected:
            safety_response = self.emotion_aware.get_safety_response(True)
            # Still add to conversation history
            self.conversation_manager.add_message(user_id, "user", user_message)
            self.conversation_manager.add_message(
                user_id, "assistant", safety_response,
                metadata={"crisis_detected": True}
            )
            return {
                "response": safety_response,
                "crisis_detected": True,
                "metadata": {"emotion": emotion_data}
            }
        
        # Add user message to history
        self.conversation_manager.add_message(
            user_id, "user", user_message,
            metadata={"emotion": emotion_data}
        )
        
        # Build system prompt with emotion context
        base_prompt = self.personality.get_system_prompt()
        enhanced_prompt = self.emotion_aware.enhance_prompt_with_emotion(
            base_prompt, emotion_data, user_message
        )
        
        # Get conversation context
        context = self.conversation_manager.get_context_for_llm(user_id)
        
        # Generate response from LLM
        assistant_response = self._call_llm(enhanced_prompt, context)
        
        # Add assistant response to history
        self.conversation_manager.add_message(
            user_id, "assistant", assistant_response
        )
        
        return {
            "response": assistant_response,
            "crisis_detected": False,
            "metadata": {
                "emotion": emotion_data,
                "personality": self.personality.personality_type.value,
                "model": self.model_name
            }
        }
    
    def _call_llm(self, system_prompt: str, context: List[Dict]) -> str:
        """Call LLM to generate response"""
        if self.provider == LLMProvider.OPENAI and self.llm_client:
            try:
                messages = [{"role": "system", "content": system_prompt}]
                messages.extend(context)
                
                response = self.llm_client.ChatCompletion.create(
                    model=self.model_name,
                    messages=messages,
                    temperature=0.7,
                    max_tokens=500
                )
                return response.choices[0].message.content
            except Exception as e:
                print(f"OpenAI error: {e}")
                return self._mock_response(context)
        
        elif self.provider == LLMProvider.OLLAMA and self.llm_client:
            try:
                messages = [{"role": "system", "content": system_prompt}]
                messages.extend(context)
                
                response = self.llm_client.chat(
                    model=self.model_name,
                    messages=messages
                )
                return response['message']['content']
            except Exception as e:
                print(f"Ollama error: {e}")
                return self._mock_response(context)
        
        else:
            # Mock response
            return self._mock_response(context)
    
    def _mock_response(self, context: List[Dict]) -> str:
        """Generate mock response for testing"""
        if not context:
            return "Hello! I'm here to listen and support you. How are you feeling today?"
        
        last_message = context[-1]["content"].lower()
        
        # Simple keyword-based responses
        if any(word in last_message for word in ["anxious", "anxiety", "worried"]):
            return "I hear that you're feeling anxious. Anxiety can be really overwhelming. Would you like to talk about what's triggering these feelings, or would you prefer to explore some coping strategies together?"
        
        elif any(word in last_message for word in ["sad", "depressed", "down"]):
            return "I'm sorry you're feeling this way. It's okay to feel sad sometimes. Your feelings are valid. Would you like to share what's been contributing to these feelings?"
        
        elif any(word in last_message for word in ["happy", "good", "great"]):
            return "That's wonderful to hear! I'm glad you're feeling positive. What's been going well for you?"
        
        elif any(word in last_message for word in ["stressed", "overwhelmed"]):
            return "Feeling stressed and overwhelmed is really tough. Let's take this one step at a time. What's the main thing causing you stress right now?"
        
        else:
            return "Thank you for sharing that with me. Tell me more about what's on your mind. I'm here to listen and support you."
    
    def clear_conversation(self, user_id: int):
        """Clear conversation history"""
        self.conversation_manager.clear_conversation(user_id)
    
    def change_personality(self, personality_type: PersonalityType):
        """Change assistant personality"""
        self.personality = Personality(personality_type)

# Example usage
if __name__ == "__main__":
    # Create assistant with mock provider
    assistant = AssistantEngine(
        provider=LLMProvider.MOCK,
        personality_type=PersonalityType.EMPATHETIC
    )
    
    # Simulate conversation
    user_id = 1
    
    messages = [
        ("I've been feeling really anxious lately", {"emotion": "fear", "score": 0.85, "stress_level": "high"}),
        ("It's about work deadlines and family pressure", {"emotion": "stress", "score": 0.75, "stress_level": "high"}),
        ("Thank you for listening", {"emotion": "neutral", "score": 0.5, "stress_level": "moderate"})
    ]
    
    print("="*60)
    print("AI ASSISTANT DEMO")
    print("="*60)
    
    for msg, emotion in messages:
        print(f"\nUser: {msg}")
        print(f"[Emotion: {emotion['emotion']}, Score: {emotion['score']:.2f}]")
        
        result = assistant.generate_response(user_id, msg, emotion)
        
        print(f"\nAssistant: {result['response']}")
        print("-"*60)
