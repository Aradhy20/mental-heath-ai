# AI Emotional Copilot

## Executive Summary

This platform already contains strong raw ingredients:

- mood tracking
- journaling
- chatbot interaction
- text, voice, and face emotion analysis
- a fusion endpoint
- dashboard and insight screens

What it does not yet have is a true central intelligence layer. The current product behaves like a set of adjacent wellness features. The redesigned product, `AI Emotional Copilot`, should behave like a continuous emotional operating system:

`User Input -> Emotion Engine -> Memory Engine -> Therapy Engine -> Action Engine -> Feedback Loop`

The product goal shifts from passive tracking to active emotional improvement.

## 1. Existing System Analysis

## Current Strengths

### Frontend capabilities

The frontend already includes pages and feature modules for:

- dashboard
- mood logging
- journal
- chat
- meditation and breathing
- analysis views
- insight views
- specialists and doctors

Relevant examples:

- `frontend/app/dashboard/page.tsx`
- `frontend/app/chat/page.tsx`
- `frontend/components/features/MoodTracker.tsx`
- `frontend/components/features/JournalEntry.tsx`
- `frontend/components/features/FaceAnalyzer.tsx`
- `frontend/components/features/VoiceAnalyzer.tsx`

### Backend capabilities

The backend already exposes:

- text analysis
- voice analysis
- face analysis
- chat
- mood and journal endpoints
- fusion logic
- crisis detection utilities

Relevant examples:

- `backend/api/analysis.py`
- `backend/api/fusion.py`
- `backend/api/wellness.py`
- `backend/ml/engines/chatbot/chatbot_engine.py`
- `backend/ml/engines/fusion/fusion_engine.py`
- `backend/ai/shared/crisis_detector.py`

## Current Architectural Gaps

### 1. Lack of central intelligence layer

The current backend exposes separate analysis routes for each modality, but there is no orchestrator that:

- unifies modalities into one emotional state object
- retrieves historical context before responding
- chooses a therapy strategy
- assigns one next-best action
- learns from outcomes

Result:
The system detects signals, but does not truly reason across them.

### 2. Weak chatbot structure

The current chatbot is empathetic but not therapy-aware enough. It uses:

- a small conversational model
- a short in-memory history window
- a generic support prompt

It does not yet reliably:

- follow CBT or evidence-based therapy flows
- detect cognitive distortions as first-class objects
- switch between intentional care modes
- produce measurable therapeutic goals

Result:
The chatbot comforts, but does not guide.

### 3. Disconnected AI modules

Text, face, voice, and fusion are implemented as parallel utilities rather than one multimodal decision system.

The current fusion logic is a simple weighted average without:

- temporal smoothing
- modality confidence calibration
- history-aware interpretation
- contradiction handling
- uncertainty management

Result:
The system combines scores, but does not fuse meaning.

### 4. No memory engine

The platform stores mood and journal data, but it does not yet maintain a clinically meaningful emotional memory that can answer questions such as:

- what usually precedes anxiety spikes for this user
- which coping actions historically worked
- what recurring distortions appear in journaling
- when mood instability is increasing

Result:
The system logs data, but does not remember patterns.

### 5. No habit loop or retention engine

The product currently supports user actions, but it does not yet implement a deliberate daily emotional loop:

- check-in
- interpretation
- personalized micro-action
- reflection
- reward
- progress reinforcement

Result:
The system collects entries, but does not create behavioral momentum.

### 6. Limited actionability

The dashboard currently emphasizes stats and visualizations. The next generation should prioritize:

- one key insight
- one recommended action
- one reflection task
- visible emotional progress over time

Result:
The user sees data, but not a clear next step.

## 2. Product Redesign

## Product Definition

`AI Emotional Copilot` is an emotionally intelligent system that interprets a user's emotional state in real time and helps them regulate it through contextual, evidence-based, personalized actions.

The core product promise is:

`Understand me -> remember me -> guide me -> help me act -> learn what works for me`

## Target Architecture

