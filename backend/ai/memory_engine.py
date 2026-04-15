"""
MindfulAI Memory Engine (The Digital Twin)
Orchestrates long-term emotional memory and theme abstraction.
"""

from typing import List, Dict, Optional, Any
from .text_service.vector_db_enhanced import vector_db
import logging

logger = logging.getLogger(__name__)

class MemoryEngine:
    def __init__(self):
        self.db = vector_db

    async def store_snapshot(self, user_id: str, text: str, emotional_state: Dict[str, Any]):
        """
        Stores an emotional snapshot with abstracted themes for privacy.
        """
        try:
            # Simple numeric ID conversion if needed, assumed string user_id is compatible
            id_val = int(user_id) if user_id.isdigit() else 1
            
            # Abstraction: instead of exact text, we could store themes
            # For now, we store text + metadata
            primary_emotion = emotional_state.get("primary_emotion", "neutral")
            
            metadata = {
                "valence": emotional_state.get("valence", 0.5),
                "stress": emotional_state.get("stress_score", 0.5),
                "risk": emotional_state.get("risk_level", "low")
            }
            
            self.db.add_user_memory(
                user_id=id_val,
                text=text,
                emotion=primary_emotion,
                metadata=metadata
            )
            return True
        except Exception as e:
            logger.error(f"Failed to store memory: {e}")
            return False

    async def get_digital_twin_context(self, user_id: str, query: str) -> Optional[str]:
        """
        Retrieves relevant historical context to personalize the conversation.
        """
        try:
            id_val = int(user_id) if user_id.isdigit() else 1
            memories = self.db.get_user_context(id_val, query, n_results=3)
            
            if not memories:
                return None
            
            # Construct a memory summary
            context_bits = []
            for m in memories:
                emotion = m['metadata'].get('emotion', 'unknown')
                context_bits.append(f"- On {m['metadata'].get('timestamp', 'past')}, user felt {emotion} regarding: \"{m['text'][:100]}...\"")
            
            summary = "Recent relevant memories:\n" + "\n".join(context_bits)
            return summary
        except Exception as e:
            logger.error(f"Failed to retrieve memory: {e}")
            return None

# Singleton instance
memory_engine = MemoryEngine()
