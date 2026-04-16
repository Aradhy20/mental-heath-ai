from crewai import Agent, Task, Crew, Process
from langchain_community.chat_models import ChatOllama
import os

# Initialize Local Open-Source LLM (Ollama)
# Ensure Ollama is running at http://localhost:11434
llm = ChatOllama(model="llama3", base_url="http://localhost:11434")

class ClinicalAgents:
    """
    Expert Agent Registry for MindfulAI Multi-Agent System.
    Based on Clinical Psychology and Behavioral Neuroscience.
    """
    
    @staticmethod
    def cognitive_therapist():
        return Agent(
            role='Cognitive Therapist',
            goal='Identify cognitive distortions and help the user reframe negative thought patterns.',
            backstory="""You are an expert Cognitive Behavioral Therapist (CBT). 
            You excel at spotting overthinking, black-and-white thinking, and anxiety patterns. 
            Your behavior is analytical but gentle. You ask reflective questions to encourage self-awareness.""",
            verbose=True,
            allow_delegation=False,
            llm=llm
        )

    @staticmethod
    def emotional_support():
        return Agent(
            role='Emotional Support Specialist',
            goal='Validate feelings and provide a warm, non-judgmental space for emotional expression.',
            backstory="""You are a highly empathetic counselor focused on stress, sadness, and emotional validation. 
            You ensure the user feels heard and supported. Your style is warm and non-judgmental.""",
            verbose=True,
            allow_delegation=False,
            llm=llm
        )

    @staticmethod
    def risk_monitor():
        return Agent(
            role='Risk & Safety Monitor',
            goal='Detect mental health crisis, self-harm, or suicide risk and prioritize safety.',
            backstory="""You are a Mental Health Risk Detection AI. Your sole focus is user safety. 
            You detect severe distress or crisis signals. You override other agents if risk is detected. 
            You respond calmly and encourage professional help.""",
            verbose=True,
            allow_delegation=True,
            llm=llm
        )

    @staticmethod
    def behavioral_analyst():
        return Agent(
            role='Neurological & Behavioral Analyst',
            goal='Analyze sleep, energy, and behavioral patterns to provide data-driven insights.',
            backstory="""You are an expert in behavioral neuroscience. You look for links between habits (sleep, activity) and mood. 
            You detect deviations from baseline and always justify insights using user data.""",
            verbose=True,
            allow_delegation=False,
            llm=llm
        )

    @staticmethod
    def routine_coach():
        return Agent(
            role='Lifestyle & Productivity Coach',
            goal='Suggest small actionable steps to reduce burnout and improve consistency.',
            backstory="""You are a practical habit coach. You focus on burnout, routine, and micro-actions. 
            You break large tasks into manageable pieces. Your style is practical and motivating.""",
            verbose=True,
            allow_delegation=False,
            llm=llm
        )

class AgentOrchestrator:
    """
    Manages the collaboration and communication between clinical agents.
    """
    def __init__(self):
        self.agents = ClinicalAgents()

    async def generate_response(self, user_input: str, context_data: dict) -> str:
        # Create Agents
        therapist = self.agents.cognitive_therapist()
        support = self.agents.emotional_support()
        risk = self.agents.risk_monitor()
        analyst = self.agents.behavioral_analyst()
        coach = self.agents.routine_coach()

        # Define Tasks
        analysis_task = Task(
            description=f"Analyze user input: '{user_input}' using the provided context: {context_data}. "
                        "Identify emotional state, stress level, and any behavioral patterns mentioned.",
            agent=analyst,
            expected_output="An analysis of the user's mental and behavioral state based on data."
        )

        safety_task = Task(
            description="Check the analysis and user input for any high-risk signals or crisis indicators.",
            agent=risk,
            expected_output="A safety assessment. If risk is high, generate an escalation message."
        )

        therapeutic_task = Task(
            description="Based on the analysis and safety check, generate a unified therapeutic response. "
                        "Combine insights from CBT, emotional validation, and behavioral coaching. "
                        "The response must be unified, human-like, and data-driven.",
            agent=therapist,
            context=[analysis_task, safety_task],
            expected_output="A single unified response for the user that combines all agent insights."
        )

        # Execute Crew
        crew = Crew(
            agents=[analyst, risk, therapist, support, coach],
            tasks=[analysis_task, safety_task, therapeutic_task],
            process=Process.sequential,
            verbose=True
        )

        result = crew.kickoff()
        return result

orchestrator = AgentOrchestrator()
