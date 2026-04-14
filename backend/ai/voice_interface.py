"""
MindfulAI Voice Interface
Directs the Alexa-like audio interaction pipeline.
"""

import io
import os
import base64
from typing import Dict, Any, Optional
from core.logging import log

# Optional dependencies for Voice AI
try:
    from gtts import gTTS
    HAS_GTTS = True
except ImportError:
    HAS_GTTS = False

try:
    import speech_recognition as sr
class VoiceInterface:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        # Adjusted for browser-audio/low-quality mics
        self.recognizer.energy_threshold = 300
        self.recognizer.dynamic_energy_threshold = True

    async def transcribe_audio(self, audio_bytes: bytes) -> str:
        """
        Converts clinical audio bytes to text using Google Speech Recognition.
        Handles multi-format conversion via temporary file buffering.
        """
        try:
            # Create a temporary file to store the incoming blob
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
                temp_audio.write(audio_bytes)
                temp_path = temp_audio.name

            with sr.AudioFile(temp_path) as source:
                audio_data = self.recognizer.record(source)
                transcript = self.recognizer.recognize_google(audio_data)
                
            os.remove(temp_path)
            return transcript
        except sr.UnknownValueError:
            log.warning("STT: Could not understand audio")
            return "Audio received, but no speech detected."
        except sr.RequestError as e:
            log.error(f"STT Service Error: {e}")
            return "Voice service is currently busy. Please try typing."
        except Exception as e:
            log.error(f"Voice Transcription Failed: {e}")
            # Fallback if ffmpeg/librosa is missing for certain formats
            return "Audio signal received (Transcriber offline)."

    async def generate_speech(self, text: str) -> str:
        """
        Converts AI response to speech using gTTS.
        Returns a base64 Data URI for immediate frontend playback.
        """
        try:
            tts = gTTS(text=text, lang='en', slow=False)
            
            # Save to byte buffer
            fp = io.BytesIO()
            tts.write_to_fp(fp)
            fp.seek(0)
            
            audio_b64 = base64.b64encode(fp.read()).decode('utf-8')
            return f"data:audio/mp3;base64,{audio_b64}"
        except Exception as e:
            log.error(f"TTS Generation Failed: {e}")
            return ""

# Singleton instance
voice_interface = VoiceInterface()
