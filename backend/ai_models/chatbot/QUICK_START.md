# Mental Health Chatbot - Quick Start

## Overview

Interactive chatbot for daily mental health check-ins, mood tracking, journaling, and wellness support.

## Features

- ✅ **Mood Tracking**: Track and analyze emotional states
- ✅ **15 Journaling Prompts**: Guided self-reflection
- ✅ **Coping Strategies**: Anxiety, stress, sadness, general
- ✅ **Daily Check-Ins**: 7 wellness questions
- ✅ **Crisis Resources**: Helplines and support
- ✅ **Conversation States**: Smart state management

## Quick Start

### 1. Run Demo

```bash
python ai_models/chatbot/demo.py
```

### 2. Start Service

```bash
python backend/chatbot_service/main.py
# Service runs on port 8010
```

### 3. Use API

```bash
# Get greeting
curl http://localhost:8010/v1/greeting

# Track mood
curl -X POST http://localhost:8010/v1/mood \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "mood_input": "I am feeling anxious today"}'

# Get journaling prompt
curl http://localhost:8010/v1/journal/prompt

# Get coping strategies
curl -X POST http://localhost:8010/v1/coping \
  -H "Content-Type: application/json" \
  -d '{"category": "anxiety"}'

# Get daily check-in questions
curl http://localhost:8010/v1/checkin/questions

# Get mood history
curl http://localhost:8010/v1/mood/history/1

# Get resources
curl http://localhost:8010/v1/resources
```

## Coping Strategy Categories

- **anxiety**: Breathing, grounding, relaxation
- **stress**: Task management, breaks, exercise
- **sadness**: Connection, movement, self-compassion
- **general**: All-purpose wellness strategies

## Integration Example

```python
from ai_models.chatbot.chatbot_engine import MentalHealthChatbot

# Create chatbot
chatbot = MentalHealthChatbot()

# Get greeting
print(chatbot.get_greeting())

# Track mood
result = chatbot.process_mood("I'm feeling great!", user_id=1)
print(result["message"])
print(result["mood_level"])  # e.g., "positive"

# Get journaling prompt
prompt = chatbot.get_journaling_prompt()
print(prompt)

# Get coping strategies
strategies = chatbot.get_coping_strategies("anxiety")
print(strategies)

# Get daily check-in questions
questions = chatbot.get_daily_checkin_questions()
for q in questions:
    print(q)
```

## Mood Levels

- `very_positive`: Excellent mood (5/5, "great", "amazing")
- `positive`: Good mood (4/5, "happy", "good")
- `neutral`: Neutral (3/5, no strong emotions)
- `negative`: Low mood ("sad", "anxious", "stressed")
- `very_negative`: Very low mood (1-2/5, crisis keywords)

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/greeting` | GET | Get chatbot greeting |
| `/v1/mood` | POST | Track user mood |
| `/v1/mood/history/{user_id}` | GET | Get mood history |
| `/v1/journal/prompt` | GET | Get random journal prompt |
| `/v1/coping` | POST | Get coping strategies |
| `/v1/checkin/questions` | GET | Get daily check-in questions |
| `/v1/resources` | GET | Get mental health resources |
| `/health` | GET | Service health |
| `/metrics` | GET | Performance metrics |

## Files

- `chatbot_engine.py`: Main chatbot logic
- `demo.py`: Interactive demonstration
- `QUICK_START.md`: This guide

## Safety Features

- Crisis keyword detection
- Resource provision (988, Crisis Text Line)
- Mood-appropriate responses
- Supportive, non-judgmental tone

## Next Steps

1. Integrate with frontend UI
2. Add database for mood persistence
3. Connect with emotion detection models
4. Add personalization based on history
5. Implement mood visualization/charts
