# MongoDB Database Schema Documentation

## Overview
The Mental Health App uses MongoDB as the primary database with optimized collections for multimodal mental health data.

## Database Configuration
- **Database Name**: `mental_health_db`
- **Connection**: MongoDB running on `localhost:27017` (default)
- **Driver**: Motor (Async Python MongoDB driver)
- **Connection Pooling**: Min 10, Max 50 connections

## Collections

### 1. users
Stores user authentication and profile information.

**Schema:**
```javascript
{
  username: String (unique, indexed),
  email: String (unique, indexed),
  password_hash: String,
  name: String,
  disabled: Boolean,
  created_at: DateTime
}
```

**Indexes:**
- `username`: unique
- `email`: unique

---

### 2. text_analysis
Stores text emotion analysis results from chat and text inputs.

**Schema:**
```javascript
{
  user_id: String (indexed),
  input_text: String,
  emotion_label: String,
  emotion_score: Float,
  confidence: Float,
  sentiment: String (optional),
  keywords: Array[String] (optional),
  risk_level: String (optional),
  created_at: DateTime (indexed)
}
```

**Indexes:**
- Compound: `(user_id: 1, created_at: -1)`

**API Endpoints:**
- `POST /v1/analyze/text` - Analyze text emotion
- `POST /v1/analyze/text/contextual` - Contextual analysis with RAG
- `GET /v1/analyze/emotion/history` - Get user emotion history

---

### 3. voice_analysis
Stores voice stress and emotion analysis from audio inputs.

**Schema:**
```javascript
{
  user_id: String (indexed),
  stress_level: String,  // low, moderate, high
  intensity: Float,
  confidence: Float,
  audio_filename: String (optional),
  duration: Float (optional),
  features: Object (optional),
  created_at: DateTime (indexed)
}
```

**Indexes:**
- Compound: `(user_id: 1, created_at: -1)`

**API Endpoints:**
- `POST /v1/analyze/voice` - Analyze voice stress
- `GET /v1/analyze/voice/history` - Get user voice history

---

### 4. face_analysis
Stores facial emotion detection results from camera/images.

**Schema:**
```javascript
{
  user_id: String (indexed),
  emotion_label: String,
  face_score: Float,
  confidence: Float,
  image_data: String (optional, base64),
  facial_landmarks: Object (optional),
  created_at: DateTime (indexed)
}
```

**Indexes:**
- Compound: `(user_id: 1, created_at: -1)`

**API Endpoints:**
- `POST /v1/analyze/face` - Analyze facial emotions

---

### 5. mood_tracking
Stores daily mood check-ins and tracking data.

**Schema:**
```javascript
{
  user_id: String (indexed),
  mood_label: String,
  score: Float,
  notes: String (optional),
  triggers: Array[String] (optional),
  activities: Array[String] (optional),
  timestamp: DateTime (indexed)
}
```

**Indexes:**
- Compound: `(user_id: 1, timestamp: -1)`

**API Endpoints:**
- `POST /v1/mood` - Log mood entry
- `GET /v1/mood/history/{user_id}` - Get mood history
- `GET /v1/mood/trends/{user_id}` - Get mood analytics

---

### 6. journal_entries
Stores user journal entries and reflections.

**Schema:**
```javascript
{
  user_id: String (indexed),
  title: String,
  content: String,
  mood: String (optional),
  tags: Array[String] (optional),
  is_private: Boolean,
  created_at: DateTime (indexed),
  updated_at: DateTime
}
```

**Indexes:**
- Compound: `(user_id: 1, created_at: -1)`

**API Endpoints:**
- `POST /v1/journal` - Create journal entry
- `GET /v1/journal/{user_id}` - Get user's journals
- `GET /v1/journal/entry/{entry_id}` - Get specific entry
- `PUT /v1/journal/{entry_id}` - Update entry
- `DELETE /v1/journal/{entry_id}` - Delete entry

---

### 7. chat_logs
Stores AI chatbot conversation history.

**Schema:**
```javascript
{
  user_id: String (indexed),
  message: String,
  response: String,
  emotion_data: Object (optional),
  personality: String,
  created_at: DateTime (indexed)
}
```

**Indexes:**
- Compound: `(user_id: 1, created_at: -1)`

---

### 8. meditation_sessions
Stores meditation and mindfulness session data.

**Schema:**
```javascript
{
  user_id: String (indexed),
  session_type: String,  // breathing, guided, mindfulness
  duration: Integer,  // seconds
  completed: Boolean,
  notes: String (optional),
  rating: Integer (optional, 1-5),
  created_at: DateTime (indexed)
}
```

**Indexes:**
- Compound: `(user_id: 1, created_at: -1)`

---

### 9. emotion_history
Aggregated emotion data for trend analysis and reports.

**Schema:**
```javascript
{
  user_id: String (indexed),
  date: DateTime,
  dominant_emotion: String,
  emotion_scores: Object,  // {emotion: score}
  text_count: Integer,
  voice_count: Integer,
  face_count: Integer,
  average_confidence: Float,
  risk_level: String (optional)
}
```

**Indexes:**
- Compound: `(user_id: 1, date: -1)`

---

### 10. reports
Stores generated user reports and assessments.

**Schema:**
```javascript
{
  user_id: String (indexed),
  report_type: String,  // weekly, monthly, custom
  start_date: DateTime,
  end_date: DateTime,
  summary: Object,
  recommendations: Array[String] (optional),
  created_at: DateTime (indexed)
}
```

**Indexes:**
- Compound: `(user_id: 1, created_at: -1)`

---

## Data Retention

- **User Data**: Retained indefinitely (until account deletion)
- **Analysis Data**: 90 days rolling window (configurable)
- **Chat Logs**: 30 days (configurable)
- **Journal Entries**: Retained indefinitely
- **Session Data**: 60 days

## Backup Strategy

1. **Daily Backups**: Automated MongoDB dumps
2. **Point-in-Time Recovery**: Enabled via replica sets (production)
3. **Retention**: 30 days of daily backups

## Performance Optimization

1. **Indexes**: All collections have compound indexes on (user_id, created_at)
2. **Connection Pooling**: 10-50 concurrent connections
3. **Query Limits**: Default 100 documents per query with pagination
4. **Aggregation**: Used for trends and analytics

## Migration from SQLite

Run the migration script to transfer existing data:
```bash
python backend/migrate_to_mongodb.py
```

This will:
- Transfer text_analysis records
- Transfer voice_analysis records
- Preserve timestamps and user associations
- Skip duplicate entries
