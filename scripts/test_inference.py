import os
import sys
import torch
import numpy as np

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from ai_modules.text_processor import TextEmotionAnalyzer
from ai_modules.voice_processor import VoiceStressAnalyzer
from ai_modules.face_processor import FaceEmotionAnalyzer
from ai_modules.rag_chatbot import chat_with_persona

async def run_validation():
    print("=== MindfulAI Local Inference Validation ===\n")

    # 1. Test Text AI
    print("[1/4] Testing Text Emotion Analyzer...")
    text_analyzer = TextEmotionAnalyzer()
    text_results = text_analyzer.analyze("I am feeling quite overwhelmed and anxious about my future.")
    print(f"Result: {text_results}\n")

    # 2. Test Voice AI
    print("[2/4] Testing Voice Stress Analyzer...")
    voice_analyzer = VoiceStressAnalyzer()
    # Mock some MFCC features (40 coefficients)
    mock_audio = np.random.randn(1, 40).astype(np.float32)
    voice_results = voice_analyzer.analyze(mock_audio)
    print(f"Result: {voice_results}\n")

    # 3. Test Face AI (YOLOv8)
    print("[3/4] Testing Face Mental Health Analyzer...")
    face_analyzer = FaceEmotionAnalyzer()
    # Create a simple dummy black image for inference test
    dummy_frame = np.zeros((480, 640, 3), dtype=np.uint8)
    face_results = face_analyzer.analyze(dummy_frame)
    print(f"Result: {face_results}\n")

    # 4. Test Local Chatbot
    print("[4/4] Testing Local LLM (Dr. Priya)...")
    chat_response = await chat_with_persona(
        "Hello Dr. Priya, I've been struggling with burnout lately.",
        "psychologist",
        []
    )
    print(f"Dr. Priya: {chat_response}\n")

    print("=== Validation Complete ===")

if __name__ == "__main__":
    import asyncio
    asyncio.run(run_validation())
