# MindfulAI Mental Health Platform

MindfulAI is a full-stack mental health and wellness platform with a Next.js frontend, a FastAPI backend, and multiple AI-assisted services for mood tracking, journaling, conversational support, and emotion analysis across text, voice, and face inputs.

This repository is organized for local development without Docker. The app can be run with standard Node.js and Python tooling, and it also includes supporting scripts, archived project documentation, and ML training/inference modules.

## Overview

- AI-assisted mental health companion and wellness guidance
- Mood tracking, journaling, insights, and dashboard views
- Text, voice, face, and fusion analysis services
- Therapist and specialist discovery interfaces
- Mobile-friendly Next.js application
- FastAPI backend with API routes, auth, and wellness endpoints

## Tech Stack

### Frontend

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Zustand

### Backend

- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite and Mongo-related integrations in different modules
- Python microservice-style AI service layout

### AI and ML

- Transformers
- Sentence Transformers
- TensorFlow / Keras
- MediaPipe
- OpenCV
- Librosa

## Repository Structure

```text
.
├── backend/      # FastAPI app, APIs, AI services, ML engines, scripts
├── frontend/     # Next.js application and UI components
├── docs/         # SRS and archived project documentation
├── scripts/      # Utility scripts for setup, diagnostics, and startup
├── logs/         # Runtime logs
├── render.yaml   # Deployment configuration
└── README.md
```

## Key Areas

### Frontend

The frontend lives in `frontend/` and uses the Next.js App Router. It includes pages for:

- dashboard
- mood tracking
- journal
- meditation
- chat
- analysis
- settings
- doctors and specialists

Useful command:

```bash
cd frontend
npm install
npm run dev
```

### Backend

The main backend entrypoint is `backend/main.py`. API routers are grouped under `backend/api/`, and shared backend concerns are split across `backend/core/`, `backend/db/`, and service-specific modules.

Useful commands:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend docs are available locally at:

- `http://localhost:8000/api/docs`
- `http://localhost:8000/api/redoc`

### AI Services and ML

This repository includes multiple AI-related modules under `backend/ai/` and `backend/ml/`, including:

- text analysis
- voice analysis
- face analysis
- fusion analysis
- model training helpers

Some advanced ML dependencies are intentionally separated or commented in requirements so local setup can stay flexible depending on the environment.

## Local Development

## Prerequisites

- Node.js 18 or newer
- npm
- Python 3.10 or newer
- pip
- Git

## 1. Clone the Repository

```bash
git clone https://github.com/Aradhy20/mental-heath-ai.git
cd mental-heath-ai
```

## 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

## 3. Start the Backend

Open a second terminal:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend runs on `http://localhost:8000`.

## Optional Backend Script

The repository also contains `backend/start_services.py`, which is intended to launch multiple service processes for a larger microservice-style setup.

```bash
cd backend
source .venv/bin/activate
python start_services.py
```

Depending on your environment, some optional service targets may require extra dependencies or additional service folders to be present.

## Environment Notes

- Keep secrets in local `.env` files and do not commit them
- `.gitignore` is already configured for common Python, Next.js, database, and model-artifact exclusions
- Some ML model files are intentionally ignored because they are too large for normal Git workflows

## Common Commands

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
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Documentation

- `docs/srs/` contains product and system requirement documentation
- `docs/archive/` contains archived planning, architecture, and implementation notes

## Deployment

The repository includes `render.yaml` and various helper scripts in `scripts/` that can be used as a starting point for deployment or service orchestration workflows.

## Notes

- This is an actively evolving project with both application code and experimental AI/ML pieces
- Some scripts and modules represent alternative implementations or enhanced service variants
- If you are setting this up for the first time, start with the frontend and core backend before enabling heavier ML dependencies
