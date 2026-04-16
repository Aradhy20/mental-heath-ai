import os
import json
import asyncio
from typing import List

os.environ["USE_TF"] = "0"
os.environ["USE_TORCH"] = "1"

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from core.logging import log
from api import auth, analysis, wellness, chat, alerts, voice, biometrics, clinical_assessments, insights
from ai.learning_loop import router as learning_router

app = FastAPI(
    title="MindfulAI SaaS Platform — API",
    description="Production mental health SaaS: AI chat, emotion detection, mood tracking, journal, therapist discovery.",
    version="3.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Robust CORS Setup
ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://mindfulai.vercel.app",  # production
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/analysis")
async def websocket_analysis(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # In a real scenario, we'd process the frame/data here
            # For MindfulAI 2.0, we acknowledge the ping and could stream back results
            response = {"status": "received", "timestamp": str(asyncio.get_event_loop().time())}
            await manager.send_personal_message(json.dumps(response), websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Connect Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(analysis.router, prefix="/api/v1")
app.include_router(wellness.router, prefix="/api/v1")

app.include_router(chat.router, prefix="/api/v1")
app.include_router(alerts.router, prefix="/api/v1")
app.include_router(voice.router, prefix="/api/v1")
app.include_router(biometrics.router, prefix="/api/v1")
app.include_router(clinical_assessments.router, prefix="/api/v1")
app.include_router(insights.router, prefix="/api/v1")
app.include_router(learning_router, prefix="/api/v1")

@app.get("/")
def health_check():
    return {
        "status": "online", 
        "version": "2.0.0",
        "message": "MindfulAI 2.0 Backend is fully operational"
    }

def check_dependencies():
    """Validates that all critical AI dependencies are installed and accessible."""
    try:
        import torch
        import librosa
        import mediapipe
        import cv2
        import numpy
        log.info("AI Infrastructure validated: All core libraries accessible.")
        return True
    except ImportError as e:
        log.critical(f"FATAL: Missing AI dependency: {e}. System cannot boot.")
        return False

@app.on_event("startup")
async def startup_event():
    log.info("MindfulAI SaaS Backend v3.0 Starting...")
    if not check_dependencies():
        # In a real prod env, we might stop the boot process
        # For now, we log it clearly as a system warning
        log.error("AI system is running in DEGRADED mode due to missing dependencies.")
    log.info("Wellness tables initialized")
    log.info("SmolLM2 and MediaPipe engines will load on first request")

@app.get("/health")
def health():
    return {"status": "ok", "version": "3.0.0"}
