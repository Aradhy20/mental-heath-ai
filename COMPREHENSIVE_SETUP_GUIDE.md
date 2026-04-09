# Mental Health App - Complete Setup & Requirements Guide

## 📋 Project Overview

A comprehensive AI-powered mental health and wellness application with multi-modal emotion analysis, mood tracking, journaling, and professional support services.

## 🏗️ Architecture

### Frontend
- **Framework:** Next.js 15.0.7 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom animations
- **State Management:** Zustand
- **UI Components:** Radix UI, Framer Motion

### Backend Architecture
- **API Gateway:** Express.js (Node.js) - Port 5003
- **AI Services:** FastAPI (Python) microservices - Ports 8001-8010
- **Database:** MongoDB (Atlas recommended for production)
- **Authentication:** JWT with bcrypt

### AI Services (Microservices)
- **Text Analysis:** Emotion detection with contextual understanding
- **Voice Analysis:** Stress detection from audio
- **Face Analysis:** Facial emotion recognition
- **Fusion Engine:** Multi-modal emotion analysis
- **Chatbot:** AI-powered conversation support

## 🔧 System Requirements

### Minimum Hardware Requirements
- **RAM:** 8GB minimum, 16GB recommended
- **CPU:** 4-core processor minimum
- **Storage:** 10GB free space
- **Network:** Stable internet connection (required for AI services)

### Software Prerequisites

#### Required Software
- **Node.js:** v18.0.0 or higher
- **Python:** v3.9.0 or higher
- **MongoDB:** Atlas (cloud) or local installation
- **Git:** Latest version

#### Optional but Recommended
- **Docker:** Optional containerized deployment only
- **MongoDB Compass:** For database management
- **VS Code:** With Python and TypeScript extensions

## 📦 Dependencies & Installation

### 1. Python Dependencies (AI Services)

Install core AI packages:
```bash
pip install torch>=2.0.0 transformers>=4.35.0 sentence-transformers>=2.2.2
pip install opencv-python>=4.5.0 numpy>=1.21.0 pillow>=9.0.0
pip install fastapi>=0.104.1 uvicorn[standard]>=0.24.0 pydantic>=2.5.0
pip install httpx>=0.25.1 python-dotenv>=1.0.0
```

### 2. Node.js Dependencies (Frontend & Express)

Frontend dependencies are automatically installed via `package.json`:
```bash
cd frontend
npm install
```

Express backend dependencies:
```bash
cd backend/express
npm install
```

### 3. Database Setup

#### Option A: MongoDB Atlas (Recommended for Production)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free account
3. Create a new cluster (M0 free tier)
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/mental_health_db`
5. Update `backend/express/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mental_health_db
   ```

#### Option B: Local MongoDB (Development Only)
```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community
```

> Optional: If you prefer a containerized database instance, Docker can still be used, but it is not required for this project.

## ⚙️ Configuration

### Environment Variables

#### Frontend (.env.local)
```env
# API Gateway (recommended)
NEXT_PUBLIC_API_URL=http://localhost:5003

# Individual services (fallback)
NEXT_PUBLIC_AUTH_URL=http://localhost:8001
NEXT_PUBLIC_TEXT_URL=http://localhost:8002
NEXT_PUBLIC_VOICE_URL=http://localhost:8003
NEXT_PUBLIC_FACE_URL=http://localhost:8004
NEXT_PUBLIC_FUSION_URL=http://localhost:8005
NEXT_PUBLIC_MOOD_JOURNAL_URL=http://localhost:8008
```

#### Express Backend (.env)
```env
NODE_ENV=development
PORT=5003
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mental_health_db
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRE=7d

# AI Service URLs
AI_TEXT_SERVICE_URL=http://localhost:8002
AI_VOICE_SERVICE_URL=http://localhost:8003
AI_FACE_SERVICE_URL=http://localhost:8004

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Optional: Communication services
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SENDGRID_API_KEY=your_sendgrid_api_key
```

## 🚀 Startup Instructions

### Quick Start (All Services)

#### Option 1: Automated Startup Script (macOS/Linux)
```bash
cd /Users/aradhyjain/Desktop/project