```text
Client Apps
   |
   v
API Gateway / FastAPI App
   |
   +--> Emotion Engine
   |      +--> Text Analyzer
   |      +--> Voice Analyzer
   |      +--> Face Analyzer
   |      +--> Multimodal Fusion
   |
   +--> Memory Engine
   |      +--> Relational Store
   |      +--> Vector Store
   |      +--> User Emotional Timeline
   |
   +--> Therapy Engine
   |      +--> CBT Reasoner
   |      +--> Distortion Detector
   |      +--> Safety / Crisis Guard
   |      +--> Mode Controller
   |
   +--> Prediction Engine
   |      +--> Trend Forecasting
   |      +--> Burnout Risk
   |      +--> Circadian Mood Model
   |
   +--> Action Engine
   |      +--> Micro-actions
   |      +--> Habit Loop Planner
   |      +--> Personalization Rules
   |
   +--> Feedback Loop
          +--> Outcome Tracking
          +--> Reinforcement
          +--> Experiment Memory
```

## Technology Direction

- Backend: FastAPI
- Core database: PostgreSQL preferred
- Cache and real-time session state: Redis
- Vector memory: Chroma or FAISS
- AI orchestration: LangChain or LangGraph-style orchestration
- LLM layer: open-source models such as Mistral or LLaMA variants
- Async task queue: Celery or Dramatiq for analysis jobs

PostgreSQL is preferable over MySQL here because:

- better analytics support
- easier JSON and event modeling
- stronger ecosystem for embeddings and time-series extensions
- cleaner fit for emotional timeline and event storage

## 3. Core AI Systems

## 3.1 Emotion Engine

## Purpose

Estimate the user's current emotional state from multiple signals.

## Inputs

- text from journal, chat, and reflections
- voice prosody features
- face expression features
- history-derived emotional baseline
- context metadata such as time of day, sleep, activity, and prior interventions

## Responsibilities

- normalize each modality into a shared emotional state schema
- detect valence, arousal, stress, confidence, and risk
- calibrate weak or missing modalities
- produce a single emotional state object

## Emotional State Object

```json
{
  "primary_emotion": "anxious",
  "secondary_emotions": ["overwhelmed", "sad"],
  "valence": -0.62,
  "arousal": 0.78,
  "stress_score": 0.81,
  "confidence": 0.74,
  "risk_level": "moderate",
  "contributors": {
    "text": 0.4,
    "voice": 0.3,
    "face": 0.2,
    "history": 0.1
  },
  "explanation": [
    "journal language indicates catastrophizing",
    "voice prosody suggests elevated tension",
    "history shows similar pattern before work deadlines"
  ]
}
```

## Fusion Formula

Base formulation:

```text
emotion_score =
  (text * 0.4) +
  (voice * 0.3) +
  (face * 0.2) +
  (history * 0.1)
```

Production improvement:

```text
fused_score =
  sum(modality_score * modality_weight * modality_confidence) / sum(active_weights)
```

This should also include:

- confidence weighting
- missing-modality handling
- user-specific calibration
- exponential smoothing across recent sessions

## Return Contract

- emotion
- confidence
- risk level
- recommended action

## 3.2 Memory Engine

## Purpose

Create durable emotional memory, not just logs.

## Memory Layers

### Episodic memory

Store specific events:

- "felt panic before meeting"
- "used breathing exercise and stress dropped"

### Semantic memory

Store abstracted patterns:

- "user tends to experience Sunday evening anxiety"
- "journaling is more effective than breathing for this user"

### Working memory

Store current conversation and present-day emotional state.

## Storage Model

- PostgreSQL for structured records
- Chroma or FAISS for embeddings and context retrieval
- Redis for live sessions and temporary orchestration state

## Retrieval Examples

- retrieve last 5 emotionally similar episodes
- retrieve successful interventions for current pattern
- retrieve recent therapist-style context summary

## 3.3 Therapy Engine

## Purpose

Turn emotion understanding into clinically informed dialogue.

## Therapy Principles

The engine should be grounded in:

- CBT
- behavioral activation
- emotion regulation
- motivational interviewing style prompts
- supportive psychotherapy tone

It must not present itself as a licensed clinician unless one is actually involved. It should act as an AI therapeutic coach and emotional support system with safety escalation.

## Therapy Modes

### Vent

Use when the user needs emotional release before reframing.

Characteristics:

- reflective listening
- low interruption
- validation first
- summarize emotional themes

### Coaching

