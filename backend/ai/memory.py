"""
MindfulAI Memory System
Maintains conversation history and emotional context per session.
"""

from typing import List, Dict
import datetime
from core.logging import log

class MemorySystem:
    def __init__(self):
        # In-memory store (In production, this would be MongoDB/Redis)
        self.storage: Dict[str, List[Dict]] = {}
        log.info("MemorySystem Initialized")

    def get_history(self, user_id: str) -> List[Dict]:
        """
        Retrieves the last 10 messages for context.
        """
        if user_id not in self.storage:
            return []
        return self.storage[user_id][-10:]

    def add_entry(self, user_id: str, role: str, content: str):
        """
        Adds a message to the user's conversation history.
        """
        if user_id not in self.storage:
            self.storage[user_id] = []
            
        self.storage[user_id].append({
            "role": role,
            "content": content,
            "timestamp": datetime.datetime.now().isoformat()
        })
        
        # Limit history size to prevent memory leaks
        if len(self.storage[user_id]) > 50:
            self.storage[user_id] = self.storage[user_id][-50:]

    def clear(self, user_id: str):
        if user_id in self.storage:
            del self.storage[user_id]

memory = MemorySystem()
