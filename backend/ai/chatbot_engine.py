"""
MindfulAI Chatbot Engine — Performance Optimized v3.1
Pipeline: Parallel Inference → Fusion → Risk → Parallel DB+RAG → Stream
"""
import asyncio
from typing import Dict, Any, AsyncGenerator

import numpy as np
from sqlalchemy.ext.asyncio import AsyncSession

from ai.mental_engine import mental_engine          # noqa: F401 (keep import for side-effects)
from ai.risk_detector import risk_detector
from ai.emotion_model import emotion_model          # Trained DistilBERT emotion classifier
from ai.risk_model import risk_model                # Trained DistilBERT risk classifier
from ml.engines.inference_manager import inference_manager
from ml.engines.fusion_engine import MultimodalFusionEngine
from ai.memory import memory
from core.logging import log
from models import MoodLog
try:
    from langsmith import traceable
except ImportError:
    def traceable(*args, **kwargs):
        return lambda f: f


# ── Module-level singletons (loaded once, reused forever) ──────────────────────
fusion_engine = MultimodalFusionEngine()

EMOTION_LABELS = ["happy", "sad", "anxious", "angry", "neutral"]
RISK_LABELS    = ["low", "moderate", "high"]

# ── Response cache: avoid re-computing near-identical queries ──────────────────
# Simple LRU-style dict: {message_hash: (emotion, risk, fused_state)}
_INFERENCE_CACHE: Dict[int, tuple] = {}
_CACHE_MAX = 128  # max entries; prevents unbounded growth


def _hash_input(message: str) -> int:
    """Stable hash of the first 80 chars of a message for cache keying."""
    return hash(message[:80].lower().strip())


