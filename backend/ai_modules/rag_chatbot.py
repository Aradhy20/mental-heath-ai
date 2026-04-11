import os
import random
import torch
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
from dotenv import load_dotenv

load_dotenv()

# ─────────────────────────────────────────────────────────────────────────────
# Local LLM Configuration (Zero API Dependencies)
# ─────────────────────────────────────────────────────────────────────────────
MODEL_NAME = "HuggingFaceTB/SmolLM2-135M-Instruct"
_text_generator = None

def get_generator():
    """Lazy load the local LLM to save memory."""
    global _text_generator
    if _text_generator is None:
        print(f"Loading Local AI Model ({MODEL_NAME})...")
        device = "mps" if torch.backends.mps.is_available() else "cpu"
        # We use a very small model (135M) for maximum speed on local hardware
        _text_generator = pipeline(
            "text-generation",
            model=MODEL_NAME,
            device=device,
            torch_dtype=torch.float16 if device == "mps" else torch.float32
        )
    return _text_generator

# ─────────────────────────────────────────────────────────────────────────────
# Persona System Prompts
# ─────────────────────────────────────────────────────────────────────────────
PERSONAS = {
    "companion": """You are Mia, a warm and emotionally intelligent AI companion. You communicate as a caring, empathetic best friend. 
- Use gentle, informal language.
- Share encouragement and validate emotions first.
- Keep responses concise (2-3 sentences).""",

    "psychologist": """You are Dr. Priya, a compassionate virtual psychologist. You use CBT and DBT techniques.
- Begin by validating feelings.
- Use reflective listening.
- Offer ONE focused follow-up question.
- Professional, warm tone.
- Disclaim: 'This is an AI support tool, not clinical care.'""",

    "guide": """You are Arya, a calm mindfulness guide. 
- Offer actionable mindfulness and grounding exercises.
- Serene and encouraging tone.
- Use bullet points for techniques.""",

    "neurologist": """You are Dr. Ravi, a neuroscience expert.
- Explain the brain science behind stress and emotions.
- Educational and compassionate tone.""",

    "career": """You are Alex, an AI career counselor.
- Direct, pragmatic, and optimistic advice.
- Focus on growth and energy management."""
}

# ─────────────────────────────────────────────────────────────────────────────
# Smart Fallback (Deterministic backup)
# ─────────────────────────────────────────────────────────────────────────────
FALLBACK_RESPONSES = [
    "I'm here for you. Can you tell me more about what's on your mind?",
    "That sounds like a lot to handle. How are you processing this right now?",
    "I'm listening. Whatever you're feeling is valid."
]

# ─────────────────────────────────────────────────────────────────────────────
# Main Chat Function (100% Local Inference)
# ─────────────────────────────────────────────────────────────────────────────
async def chat_with_persona(user_input: str, persona: str, history: list) -> str:
    """
    Generates a response using the local Hugging Face LLM.
    Zero external API calls.
    """
    system_prompt = PERSONAS.get(persona, PERSONAS["companion"])
    
    try:
        generator = get_generator()
        
        # Build prompt in Instruct format
        # Format: <|im_start|>system\n{prompt}<|im_end|>\n<|im_start|>user\n{input}<|im_end|>\n<|im_start|>assistant\n
        prompt = f"<|im_start|>system\n{system_prompt}<|im_end|>\n"
        
        # Add limited history for context
        for h in history[-3:]:
            role = "user" if h["role"] == "user" else "assistant"
            prompt += f"<|im_start|>{role}\n{h['content']}<|im_end|>\n"
            
        prompt += f"<|im_start|>user\n{user_input}<|im_end|>\n<|im_start|>assistant\n"

        # Generate
        output = generator(
            prompt, 
            max_new_tokens=150, 
            do_sample=True, 
            temperature=0.7, 
            top_p=0.9,
            repetition_penalty=1.2,
            pad_token_id=generator.tokenizer.eos_token_id
        )
        
        full_text = output[0]['generated_text']
        # Extract only the assistant's part
        response = full_text.split("<|im_start|>assistant\n")[-1].split("<|im_end|>")[0].strip()
        
        if not response:
            return random.choice(FALLBACK_RESPONSES)
            
        return response

    except Exception as e:
        print(f"Local AI Inference Error: {e}")
        return random.choice(FALLBACK_RESPONSES)
