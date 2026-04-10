# Mental Health App

A Git-first mental health and wellness platform with AI-enhanced mood tracking, journaling, personalized support, and analytics.

This repository is designed to work without Docker. All setup and development is managed using Git, Node, Python, and local environment tools.

## 🌈 What This App Offers

- **Intelligent mental health assistant** with conversational support
- **Mood tracking dashboard** with progress insights
- **Personal journal** for thoughts, reflections, and growth
- **AI-powered coping tools** for stress and anxiety
- **Emotion detection** using text, voice, and face analysis
- **Professional resources** and therapist directory
- **Responsive interface** for mobile and desktop

## 🧩 Tech Stack

### Frontend
- Next.js + App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Zustand

### Backend
- FastAPI Python microservices
- SQLite for local persistence
- SQLAlchemy ORM
- Axios / REST API integration

### AI Models
- Transformers-based text emotion model
- Voice emotion analysis model
- Face emotion model with TensorFlow/Keras
- Multi-modal fusion and inference utilities

## 📁 Project Structure

```
project/
├── ai_models/           # AI training, inference, and model code
├── backend/             # Python backend services and APIs
├── docs/                # Documentation and architectural notes
├── frontend/            # Next.js application and UI
├── scripts/             # Auxiliary scripts and helpers
└── README.md            # Project overview and setup guide
```

## 🚀 Local Setup (Git-only)

### Prerequisites

- Git
- Node.js 18+
- Python 3.10+ (recommended)
- npm or pnpm

### Clone the repository

```bash
git clone https://github.com/Aradhy20/mental-heath-.git
cd mental-heath-
```

### Install frontend dependencies

```bash
cd frontend
npm install
```

### Install backend dependencies

```bash
cd ../backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Configure environment

Copy the example environment file and update any secrets:

```bash
cp .env.example .env
```

Then open `.env` and configure at minimum:

- `MONGO_DETAILS`
- `JWT_SECRET_KEY`
- `CORS_ORIGINS`

### Run the app

Start backend services and frontend in separate terminals.

```bash
# Terminal 1
cd backend
source .venv/bin/activate
python start_services.py

# Terminal 2
cd frontend
npm run dev
```

Open the app at `http://localhost:3000`.

## 💡 AI Model Training

This project includes AI model training scripts under `ai_models/`.

Use the local Python environment and the optional `.venv-ai` virtual environment if needed.

```bash
cd ai_models
python train_all.py
```

> This repository is configured to run without Docker. No Docker commands are required.

## 🧪 Available Scripts

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run start
```

### Backend

```bash
cd backend
source .venv/bin/activate
python start_services.py
```

### AI Models

```bash
cd ai_models
python train_all.py
```

## ✅ Contribution Guidelines

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add feature description"`
4. Push to GitHub: `git push origin feature/your-feature`
5. Open a Pull Request

## 📌 Notes

- This project is purposely Docker-free.
- Use Git and local tools for development.
- Keep secrets out of version control by using `.env`.

## 📞 Contact

If you need help or want to collaborate, create a GitHub issue or message the repository owner.