class ChatbotEngine:
    def __init__(self):
        log.info("ChatbotEngine v3.1 Initialized — Parallel Inference + Cache + Stream")

    @traceable(name="MindfulAI Core Pipeline", run_type="chain")
    async def get_response_stream(
        self,
        user_id: str,
        message: str,
        bio_data: dict = None,
        db: AsyncSession = None,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Optimized streaming pipeline:
        - Parallel multimodal inference
        - Parallel DB + RAG fetch
        - Deduplicated memory.get_history() call
        - Zero blocking in the async event loop
        """
        bio_data = bio_data or {}
        loop = asyncio.get_running_loop()  # ✅ Not deprecated get_event_loop()

        # Voice input fallback for empty text
        if not message.strip() and bio_data.get("audio_features"):
            message = "*User is using voice input but no transcription was provided. Please respond warmly, acknowledging their voice and asking them to elaborate or checking on how they sound.*"

        # ── STEP 1: MULTIMODAL INFERENCE (parallel via thread pool) ───────────
        msg_hash = _hash_input(message)

        if msg_hash in _INFERENCE_CACHE:
            # Cache HIT — skip all ML inference entirely
            text_emo_prob, text_risk_prob, fused_state, fused_emotion = _INFERENCE_CACHE[msg_hash]
            log.info(f"[Cache] HIT for hash={msg_hash}")
        else:
            # Gather text + optional audio/face in parallel
            _default_audio = np.array([0.2] * 5)
            _default_face  = np.array([0.2] * 5)

            audio_task = (
                loop.run_in_executor(None, inference_manager.predict_audio, np.array(bio_data["audio_features"], dtype=np.float32))
                if bio_data.get("audio_features") is not None
                else asyncio.coroutine(lambda: _default_audio)()
            )
            face_task = (
                loop.run_in_executor(None, inference_manager.predict_face, np.array(bio_data["face_landmarks"], dtype=np.float32))
                if bio_data.get("face_landmarks") is not None
                else asyncio.coroutine(lambda: _default_face)()
            )
            text_task = loop.run_in_executor(None, inference_manager.predict_text, message)

            (text_result, audio_prob, face_prob) = await asyncio.gather(
                text_task, audio_task, face_task
            )

            # Fix: safe numpy tuple check — avoid ambiguous equality with arrays
            if text_result is not None and not (
                isinstance(text_result, tuple) and
                len(text_result) == 2 and
                text_result[0] is None and text_result[1] is None
            ):
                text_emo_prob, text_risk_prob = text_result
            else:
                text_emo_prob  = np.array([0.1] * 4 + [0.6])
                text_risk_prob = np.array([0.9, 0.05, 0.05])
            audio_prob = audio_prob if audio_prob is not None else _default_audio
            face_prob  = face_prob  if face_prob  is not None else _default_face

            face_conf    = float(bio_data.get("face_confidence", 0.0))
            fused_state  = fusion_engine.fuse_current_state(text_emo_prob, audio_prob, face_prob, face_confidence=face_conf)
            fused_emotion = fusion_engine.predict_emotion(fused_state)

            # Store in cache (evict oldest if full)
            if len(_INFERENCE_CACHE) >= _CACHE_MAX:
                oldest_key = next(iter(_INFERENCE_CACHE))
                del _INFERENCE_CACHE[oldest_key]
            _INFERENCE_CACHE[msg_hash] = (text_emo_prob, text_risk_prob, fused_state, fused_emotion)

        # ── STEP 1b: TRAINED EMOTION + RISK MODELS (high-precision override) ────
        # Run the trained DistilBERT models alongside the fusion engine
        emotion_result = await loop.run_in_executor(None, emotion_model.predict, message)
        risk_result    = await loop.run_in_executor(None, risk_model.predict, message)
        trained_emotion = emotion_result["emotion"]
        emotion_conf    = emotion_result["confidence"]
        risk_level_ml   = risk_result["risk_level"]
        risk_conf       = risk_result["confidence"]
        is_crisis_ml    = risk_result["is_crisis"]
        log.info(f"TrainedModels → emotion={trained_emotion}({emotion_conf:.2f}) risk={risk_level_ml}({risk_conf:.2f})")

        # ── STEP 2: RISK (trained model takes priority, keyword is safety fallback) ─
        risk_level = risk_level_ml
        is_crisis  = is_crisis_ml
        if not is_crisis:
            is_crisis_kw, _ = risk_detector.check_risk(message)
            if is_crisis_kw:
                is_crisis, risk_level = True, "high"

        # Use trained emotion as primary; fused_emotion as secondary for loneliness/fatigue
        primary_emotion = trained_emotion if emotion_result["source"] == "model" else fused_emotion

        # Loneliness / fatigue signal injection (CPU, trivial cost)
        _LONELINESS = ["feel alone","nobody cares","no one understands","isolated","lonely","no friends","invisible","no one to talk to","by myself"]
        _FATIGUE    = ["so tired","drained","burned out","burnt out","exhausted emotionally","can't keep going","running on empty","nothing left","too much"]
        msg_lower = message.lower()
        if any(s in msg_lower for s in _LONELINESS):
            fused_emotion = "lonely"
        elif any(s in msg_lower for s in _FATIGUE):
            fused_emotion = "fatigue"

        # ── STEP 3: PARALLEL DB + RAG FETCH ───────────────────────────────────
        # Run DB query and RAG vector search simultaneously
        async def _fetch_db_context() -> str:
            if not (db and user_id != "guest"):
                return _guest_primer(fused_emotion) if user_id == "guest" else ""
            try:
                from sqlalchemy import select
                from models import JournalEntry, DBWearableData
                # Both queries in parallel with proper ORDER BY
                m_q = select(MoodLog).where(MoodLog.user_id == user_id).order_by(MoodLog.created_at.desc()).limit(3)
                j_q = select(JournalEntry).where(JournalEntry.user_id == user_id).order_by(JournalEntry.created_at.desc()).limit(2)
                w_q = select(DBWearableData).where(DBWearableData.user_id == user_id).order_by(DBWearableData.created_at.desc()).limit(1)
                
                m_res, j_res, w_res = await asyncio.gather(db.execute(m_q), db.execute(j_q), db.execute(w_q))
                moods    = m_res.scalars().all()
                journals = j_res.scalars().all()
                wearable = w_res.scalars().first()
                
                parts = []
                if moods:    parts.append("Recent Moods (1-5 scale): " + " | ".join([f"{m.score}/5" for m in moods]))
                if journals: parts.append("Recent Journals: " + " | ".join([j.content[:100] for j in journals]))
                if wearable: parts.append(f"Wearable Data: Heart Rate={wearable.heart_rate}bpm, Sleep={wearable.sleep_hours}h, Activity={wearable.activity_level}")
                return "\n".join(parts)
            except Exception as e:
                log.error(f"[DB] Context fetch failed: {e}")
                return ""

        async def _fetch_rag_context() -> str:
            try:
                from ai.text_service.rag import rag_system
                # RAG similarity_search is synchronous — run in thread
                docs = await loop.run_in_executor(
                    None, lambda: rag_system.retrieve_relevant_context(message, k=2)
                )
                return "\n".join([d["content"][:200] for d in docs]) if docs else ""
            except Exception as e:
                log.error(f"[RAG] Retrieval failed: {e}")
                return ""

        # Fire both in parallel
        user_recent_data, psych_context = await asyncio.gather(
            _fetch_db_context(), _fetch_rag_context()
        )

        # ── STEP 4: MODE SELECTION ─────────────────────────────────────────────
        from ai.decision_engine import decision_engine
        LONELINESS_MODES = {"lonely": "SUPPORT", "fatigue": "SUPPORT"}
        selected_mode = (
            "CRISIS" if is_crisis
            else LONELINESS_MODES.get(primary_emotion)
            or decision_engine.select_mode({
                "emotion":    primary_emotion,
                "risk_level": risk_level.upper(),
                "score":      float(np.max(fused_state)),
            })
        )

        # ── STEP 5: BUILD PROMPT (single call to get_system_prompt) ───────────
        from ai.conversation_engine import conversation_engine
        from ai.llm_manager import llm_manager

        # ✅ Persistent: call memory.get_history() asynchronously
        chat_history = await memory.get_history(user_id, db)

        context_data = {
            "user_id":      user_id,
            "recent_moods": user_recent_data,
            "digital_twin_memory": {
                "weekly_insight": psych_context[:200] if psych_context else "",
                "prediction":     {},
            },
            "emotion_confidence": emotion_conf,
            "risk_level":         risk_level,
            "risk_confidence":    risk_conf,
        }

        prompt_pkg = await conversation_engine.get_system_prompt(
            message, selected_mode, chat_history, primary_emotion, context_data
        )

        # History as text — use the already-fetched chat_history
        history_text = "\n".join(
            [f"{m['role'].upper()}: {m['content']}" for m in chat_history[-4:]]
        ) if chat_history else ""
        full_input = f"{history_text}\nUSER: {message}" if history_text else message

        # ── STEP 6: YIELD METADATA IMMEDIATELY (zero-latency first frame) ─────
        yield {
            "type":             "metadata",
            "emotion":          primary_emotion,
            "emotion_source":   emotion_result["source"],
            "confidence":       emotion_conf,
            "risk":             risk_level,
            "risk_confidence":  risk_conf,
            "mode":             prompt_pkg["mode"],
            "action":           prompt_pkg["suggested_action"],
        }

        # ── STEP 7: STREAM LLM TOKENS ─────────────────────────────────────────
        full_reply = ""
        async for token in llm_manager.generate_response_stream(
            prompt_pkg["system_prompt"], full_input
        ):
            full_reply += token
            yield {"type": "token", "content": token}

        # ── STEP 8: POST-PROCESS (persistent storage) ────────────────────────
        await memory.add_entry(user_id, "user",      message, db)
        await memory.add_entry(user_id, "assistant", full_reply.strip(), db)

        if db and user_id != "guest":
            # Update digital twin in background
            asyncio.create_task(
                _update_digital_twin(user_id, message, primary_emotion, db)
            )


async def _update_digital_twin(user_id: str, message: str, emotion: str, db: AsyncSession):
    """Fire-and-forget digital twin update — does NOT block the stream."""
    try:
        from ai.digital_twin import digital_twin
        await digital_twin.update_from_interaction(user_id, message, emotion, db)
    except Exception as e:
        log.error(f"[DigitalTwin] Non-fatal update error: {e}")


def _guest_primer(emotion: str) -> str:
    primers = {
        "sad":     "I can hear something is weighing on you. This is a safe space.",
        "anxious": "You're safe here. Let's slow things down together.",
        "angry":   "It makes sense to feel this way. Let's look at this together.",
        "happy":   "I'm glad you're here. What's on your mind?",
        "neutral": "I'm here and listening. What brought you here today?",
    }
    return f"[First contact] {primers.get(emotion, 'Welcome. What would you like to talk about?')}"


chatbot_engine = ChatbotEngine()
