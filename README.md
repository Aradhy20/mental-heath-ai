# Mental Health App

A comprehensive mental health and wellness application with AI-powered features, mood tracking, journaling, and professional support.

## 🌟 Features

- **AI Chat Assistant** - Personalized mental health support with gender-aware voice
- **Mood Tracking** - Interactive mood wheel with database persistence
- **Daily Journal** - Private journaling with history and search
- **Meditation & Coping** - AI-powered coping strategies for anxiety, stress, and sadness
- **Wellness Insights** - Analytics and trend visualization
- **Specialist Directory** - Find nearby mental health professionals
- **Multi-modal Analysis** - Text, voice, and facial emotion detection

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Zustand** - State management

### Backend
- **FastAPI** - High-performance Python API
- **SQLite** - Lightweight database
- **SQLAlchemy** - ORM
- **Microservices Architecture** - 10 independent services

### AI Models
- **DistilRoBERTa** - Text emotion analysis
- **DeepFace** - Facial expression recognition
- **Custom Fusion Model** - Multi-modal emotion detection

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.9+
- Git

### Clone Repository
```bash
git clone https://github.com/Aradhy20/mental-health.git
cd mental-health
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python start_services.py
```

## 🌐 Deployment

### Quick Deploy to Vercel
```bash
cd frontend
npx vercel --prod
```

### Deploy Backend to Railway
```bash
cd backend
railway up
```

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 🛠️ Development

### Run Debugging Tools
```bash
# Check service health
python debug_services.py

# Monitor continuously
python debug_services.py watch

# Inspect database
python debug_database.py

# Test frontend routes
python debug_frontend.py
```

### Project Structure
```
mental-health/
├── frontend/          # Next.js application
│   ├── app/          # App router pages
│   ├── components/   # React components
│   └── lib/          # Utilities and hooks
├── backend/          # FastAPI microservices
│   ├── auth_service/
│   ├── chatbot_service/
│   ├── mood_journal_service/
│   └── shared/       # Shared utilities
├── ai_models/        # AI model implementations
└── docs/            # Documentation
```

## 📊 Services

| Service | Port | Status |
|---------|------|--------|
| Auth | 8001 | ✅ Working |
| Text Analysis | 8002 | ⚠️ Mock Data |
| Voice Analysis | 8003 | ⚠️ Mock Data |
| Face Analysis | 8004 | ⚠️ Mock Data |
| Fusion | 8005 | ⚠️ Partial |
| Doctor | 8006 | ✅ Working |
| Notification | 8007 | ✅ Fixed |
| Mood/Journal | 8008 | ✅ Working |
| Report | 8009 | ✅ Fixed |
| Chatbot | 8010 | ✅ Working |

## 🎯 Key Features Implemented

- ✅ User authentication and registration
- ✅ Real-time mood tracking with database
- ✅ Journal entries with full CRUD
- ✅ AI-powered coping strategies
- ✅ Specialist provider directory
- ✅ Analytics dashboard with charts
- ✅ Personalized AI voice assistant
- ✅ Theme switching (light/dark)
- ✅ Responsive design
- ✅ Performance optimizations

## 📈 Performance

- **70% faster login** (2-3s → 500ms)
- **75% faster tab switching** (800ms → 200ms)
- **50% faster page load** (3-4s → 1-2s)
- **100% smoother animations** (30fps → 60fps)

## 🔒 Security

- Environment variables for sensitive data
- CORS configuration
- Input validation
- SQL injection prevention
- XSS protection

## 📝 Documentation

- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `DEBUGGING_GUIDE.md` - Debugging tools and tips
- `OPTIMIZATION_REPORT.md` - Performance improvements
- `PROJECT_STATUS.md` - Current project status

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Aradhy Jain** - Initial work - [Aradhy20](https://github.com/Aradhy20)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- FastAPI for the high-performance backend
- All open-source contributors

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

---

**⭐ Star this repo if you find it helpful!**

*Built with ❤️ for mental health awareness*