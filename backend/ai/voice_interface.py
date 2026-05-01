"""
MindfulAI Voice Interface
Handles STT and TTS for audio-based interactions.
"""

from typing import Dict, Any
import io
import base64
import tempfile
import os
from elevenlabs.client import ElevenLabs
from elevenlabs import Voice, VoiceSettings
from core.logging import log

# Free + Offline Dependencies
try:
    from faster_whisper import WhisperModel
    HAS_WHISPER = True
except ImportError:
    HAS_WHISPER = False

try:
    import pyttsx3
    HAS_PYTTSX3 = True
except ImportError:
    HAS_PYTTSX3 = False

try:
    from gtts import gTTS
    HAS_GTTS = True
except ImportError:
    HAS_GTTS = False

class VoiceInterface:
    def __init__(self):
        self.whisper_model = None
        self.tts_engine = None
        self.eleven_client = None
        self.eleven_api_key = os.getenv("ELEVENLABS_API_KEY")
        
        if self.eleven_api_key:
            try:
                self.eleven_client = ElevenLabs(api_key=self.eleven_api_key)
                log.info("ElevenLabs Client initialized")
            except Exception as e:
                log.error(f"Failed to init ElevenLabs: {e}")

        log.info("VoiceInterface initialized in LAZY mode.")

    def _lazy_init_whisper(self):
        if self.whisper_model is None and HAS_WHISPER:
            log.info("VoiceInterface: Lazy-loading Whisper tiny model...")
            from faster_whisper import WhisperModel
            self.whisper_model = WhisperModel("tiny", device="cpu", compute_type="int8")
            log.info("VoiceInterface: ✅ Whisper Ready")

    def _lazy_init_tts(self):
        if self.tts_engine is None and HAS_PYTTSX3:
            log.info("VoiceInterface: Lazy-initializing pyttsx3...")
            import pyttsx3
            self.tts_engine = pyttsx3.init()
            self.tts_engine.setProperty('rate', 160)
            log.info("VoiceInterface: ✅ TTS Ready")

    async def speech_to_text(self, audio_bytes: bytes) -> str:
        self._lazy_init_whisper()
        """
        Converts clinical audio bytes to text using FasterWhisper (Offline STT).
        """
        if not HAS_WHISPER:
            log.warning("FasterWhisper not installed. Falling back to generic notification.")
            return "(Voice transcription unavailable offline)"
        
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
                tmp.write(audio_bytes)
                tmp_path = tmp.name

            segments, info = self.whisper_model.transcribe(tmp_path, beam_size=5)
            transcript = " ".join([segment.text for segment in segments])
            
            os.remove(tmp_path)
            return transcript.strip()
            
        except Exception as e:
            log.error(f"FasterWhisper STT Error: {e}")
            return "(System busy. Transcription failed.)"

    async def text_to_speech(self, text: str) -> str:
        self._lazy_init_tts()
        """
        Converts response text back to audio (base64) prioritizing ElevenLabs (Premium), 
        falling back to offline pyttsx3 or gTTS.
        """
        # 1. Primary: ElevenLabs (High Fidelity)
        if self.eleven_client:
            try:
                audio_gen = self.eleven_client.generate(
                    text=text,
                    voice=os.getenv("ELEVEN_VOICE_ID", "Rachel"),
                    model="eleven_multilingual_v2"
                )
                
                # audio_gen is a generator/iterator
                audio_data = b"".join(list(audio_gen))
                b64_str = base64.b64encode(audio_data).decode()
                return f"data:audio/mpeg;base64,{b64_str}"
            except Exception as e:
                log.error(f"ElevenLabs TTS Error: {e}")

        # 2. Secondary Offline TTS via pyttsx3
        if HAS_PYTTSX3:
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
                    tmp_path = tmp.name
                
                self.tts_engine.save_to_file(text, tmp_path)
                self.tts_engine.runAndWait()
                
                with open(tmp_path, "rb") as f:
                    audio_data = f.read()
                os.remove(tmp_path)
                
                b64_str = base64.b64encode(audio_data).decode()
                return f"data:audio/wav;base64,{b64_str}"
            except Exception as e:
                log.error(f"pyttsx3 Offline TTS Error: {e}")
        
        # 2. Fallback to gTTS (Standard Quality / Requires internet but free)
        if HAS_GTTS:
            try:
                tts = gTTS(text=text, lang='en')
                fp = io.BytesIO()
                tts.write_to_fp(fp)
                fp.seek(0)
                
                b64_str = base64.b64encode(fp.read()).decode()
                return f"data:audio/mp3;base64,{b64_str}"
            except Exception as e:
                log.error(f"gTTS Error: {e}")
        
        return ""

voice_interface = VoiceInterface()