# Make scripts executable
chmod +x scripts/*.sh

# Start all services
./scripts/start_express_backend.sh &
python scripts/start_backend_services.py &
cd frontend && npm run dev
```

#### Option 2: Manual Startup

**Terminal 1: Express Backend**
```bash
cd backend/express
npm start
# Server runs on http://localhost:5003
```

**Terminal 2: AI Services**
```bash
cd backend
python start_services.py
# Services run on ports 8001-8010
```

**Terminal 3: Frontend**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

### Service Health Check
```bash
# Check all services
python scripts/check_services.py

# Verify AI models
python scripts/verify_ai_models_lite.py
```

## 🔍 Service Endpoints

### Express API Gateway (Port 5003)
- `GET /health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/mood` - Log mood
- `GET /api/mood` - Get mood history
- `POST /api/journal` - Save journal entry
- `GET /api/journal` - Get journal entries
- `POST /api/analysis/text` - Text emotion analysis
- `POST /api/analysis/face` - Facial emotion analysis
- `POST /api/analysis/voice` - Voice stress analysis
- `POST /api/chat/send` - Send chat message

### AI Microservices
- **Auth Service:** `http://localhost:8001`
- **Text Analysis:** `http://localhost:8002`
- **Voice Analysis:** `http://localhost:8003`
- **Face Analysis:** `http://localhost:8004`
- **Fusion Engine:** `http://localhost:8005`
- **Mood/Journal:** `http://localhost:8008`
- **Chatbot:** `http://localhost:8010`

## 🗄️ Database Schema

### Collections (MongoDB)

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  name: String,
  phone: String,
  voice_preference: String, // 'male' | 'female'
  language_preference: String, // 'en-US', 'hi-IN', etc.
  created_at: Date,
  last_login: Date
}
```

#### Mood Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: users),
  score: Number, // 1-10
  label: String, // 'Happy', 'Sad', etc.
  note: String,
  activities: Array,
  energy_level: Number,
  createdAt: Date
}
```

#### Journal Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: users),
  title: String,
  content: String,
  is_private: Boolean,
  createdAt: Date
}
```

#### Doctors Collection
```javascript
{
  _id: ObjectId,
  name: String,
  specialty: String,
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  address: String,
  phone: String,
  email: String,
  rating: Number,
  experience: Number
}
```

## 🎯 AI Model Specifications

### Text Emotion Analysis
- **Model:** Scikit-learn pipeline (TfidfVectorizer + MLPClassifier)
- **Input:** Text string
- **Output:** Emotion label, confidence score
- **Emotions:** joy, sadness, anger, fear, neutral
- **Accuracy:** ~85% on test data

### Voice Stress Analysis
- **Model:** Scikit-learn classifier
- **Input:** Audio file (WAV/MP3)
- **Output:** Stress level (low, medium, high)
- **Features:** MFCCs, spectral features
- **Note:** Limited without librosa library

### Face Emotion Analysis
- **Model:** Scikit-learn classifier
- **Input:** Image file (JPEG/PNG)
- **Output:** Emotion label, confidence score
- **Emotions:** happy, sad, angry, neutral, surprised
- **Note:** Uses basic image features

### Fusion Engine
- **Input:** Text, voice, and face analysis results
- **Output:** Overall mental wellness score, risk assessment
- **Algorithm:** Weighted combination with fuzzy logic

## 🔐 Security Features

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Token expiration (7 days)
- Secure cookie handling

### API Security
- CORS configuration
- Rate limiting (1000 requests/15min)
- Input validation
- Helmet.js security headers

### Data Privacy
- User data encryption at rest
- Secure API communication
- Private journaling
- GDPR-compliant data handling

## 📊 Performance Metrics

### Response Times
- **Frontend load:** <2 seconds
- **API responses:** <500ms
- **AI analysis:** <3 seconds
- **Database queries:** <100ms

### Resource Usage
- **Memory:** ~1GB per AI service
- **CPU:** ~20% during analysis
- **Storage:** ~500MB for models + user data

## 🚀 Deployment Options

### Development
- Local MongoDB or Atlas
- All services on localhost
- Hot reload enabled

### Production (Recommended)
- **Frontend:** Vercel or Netlify
- **Backend:** Railway or Render
- **Database:** MongoDB Atlas
- **AI Services:** Local Python FastAPI services or optional container deployment

### Optional Docker Deployment
```bash
# Optional: Build and run with Docker Compose
docker-compose up --build
```

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
```bash
# Check MongoDB Atlas connection string
# Ensure IP whitelist includes 0.0.0.0/0 for development
# Verify username/password in connection string
```

#### AI Services Not Starting
```bash
# Check Python dependencies
pip install -r backend/requirements_all.txt

# Verify port availability
lsof -i :8001-8010
```

#### Frontend Build Errors
```bash
# Clear Next.js cache
rm -rf frontend/.next
cd frontend && npm run build
```

#### CORS Errors
```bash
# Check FRONTEND_URL in backend/express/.env
# Ensure it matches your frontend URL
```

### Health Checks
```bash
# Express backend health
curl http://localhost:5003/health

# AI service health
curl http://localhost:8002/health

# Frontend health
curl http://localhost:3000/api/health
```

## 📞 Support & Maintenance

### Monitoring
- Service health endpoints
- Error logging to console
- Performance monitoring scripts

### Backup Strategy
- MongoDB Atlas automatic backups
- User data export functionality
- Configuration backup

### Updates
- Regular dependency updates
- Security patches
- AI model retraining

## 🎉 Success Checklist

- [ ] MongoDB Atlas account created
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Services starting without errors
- [ ] Frontend accessible at localhost:3000
- [ ] User registration/login working
- [ ] AI analysis features functional
- [ ] Database connections verified

---

**Ready to launch your mental health AI platform! 🚀**

*Last updated: April 9, 2026*