Use when the user is ready for movement or restructuring.

Characteristics:

- identify thought patterns
- ask focused questions
- create one small action
- frame the next step clearly

### Support

Use when the user is distressed or depleted.

Characteristics:

- grounding
- compassionate containment
- reduce overwhelm
- avoid overloading with tasks

## CBT Capabilities

The therapy engine should detect:

- catastrophizing
- black-and-white thinking
- mind reading
- overgeneralization
- personalization
- fortune telling
- should statements

## Example Output

```json
{
  "mode": "coaching",
  "detected_distortions": ["catastrophizing", "fortune_telling"],
  "therapeutic_goal": "reduce work-related anticipatory anxiety",
  "response_style": "gentle_cbt",
  "suggested_intervention": "thought_reframe_plus_breathing"
}
```

## 3.4 Prediction Engine

## Purpose

Forecast where the user's emotional state is heading.

## Outputs

- next-day mood risk
- 7-day trend direction
- burnout probability
- emotional fatigue score
- circadian vulnerability windows

## Model Options

- moving averages and heuristics for MVP
- Prophet or state-space forecasting for v2
- LSTM / temporal transformer only if enough data exists

## Prediction Signals

- mood logs
- journaling sentiment shifts
- therapy session outcomes
- sleep and activity metadata if available
- emotional volatility
- check-in consistency

## 3.5 Action Engine

## Purpose

Recommend the smallest high-impact action for the user right now.

## Action Types

- breathing exercise
- grounding exercise
- short journal prompt
- cognitive reframing prompt
- walk or movement suggestion
- hydration or sleep prompt
- therapist escalation
- social connection prompt

## Selection Logic

Choose actions based on:

- current emotional state
- historical effectiveness
- user preferences
- time available
- energy level
- risk level

## Example Action Object

```json
{
  "action_type": "breathing",
  "title": "90-Second Reset",
  "reason": "Your arousal is high and breathing has helped in 3 of your last 5 anxious check-ins.",
  "duration_minutes": 2,
  "follow_up_prompt": "How do you feel now compared with before?"
}
```

## 4. Daily User Loop

The product should revolve around one emotionally intelligent daily loop.

## Daily Flow

### 1. Check-in

The user shares:

- mood
- optional text reflection
- optional face or voice input

### 2. AI emotion analysis

The Emotion Engine builds the current state:

- primary emotion
- stress
- risk
- confidence
- short explanation

### 3. Personalized action

The Action Engine picks one best next action.

### 4. Reflection

After the action, ask:

- did it help
- what changed
- what still feels hard

### 5. Progress tracking

The system updates:

- progress score
- streak
- emotional fatigue
- intervention effectiveness memory

## Core UX Principle

The user should always leave the app with one clear next step, not just a chart.

## 5. Multimodal AI Fusion

## Input Normalization

Each modality should emit a normalized structure:

```json
{
  "emotion": "anxious",
  "valence": -0.7,
  "arousal": 0.8,
  "stress": 0.78,
  "confidence": 0.74
}
```

## Fusion Rules

### Baseline weighted fusion

```text
emotion_score =
  (text * 0.4) +
  (voice * 0.3) +
  (face * 0.2) +
  (history * 0.1)
```

### Confidence-aware fusion

- reduce effect of low-confidence modalities
- increase role of history when live signals are sparse
- down-weight face when lighting or detection quality is poor
- down-weight voice when signal quality is poor

### Conflict resolution

Examples:

- positive words but strained voice
- neutral face but high-risk journal language

In these cases:

- retain modality-level explanations
- prefer higher-risk interpretation when safety is concerned
- expose uncertainty instead of pretending certainty

## Fusion Response Schema

```json
{
  "emotion": "anxious",
  "confidence": 0.77,
  "risk_level": "moderate",
  "emotional_fatigue_score": 0.68,
  "burnout_risk": 0.55,
  "recommended_action": {
    "type": "grounding",
    "title": "5-4-3-2-1 Reset"
  },
  "explanation": [
    "text indicates pressure and self-criticism",
    "voice indicates high tension",
    "history shows repeated work-triggered anxiety"
  ]
}
```

## 6. Database Design

Use PostgreSQL as the primary source of truth.

## Tables

