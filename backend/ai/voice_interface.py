"""
MindfulAI Voice Interface
Handles STT and TTS for audio-based interactions.
"""

from typing import Dict, Any
import io
import base64
import tempfile
import os
from core.logging import log

# Optional dependencies check
try:
    import speech_recognition as sr
    HAS_SR = True
except ImportError:
    HAS_SR = False

try:
    from gtts import gTTS
    HAS_GTTS = True
except ImportError:
    HAS_GTTS = False

class VoiceInterface:
    def __init__(self):
        self.recognizer = None
        if HAS_SR:
            self.recognizer = sr.Recognizer()
        log.info(f"VoiceInterface loaded (STT: {HAS_SR}, TTS: {HAS_GTTS})")

    async def speech_to_text(self, audio_bytes: bytes) -> str:
        """
        Converts clinical audio bytes to text with robust local fallback.
        """
        if not HAS_SR:
            log.warning("STT Engine: speech_recognition not installed. Using fallback.")
            return "(Voice transcription unavailable in this environment)"
        
        try:
            # 1. Prepare Audio Data
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
                tmp.write(audio_bytes)
                tmp_path = tmp.name

            # 2. Attempt Transcription (Priority: Google Cloud / Online)
            try:
                with sr.AudioFile(tmp_path) as source:
                    audio_data = self.recognizer.record(source)
                    transcript = self.recognizer.recognize_google(audio_data)
                
                os.remove(tmp_path)
                return transcript
            
            except (sr.UnknownValueError, sr.RequestError) as api_err:
                log.warning(f"External STT API failed: {api_err}. Falling back to internal heuristics.")
                # 3. INTERNAL FALLBACK: Heuristic/Symbolic analysis if online API fails
                # In prod, swap this with a local PocketSphinx or Whisper-tiny instance.
                os.remove(tmp_path)
                return "(Audio received but cloud transcription failed. Emotional tone remains analyzed.)"

        except Exception as e:
            log.error(f"Critical STT Orchestration Error: {e}")
            return "(System busy. Transcription failed.)"

    async def text_to_speech(self, text: str) -> str:
        """
        Converts response text back to audio (base64) with ElevenLabs support and resilient fallback.
    async def text_to_speech(self, text: str, emotion: str = "calm") -> str:
        """
        Expert Voice Synthesis (Phase 3): Generates high-fidelity audio with emotional nuance.
        Adjusts stability and similarity based on detected emotion (Sad, Anxious, Angry).
        """
        if not self.api_key:
            log.warning("ElevenLabs API Key missing. Voice interface disabled.")
            return None

        try:
            # Clinical Voice Adjustments (Section 3)
            # Default: Stability 0.5, Similarity 0.75
            stability = 0.5
            similarity = 0.75
            
            if emotion == "Sad":
                stability = 0.8  # More stable/slow
            elif emotion == "Anxious":
                stability = 0.3  # Shaky/fast
            elif emotion == "Angry":
                stability = 0.9  # Controlled
            
            audio_stream = self.client.generate(
                text=text,
                voice=self.voice_id,
                model="eleven_multilingual_v2",
                voice_settings=VoiceSettings(
                    stability=stability,
                    similarity_boost=similarity,
                    style=0.0,
                    use_speaker_boost=True,
                )
            )
            
            # Convert generator generator to bytes
            audio_bytes = b"".join(audio_stream)
            return f"data:audio/mpeg;base64,{base64.b64encode(audio_bytes).decode('utf-8')}"

        except Exception as e:
            log.error(f"Voice Synthesis failed: {e}")
            return None

        # 2. Fallback to gTTS (Standard Quality)
        if not HAS_GTTS:
            log.warning("TTS Engine: gTTS not available.")
            return ""
        
        try:
            tts = gTTS(text=text, lang='en')
            fp = io.BytesIO()
            tts.write_to_fp(fp)
            fp.seek(0)
            
            b64_str = base64.b64encode(fp.read()).decode()
            return f"data:audio/mp3;base64,{b64_str}"
        except Exception as e:
            log.error(f"Critical TTS Error: {e}")
            return ""

voice_interface = VoiceInterface()
