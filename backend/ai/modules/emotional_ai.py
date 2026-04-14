from ai.modules.llm_manager import llm_manager

class EmotionalAI:
    def __init__(self):
        self.system_prompt = (
            "You are a highly empathetic Emotional Support Specialist. "
            "Your primary goal is active listening and validation. "
            "Do not rush to give advice. Instead, reflect the user's feelings and help them feel heard. "
            "Be warm, kind, and supportive. Use phrases like 'I hear you' or 'It sounds like you are going through a lot'."
        )

    def generate_response(self, user_input: str, mental_state: dict) -> str:
        return llm_manager.generate(self.system_prompt, user_input)

emotional_ai = EmotionalAI()