### users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(80) UNIQUE,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(120),
  timezone VARCHAR(64),
  preferred_language VARCHAR(32),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);
```

### user_psychology_profile

```sql
CREATE TABLE user_psychology_profile (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  baseline_mood NUMERIC(4,2),
  baseline_stress NUMERIC(4,2),
  emotional_regulation_style VARCHAR(64),
  top_triggers JSONB,
  protective_factors JSONB,
  common_distortions JSONB,
  preferred_support_mode VARCHAR(32),
  sleep_pattern_summary JSONB,
  burnout_risk_baseline NUMERIC(4,2),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### mood_logs

```sql
CREATE TABLE mood_logs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  mood_score NUMERIC(4,2) NOT NULL,
  valence NUMERIC(5,2),
  arousal NUMERIC(5,2),
  stress_score NUMERIC(5,2),
  energy_score NUMERIC(5,2),
  feelings JSONB,
  activities JSONB,
  note TEXT,
  source VARCHAR(32) NOT NULL DEFAULT 'checkin',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### journal_entries

```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255),
  content TEXT NOT NULL,
  sentiment_label VARCHAR(64),
  sentiment_score NUMERIC(5,2),
  detected_distortions JSONB,
  embedding_id VARCHAR(128),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### chat_history

```sql
CREATE TABLE chat_history (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  session_id UUID NOT NULL,
  role VARCHAR(32) NOT NULL,
  content TEXT NOT NULL,
  mode VARCHAR(32),
  detected_emotion VARCHAR(64),
  detected_distortions JSONB,
  risk_level VARCHAR(32),
  action_id UUID,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### emotional_patterns

```sql
CREATE TABLE emotional_patterns (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  pattern_type VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_signals JSONB,
  time_window VARCHAR(64),
  confidence NUMERIC(5,2),
  first_seen_at TIMESTAMP,
  last_seen_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### therapy_sessions

```sql
CREATE TABLE therapy_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  mode VARCHAR(32) NOT NULL,
  session_goal TEXT,
  summary TEXT,
  detected_distortions JSONB,
  intervention_plan JSONB,
  before_state JSONB,
  after_state JSONB,
  outcome_score NUMERIC(5,2),
  escalated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMP
);
```

## Supporting Tables Recommended

- `recommended_actions`
- `action_outcomes`
- `emotion_events`
- `model_inferences`
- `safety_events`
- `habit_streaks`
- `daily_checkins`

## Vector Memory Collections

Use Chroma or FAISS collections for:

- journal embeddings
- therapy summaries
- emotional episodes
- successful interventions

Each vector record should include metadata:

- `user_id`
- `timestamp`
- `emotion`
- `risk_level`
- `session_id`
- `source_type`

## 7. Backend API Structure

The current routes should evolve into an orchestration-centric API.

## Core Endpoints

### POST /analyze-emotion

Purpose:

- process text, voice, face, and history together
- return a unified emotional state

Request:

```json
{
  "user_id": "uuid",
  "text": "I feel like I'm failing at everything",
  "voice_base64": null,
  "face_image_base64": null,
  "context": {
    "time_of_day": "evening",
    "sleep_hours": 5.5
  }
}
```

Response:

```json
{
  "emotion": "anxious",
  "confidence": 0.78,
  "risk_level": "moderate",
  "emotional_fatigue_score": 0.69,
  "burnout_risk": 0.51,
  "recommended_action": {
    "type": "breathing",
    "title": "Box Breathing"
  }
}
```

### POST /chat-therapy

Purpose:

- run therapy-aware conversation
- use memory retrieval
- choose mode: vent, coaching, support

Request:

```json
{
  "user_id": "uuid",
  "message": "I can't stop thinking I'll mess up tomorrow",
  "mode": "auto",
  "include_context": true
}
```

Response:

```json
{
  "reply": "It sounds like your mind is jumping ahead to the worst-case outcome. Let's slow that down together.",
  "mode": "coaching",
  "detected_distortions": ["catastrophizing", "fortune_telling"],
  "risk_level": "low",
  "next_action": {
    "type": "reframe",
    "title": "Challenge the Prediction"
  }
}
```

### POST /predict-mood

Purpose:

- forecast mood trend and identify risk windows

Request:

```json
{
  "user_id": "uuid",
  "horizon_days": 7
}
```

Response:

```json
{
  "trend": "declining",
  "forecast_confidence": 0.66,
  "burnout_risk": 0.58,
  "circadian_low_windows": ["22:00-23:30"],
  "explanation": [
    "late evening entries show repeated negative drift",
    "sleep-related signals correlate with next-day stress"
  ]
}
```

### POST /recommend-actions

Purpose:

- generate personalized micro-actions for the present state

Request:

```json
{
  "user_id": "uuid",
  "emotion": "overwhelmed",
  "stress_score": 0.8,
  "energy_score": 0.3,
  "available_minutes": 5
}
```

Response:

```json
{
  "recommended_actions": [
    {
      "type": "grounding",
      "title": "5-4-3-2-1 Reset",
      "duration_minutes": 3,
      "personalization_reason": "short, low-energy action matched to high arousal"
    }
  ]
}
```

## Additional Recommended Endpoints

- `POST /daily-checkin`
- `POST /actions/{id}/complete`
- `GET /insights/daily`
- `GET /insights/patterns`
- `GET /therapy/session/{id}`
- `GET /profile/psychology`
- `POST /safety/escalate`

## Service Layer Design

Inside FastAPI, prefer service modules such as:

- `services/emotion_engine.py`
- `services/memory_engine.py`
- `services/therapy_engine.py`
- `services/prediction_engine.py`
- `services/action_engine.py`
- `services/safety_engine.py`

This is the missing orchestration layer between routes and model utilities.

## 8. Frontend UX Redesign

The frontend should move from "feature navigation" to "guided emotional flow".

## 8.1 Daily Dashboard

Primary design principle:

The first screen should answer:

- how am I doing
- why does the AI think that
- what should I do next

## Dashboard sections

### Hero card

- today's emotional state
- one-sentence explanation
- confidence and risk badge

### One recommended action

- the single best next intervention
- duration
- why it was selected

### Reflection card

- "What changed after the action?"

### Progress strip

- streak
- regulation score
- fatigue trend

### Insights

- one pattern insight
- one trigger insight
- one win

## 8.2 AI Chat Interface

The chat experience should feel:

- human-like
- safe
- mode-aware
- memory-aware

## UX additions

- mode switch or auto-mode label: Vent, Coaching, Support
- visible "what I'm noticing" explanation chips
- action cards embedded in conversation
- end-of-session recap
- crisis escalation banner when needed

## 8.3 Mood Insights

Insights should explain patterns in plain language:

- "Your anxiety rises most on Sunday nights."
- "Breathing helps quickly, but journaling reduces recurrence."
- "Low sleep predicts lower mood the next morning."

Avoid dashboards that only show charts without interpretation.

## 9. Advanced Features

## Emotional fatigue score

A composite metric derived from:

- emotional volatility
- prolonged high arousal
- repeated negative self-talk
- failed interventions
- poor recovery patterns

## Circadian mood tracking

Track emotional state by:

- hour of day
- day of week
- sleep-linked windows

Use this to proactively recommend:

- earlier wind-down actions
- pre-emptive interventions before vulnerable windows

## Burnout detection

Burnout should be inferred from:

- persistent exhaustion
- low positive affect
- increasing cynicism language
- declining recovery after coping actions
- high workload themes in journal and chat

## Gamification

Use supportive gamification, not pressure-heavy gamification.

Good examples:

- streaks for check-ins
- resilience score
- "you recovered faster this week"
- milestones for repeating healthy actions

Avoid:

- shame-inducing missed streak messaging
- over-competitive scoring

## 10. System Design and Infrastructure

## Recommended Stack

- FastAPI for orchestration and APIs
- PostgreSQL for transactional and analytical data
- Redis for cache and short-lived session state
- Chroma or FAISS for vector memory
- LangChain or LangGraph for multi-step agent orchestration
- Mistral / LLaMA-family models for open-source inference

## Deployment Topology

```text
Next.js Frontend
    |
    v
FastAPI Gateway
    |
    +--> Emotion Service
    +--> Therapy Service
    +--> Prediction Service
    +--> Action Service
    +--> Safety Service
    |
    +--> PostgreSQL
    +--> Redis
    +--> Vector DB
    +--> Model Inference Workers
```

## Scalability Principles

- keep model inference behind service boundaries
- move heavy multimodal processing to async workers
- cache recent emotional state in Redis
- store durable events in PostgreSQL
- keep retrieval memory modular
- instrument every model output with explanation and confidence

## Safety Principles

- separate support from diagnosis
- crisis routing takes priority over normal chat generation
- never rely on a single modality for high-risk judgment
- preserve audit logs for safety-sensitive interactions
- always degrade gracefully when one modality fails

## Recommended Application Layers

### Presentation

- Next.js pages
- chat and dashboard components

### API and orchestration

- FastAPI routers
- service layer
- workflow controllers

### Intelligence

- classifiers
- fusion logic
- retrieval
- therapy reasoning
- action ranking

### Data

- relational data
- vector memory
- cache
- analytics events

## 11. Step-by-Step Implementation Roadmap

## Phase 1: Foundation and unification

Goal:
Create the orchestration backbone.

Tasks:

1. Replace mixed SQL + Mongo primary storage strategy with PostgreSQL-centered design
2. Introduce service layer modules:
   - emotion engine
   - memory engine
   - therapy engine
   - action engine
   - prediction engine
3. Standardize emotional state schema across text, face, and voice
4. Replace current `/fusion` logic with confidence-aware fusion
5. Add `daily_checkins`, `therapy_sessions`, and `recommended_actions`

Deliverable:
A unified emotional state object and orchestration service.

## Phase 2: Therapy intelligence

Goal:
Upgrade the chatbot into therapy-aware dialogue.

Tasks:

1. Add therapy modes: Vent, Coaching, Support
2. Build cognitive distortion detector
3. Add retrieval from recent journal, mood, and therapy history
4. Add session summary generation
5. Integrate crisis and safety policies directly into therapy flow

Deliverable:
`/chat-therapy` with memory-aware CBT logic.

## Phase 3: Action loop and retention

Goal:
Make the product action-driven.

Tasks:

1. Create micro-action library
2. Add action ranking logic
3. Build action completion and reflection flow
4. Add streaks and regulation score
5. Redesign dashboard around one next action

Deliverable:
Daily emotional regulation loop.

## Phase 4: Prediction and proactive care

Goal:
Move from reactive support to anticipatory support.

Tasks:

1. Build mood trend forecasting
2. Add emotional fatigue score
3. Add burnout detection
4. Add circadian mood insights
5. Trigger proactive nudges before known low windows

Deliverable:
Forecast-driven emotional copilot behavior.

## Phase 5: Personalization and optimization

Goal:
Learn what works for each user.

Tasks:

1. Store intervention outcomes
2. rank interventions by historical effectiveness
3. personalize by time, context, and mode preference
4. add A/B testing for action strategies
5. add analytics for engagement and recovery speed

Deliverable:
A system that improves recommendations over time.

## 12. Immediate Refactor Recommendations for This Codebase

## Backend

- move business logic out of routes into `services/`
- stop using in-memory chatbot context as the primary memory
- consolidate schema definitions and add richer emotional-state models
- replace `backend/api/fusion.py` simplistic averaging with stateful multimodal fusion
- migrate from current mixed Mongo/MySQL assumptions to one deliberate storage strategy

## Frontend

- redesign dashboard around action-first UX
- turn chat into a mode-aware therapy interface
- expose "why the AI thinks this" explanations
- add post-action reflections and daily check-in flow

## AI

- standardize modality outputs
- add history as a first-class signal
- add cognitive distortion detection
- add action recommendation ranking and tracking

## 13. Success Metrics

Measure success using:

- daily check-in completion rate
- action completion rate
- self-reported mood improvement after actions
- session retention
- reduction in emotional volatility
- safety escalation accuracy
- intervention effectiveness by user and context

## Final Product Standard

The target system should feel:

- emotionally intelligent
- scientifically grounded
- action-driven
- memory-aware
- safe
- scalable

The key transformation is this:

The current product is a set of mental health features.

`AI Emotional Copilot` becomes a coordinated emotional guidance system that can understand the user in context, remember what matters, respond with therapeutic intent, recommend the right next action, and improve over time.
