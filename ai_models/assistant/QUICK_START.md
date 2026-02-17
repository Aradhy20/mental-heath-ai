# Personalized AI Assistant - Quick Start

## Overview

The AI Assistant provides personalized mental health support through natural conversation, adapting to users' emotional states and offering compassionate, context-aware responses.

## Features

- ✅ **Emotion-Aware Responses**: Adapts based on detected emotions
- ✅ **5 Personality Types**: Empathetic, Professional, Supportive, Gentle, Motivational
- ✅ **Crisis Detection**: Identifies distress and provides resources
- ✅ **Conversation History**: Maintains context across sessions
- ✅ **LLM Flexible**: Supports OpenAI, Ollama, HuggingFace, or Mock

## Quick Start

### 1. Run Demo

```bash
# See the assistant in action
python ai_models/assistant/demo.py
```

### 2. Start Backend Service

```bash
# Start assistant service on port 8009
python backend/assistant_service/main.py
```

### 3. Use API

```bash
# Send chat message
curl -X POST http://localhost:8009/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "message": "I am feeling anxious today",
    "emotion_data": {
      "emotion": "fear",
      "score": 0.85,
      "stress_level": "high"
    },
    "personality": "empathetic"
  }'

# Get conversation history
curl http://localhost:8009/v1/conversation/1

# Clear conversation
curl -X DELETE http://localhost:8009/v1/conversation/1

# Get available personalities
curl http://localhost:8009/v1/personalities
```

## Personality Types

1. **Empathetic**: Warm, understanding, validates feelings
2. **Professional**: Evidence-based, structured, respectful
3. **Supportive**: Encouraging, focuses on strengths
4. **Gentle**: Calming, soft-spoken, soothing
5. **Motivational**: Energetic, inspiring, action-oriented

## LLM Configuration

### OpenAI (Recommended)

```python
from ai_models.assistant.assistant_engine import AssistantEngine, LLMProvider

assistant = AssistantEngine(
    provider=LLMProvider.OPENAI,
    model_name="gpt-3.5-turbo",
    api_key="your-openai-api-key"
)
```

### Ollama (Local/Privacy)

```python
assistant = AssistantEngine(
    provider=LLMProvider.OLLAMA,
    model_name="llama2"
)
```

### Mock (Testing)

```python
assistant = AssistantEngine(
    provider=LLMProvider.MOCK
)
```

## Integration Example

```python
from ai_models.assistant.assistant_engine import AssistantEngine, LLMProvider
from ai_models.assistant.personality import PersonalityType

# Create assistant
assistant = AssistantEngine(
    provider=LLMProvider.MOCK,
    personality_type=PersonalityType.EMPATHETIC
)

# Generate response with emotion data
emotion_data = {
    "emotion": "fear",
    "score": 0.85,
    "stress_level": "high"
}

result = assistant.generate_response(
    user_id=1,
    user_message="I'm feeling really anxious",
    emotion_data=emotion_data
)

print(result["response"])
# Output: Empathetic, emotion-aware response
```

## Safety Features

- **Crisis Detection**: Identifies concerning language
- **Resource Provision**: Provides crisis helpline numbers
- **Content Moderation**: Filters inappropriate responses
- **Emergency Escalation**: Alerts for serious concerns

## Files

- `conversation_manager.py`: Multi-turn dialogue handling
- `personality.py`: 5 personality types
- `emotion_aware_responses.py`: Emotion-based adaptation
- `assistant_engine.py`: LLM orchestration
- `demo.py`: Interactive demonstration

## API Endpoints

- `POST /v1/chat`: Send message, get response
- `GET /v1/conversation/{user_id}`: Get history
- `DELETE /v1/conversation/{user_id}`: Clear history
- `GET /v1/personalities`: List personalities
- `GET /health`: Service health
- `GET /metrics`: Performance metrics

## Next Steps

1. Configure LLM provider (OpenAI/Ollama)
2. Integrate with frontend
3. Add database for conversation persistence
4. Connect with existing emotion detection
5. Deploy as microservice
