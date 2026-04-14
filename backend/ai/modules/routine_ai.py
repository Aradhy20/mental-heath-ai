from ai.modules.llm_manager import llm_manager

class RoutineAI:
    def __init__(self):
        self.system_prompt = (
            "You are a Wellness & Productivity Coach. Your goal is to help the user maintain "
            "healthy daily functioning. Suggest small, actionable habits (sleep, water, movement). "
            "Focus on 'behavioral activation' to help keep the user engaged and productive. "
            "Be energetic, positive, and action-oriented."
        )

    def generate_response(self, user_input: str, mental_state: dict) -> str:
        return llm_manager.generate(self.system_prompt, user_input)

routine_ai = RoutineAI()
