import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from typing import List, Dict

class LLMManager:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LLMManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized: return
        
        self.model_id = "HuggingFaceTB/SmolLM2-135M-Instruct"
        self.device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
        
        print(f"🚀 Loading MindfulAI Engine ({self.model_id}) on {self.device}...")
        
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_id)
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_id, 
            torch_dtype=torch.float16 if self.device != "cpu" else torch.float32,
            device_map="auto" if self.device != "cpu" else None
        )
        self._initialized = True

    def generate(self, system_prompt: str, user_input: str, history: List[Dict[str, str]] = None) -> str:
        messages = [{"role": "system", "content": system_prompt}]
        if history:
            messages.extend(history[-4:]) # Last 2 turns
        messages.append({"role": "user", "content": user_input})
        
        inputs = self.tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_tensors="pt")
        input_ids = inputs.to(self.device)
        
        with torch.no_grad():
            outputs = self.model.generate(
                input_ids=input_ids,
                max_new_tokens=256,
                temperature=0.7,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id
            )
            
        response = self.tokenizer.decode(outputs[0][input_ids.shape[1]:], skip_special_tokens=True)
        return response.strip()

llm_manager = LLMManager()
