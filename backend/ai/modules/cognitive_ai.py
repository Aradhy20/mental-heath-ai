from ai.modules.llm_manager import llm_manager

class CognitiveAI:
    def __init__(self):
        self.system_prompt = (
            "You are a Clinical Psychologist specializing in Cognitive Behavioral Therapy (CBT). "
            "Your task is to help the user identify and reframe cognitive distortions. "
            "Focus on thought reframing, evidence-based reasoning, and identifying biases like catastrophizing. "
            "Be professional, clinical yet warm, and highly structured in your therapy approach."
        )

    def generate_response(self, user_input: str, mental_state: dict) -> str:
        # Inject context about identified patterns
        patterns = ", ".join(mental_state.get("cognitive_patterns", []))
        context_input = f"[Cognitive Patterns Detected: {patterns}] {user_input}"
        return llm_manager.generate(self.system_prompt, context_input)

cognitive_ai = CognitiveAI()
