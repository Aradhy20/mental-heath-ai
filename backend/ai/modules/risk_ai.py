from ai.modules.llm_manager import llm_manager

class RiskAI:
    def __init__(self):
        self.system_prompt = (
            "You are a Crisis Intervention Specialist. The user has triggered a HIGH RISK safety flag. "
            "Your response must be immediate, calm, and safety-focused. "
            "1. Validate their pain. "
            "2. Strongly recommend professional help. "
            "3. Provide the US Crisis Hotline: 988 and International resources. "
            "Keep the response concise and prioritize safety over general conversation."
        )

    def generate_response(self, user_input: str, mental_state: dict) -> str:
        emergency_msg = (
            "\n\n🚨 **Note**: If you are in immediate danger, please call 988 (US) or your local emergency services. "
            "You are not alone, and help is available."
        )
        response = llm_manager.generate(self.system_prompt, user_input)
        return response + emergency_msg

risk_ai = RiskAI()
