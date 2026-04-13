"""
Mental Health Chatbot Engine - MindfulAI 2.0
Intelligent conversational assistant using SmolLM2 (Local LLM)
"""

import os
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from typing import Dict, List, Optional
from datetime import datetime
import json

class ChatContext:
    """Manages conversation memory for the LLM"""
    def __init__(self, max_history: int = 5):
        self.history: List[Dict[str, str]] = []
        self.max_history = max_history

    def add_message(self, role: str, content: str):
        self.history.append({"role": role, "content": content})
        if len(self.history) > self.max_history * 2:
            # Keep system prompt if it exists, otherwise just slice
            self.history = self.history[-self.max_history * 2:]

    def get_messages(self) -> List[Dict[str, str]]:
        return self.history

class MentalHealthChatbot:
    """Intelligent mental health assistant using SmokLM2"""
    
    def __init__(self, model_id: str = "HuggingFaceTB/SmolLM2-135M-Instruct", device: str = None):
        """
        Initialize the LLM-based chatbot.
        Defaults to 135M for speed, can be upgraded to 1.7B.
        """
        if device is None:
            self.device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
        else:
            self.device = device
            
        print(f"Initializing Chatbot on {self.device} using {model_id}...")
        
        self.tokenizer = AutoTokenizer.from_pretrained(model_id)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_id, 
            torch_dtype=torch.float16 if self.device != "cpu" else torch.float32,
            device_map="auto" if self.device != "cpu" else None
        )
        
        self.system_prompt = (
            "You are MindfulAI, a compassionate and supportive mental health assistant. "
            "Your goal is to provide emotional support, listen without judgment, and suggest "
            "scientifically backed coping strategies for stress, anxiety, and sadness. "
            "Always be empathetic and encouraging. If a user expresses self-harm, gently "
            "recommend professional help and provide crisis resources (e.g., 988)."
        )
        
        self.contexts: Dict[str, ChatContext] = {}

    def _get_or_create_context(self, user_id: str) -> ChatContext:
        if user_id not in self.contexts:
            ctx = ChatContext()
            ctx.add_message("system", self.system_prompt)
            self.contexts[user_id] = ctx
        return self.contexts[user_id]

    def chat(self, user_input: str, user_id: str = "default") -> str:
        """Process user input and generate a supportive response"""
        context = self._get_or_create_context(user_id)
        context.add_message("user", user_input)
        
        # Format messages for the model
        messages = context.get_messages()
        
        # Generate response
        inputs = self.tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_tensors="pt")
        
        if isinstance(inputs, torch.Tensor):
            input_ids = inputs.to(self.device)
            attention_mask = None
        else:
            input_ids = inputs["input_ids"].to(self.device)
            attention_mask = inputs.get("attention_mask")
            if attention_mask is not None:
                attention_mask = attention_mask.to(self.device)

        with torch.no_grad():
            outputs = self.model.generate(
                input_ids=input_ids,
                attention_mask=attention_mask,
                max_new_tokens=256, 
                temperature=0.7, 
                top_p=0.9,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id
            )
            input_length = input_ids.shape[1]
            
        response_text = self.tokenizer.decode(outputs[0][input_length:], skip_special_tokens=True)
        
        # Cleanup and store
        response_text = response_text.strip()
        context.add_message("assistant", response_text)
        
        return response_text

    def get_mood_analysis(self, user_input: str) -> Dict:
        """Zero-shot mood analysis using the same LLM"""
        analysis_prompt = (
            f"Analyze the following user input and return a JSON object with 'mood' "
            f"(very_positive, positive, neutral, negative, very_negative) and 'confidence' (0-1).\n"
            f"Input: \"{user_input}\"\nJSON:"
        )
        
        inputs = self.tokenizer(analysis_prompt, return_tensors="pt").to(self.device)
        
        with torch.no_grad():
            outputs = self.model.generate(inputs.input_ids, max_new_tokens=50, temperature=0.1)
            
        raw_result = self.tokenizer.decode(outputs[0][len(inputs.input_ids[0]):], skip_special_tokens=True)
        
        try:
            # Attempt to parse JSON from the response
            start_idx = raw_result.find('{')
            end_idx = raw_result.rfind('}') + 1
            if start_idx != -1 and end_idx != -1:
                return json.loads(raw_result[start_idx:end_idx])
            return {"mood": "neutral", "confidence": 0.5, "error": "parse_failure"}
        except:
            return {"mood": "neutral", "confidence": 0.5}

# Simplified fallback for development/demo
class LegacyMoodSupport:
    @staticmethod
    def get_resources():
        return """
**Mental Health Resources:**
🆘 **Crisis Support:**
- National Suicide Prevention Lifeline: **988**
- Crisis Text Line: Text **HOME** to **741741**
"""

if __name__ == "__main__":
    # Quick test
    bot = MentalHealthChatbot(model_id="HuggingFaceTB/SmolLM2-135M-Instruct")
    print("Bot initialized. Ready to chat.")
    
    test_inputs = [
        "Hi, I've been feeling really stressed lately with work.",
        "What can I do to feel better?",
        "Thank you, that helps."
    ]
    
    for inp in test_inputs:
        print(f"\nUser: {inp}")
        res = bot.chat(inp)
        print(f"MindfulAI: {res}")
    
    print(f"\n\n{LegacyMoodSupport.get_resources()}")
