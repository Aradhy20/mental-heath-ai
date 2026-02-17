"""
Conversation Manager
Handles multi-turn dialogue, context retention, and conversation history
"""

from typing import List, Dict, Optional
from datetime import datetime
import json

class ConversationManager:
    """Manages conversation context and history"""
    
    def __init__(self, max_context_length: int = 10):
        self.conversations: Dict[int, List[Dict]] = {}  # {user_id: [messages]}
        self.max_context_length = max_context_length
    
    def add_message(self, user_id: int, role: str, content: str, metadata: Optional[Dict] = None):
        """
        Add a message to conversation history
        
        Args:
            user_id: User identifier
            role: 'user' or 'assistant'
            content: Message content
            metadata: Optional metadata (emotion, timestamp, etc.)
        """
        if user_id not in self.conversations:
            self.conversations[user_id] = []
        
        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat(),
            "metadata": metadata or {}
        }
        
        self.conversations[user_id].append(message)
        
        # Keep only recent messages within context window
        if len(self.conversations[user_id]) > self.max_context_length * 2:
            self.conversations[user_id] = self.conversations[user_id][-(self.max_context_length * 2):]
    
    def get_conversation_history(self, user_id: int, limit: Optional[int] = None) -> List[Dict]:
        """Get conversation history for a user"""
        if user_id not in self.conversations:
            return []
        
        history = self.conversations[user_id]
        if limit:
            return history[-limit:]
        return history
    
    def get_context_for_llm(self, user_id: int) -> List[Dict]:
        """
        Get formatted context for LLM
        Returns list of {role, content} dicts
        """
        history = self.get_conversation_history(user_id, limit=self.max_context_length)
        return [{"role": msg["role"], "content": msg["content"]} for msg in history]
    
    def clear_conversation(self, user_id: int):
        """Clear conversation history for a user"""
        if user_id in self.conversations:
            self.conversations[user_id] = []
    
    def get_conversation_summary(self, user_id: int) -> Dict:
        """Get summary of conversation"""
        if user_id not in self.conversations:
            return {"message_count": 0, "last_message": None}
        
        history = self.conversations[user_id]
        return {
            "message_count": len(history),
            "last_message": history[-1] if history else None,
            "start_time": history[0]["timestamp"] if history else None,
            "user_messages": len([m for m in history if m["role"] == "user"]),
            "assistant_messages": len([m for m in history if m["role"] == "assistant"])
        }
    
    def export_conversation(self, user_id: int) -> str:
        """Export conversation as JSON string"""
        history = self.get_conversation_history(user_id)
        return json.dumps(history, indent=2)
    
    def import_conversation(self, user_id: int, conversation_json: str):
        """Import conversation from JSON string"""
        history = json.loads(conversation_json)
        self.conversations[user_id] = history

# Global conversation manager instance
conversation_manager = ConversationManager()

if __name__ == "__main__":
    # Test conversation manager
    manager = ConversationManager(max_context_length=5)
    
    # Simulate conversation
    manager.add_message(1, "user", "I'm feeling anxious today")
    manager.add_message(1, "assistant", "I understand you're feeling anxious. Would you like to talk about what's causing this?")
    manager.add_message(1, "user", "It's about work and upcoming deadlines")
    
    # Get context
    context = manager.get_context_for_llm(1)
    print("Context for LLM:")
    for msg in context:
        print(f"  {msg['role']}: {msg['content']}")
    
    # Get summary
    summary = manager.get_conversation_summary(1)
    print(f"\nConversation Summary: {summary}")
