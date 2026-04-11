import os
os.environ["USE_TF"] = "0"
os.environ["USE_TORCH"] = "1"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, analysis, fusion

app = FastAPI(
    title="MindfulAI Backend API",
    description="Multimodal mental health analysis platform API",
    version="1.0.0"
)

# Robust CORS Setup for the Multi-Page React SaaS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(analysis.router, prefix="/api/v1")
app.include_router(fusion.router, prefix="/api/v1")

@app.get("/")
def health_check():
    return {"status": "online", "message": "MindfulAI Backend is fully operational"}
