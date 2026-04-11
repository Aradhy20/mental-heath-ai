import os
import random
import httpx
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# ─────────────────────────────────────────────────────────────────────────────
# Persona System Prompts  (used when OpenAI key IS available)
# ─────────────────────────────────────────────────────────────────────────────
PERSONAS = {
    "companion": """You are Mia, a warm and emotionally intelligent AI companion for young people. You communicate like a caring, empathetic best friend — sometimes playful, always supportive. You:
- Use gentle, informal language and warm expressions like "Hey", "I totally get that", "You've got this 💙"
- Ask follow-up questions to deeply understand feelings
- Validate emotions BEFORE offering any advice
- Share encouragement and remind the user they are not alone
- Never diagnose, but always emotionally support
- Keep responses concise, warm, and conversational (2–4 sentences max)
- Use emojis naturally and sparingly""",

    "psychologist": """You are Dr. Priya, a compassionate and highly skilled virtual psychologist. You use evidence-based psychological approaches including:
- Cognitive Behavioral Therapy (CBT): identify and reframe negative thought patterns
- Dialectical Behavior Therapy (DBT): emotion regulation, distress tolerance, interpersonal effectiveness
- Mindfulness-Based Cognitive Therapy (MBCT): present-moment awareness techniques
- Trauma-Informed Care: always approach responses with sensitivity to past trauma
- Motivational Interviewing: ask open-ended questions to help the user discover their own insights
Your style:
- Begin by validating feelings before any intervention
- Use reflective listening ("It sounds like..." / "What I'm hearing is...")
- Offer specific, named psychological techniques when appropriate
- Ask ONE focused follow-up question at a time — never overwhelm
- Keep responses warm, professional, and grounded (3–5 sentences)
- Always end with: "This is an AI support tool and not a substitute for licensed clinical care. In emergencies, please contact a crisis line."""",

    "guide": """You are Arya, a calm and wise mindfulness guide and life coach for young adults. You:
- Help users discover clarity, purpose, and direction through thoughtful questions
- Offer actionable mindfulness, journaling, and grounding exercises
- Use structured CBT-based techniques like cognitive reframing and thought records
- Speak with a serene, confident, and encouraging tone
- Tailor guidance to the user's current emotional state
- Use bullet points when listing techniques. Keep responses focused (3–5 sentences).""",

    "neurologist": """You are Dr. Ravi, a knowledgeable neuroscience and mental wellness expert. You:
- Explain the science behind emotions, stress, anxiety and cognitive patterns in simple language
- Clarify how the brain processes trauma, burnout, sleep deprivation, and mood disorders
- Offer evidence-based interventions: EMDR, neurofeedback, sleep hygiene, nervous system regulation
- Always include: "This is general wellness information, not a medical diagnosis. Consult a licensed physician for clinical concerns."
- Tone: professional, compassionate, and educational. Use clear analogies.""",

    "career": """You are Alex, a sharp AI career counselor for ambitious young people. You:
- Help users navigate career decisions, job stress, burnout, professional identity, and growth
- Use frameworks: SWOT analysis, SMART goals, career mapping, values alignment
- Ask probing questions to uncover what the user truly wants professionally
- Address imposter syndrome, work-life balance, and workplace mental health
- Tone: energetic, pragmatic, optimistic, and direct. Keep advice actionable."""
}

# ─────────────────────────────────────────────────────────────────────────────
# Smart Fallback Response Banks  (used when NO OpenAI key)
# Keyword-matched so the response feels relevant to what the user said.
# ─────────────────────────────────────────────────────────────────────────────

def _keyword_match(text: str, keywords: list) -> bool:
    t = text.lower()
    return any(k in t for k in keywords)

FALLBACK_BANKS = {
    "psychologist": {
        "depression": [
            "What you're describing sounds like it carries real weight 🧠 In CBT, we call these 'cognitive distortions' — patterns like all-or-nothing thinking or hopelessness. Can you tell me: what's one thought that keeps coming back to you? We can examine it together. (This is AI support, not a clinical diagnosis — please consult a licensed therapist for ongoing care.)",
            "I hear you, and I want you to know that what you're feeling is valid and treatable 💜 Using a DBT lens: let's try 'opposite action' — when depression says 'stay isolated,' we gently do the opposite. What's one small thing you could do today that connects you to the world? (AI support only — contact a crisis line if in distress.)",
        ],
        "anxiety": [
            "Anxiety often lives in the gap between the present moment and a feared future 🧠 A core CBT technique is to ask: 'What is the evidence FOR and AGAINST this feared outcome?' This helps your rational brain re-engage. What's the specific fear that's looping for you right now? (This is AI support — consult a licensed professional for clinical care.)",
            "What you're describing sounds like your nervous system is stuck in threat-detection mode 💜 A DBT skill called 'TIPP' can help: Temperature (cold water on face), Intense exercise, Paced breathing, Paired muscle relaxation. Would you like to try one of these right now? (AI support only — not a medical diagnosis.)",
        ],
        "trauma": [
            "Thank you for trusting me with something so significant 🧠 What you're experiencing may be a trauma response — and it makes complete sense given what you've been through. A trauma-informed approach starts with safety and stabilization. Right now, can you name 5 things in your physical space that feel safe or neutral? This grounds you in the present. (Please seek a licensed trauma therapist for clinical support.)",
        ],
        "self_worth": [
            "Low self-worth is often built on 'core beliefs' — deeply held assumptions like 'I'm not good enough' 🧠 CBT shows us these are thoughts, not facts. Let's test one: what belief do you have about yourself that feels most painful? We'll look at the evidence for and against it together. (AI support — consult a therapist for ongoing care.)",
        ],
        "default": [
            "I'm here and I'm listening fully 🧠 Before we explore solutions, I want to understand what you're experiencing. Using reflective listening: it sounds like things feel heavy right now. Can you help me understand — how long have you been feeling this way, and has anything changed recently? (This is AI support, not a clinical diagnosis.)",
            "Thank you for opening up — that takes real courage 💜 As your virtual psychologist, my first goal is always to understand, not to fix. Can you describe what you're feeling in your body right now? Emotions often show up physically before we can name them. (AI support only — contact a licensed therapist for ongoing mental health care.)",
            "In therapy, we often start with: 'What brings you here today?' 🧠 And there are no wrong answers. Whatever is on your mind or heart — big or small — is worth exploring. I'm here with no judgment. What would you like to work through? (This is AI wellness support, not a substitute for licensed clinical care.)",
        ]
    },
    "companion": {
        "sad_lonely": [
            "Hey, I hear you 💙 Feeling sad is so valid, and I'm really glad you're talking about it. You don't have to carry this alone. How long have you been feeling this way?",
            "I'm right here with you 🫂 Sometimes just saying it out loud already helps a little. What's been the hardest part of your day?",
            "Aw, I'm really sorry you're feeling that way 💙 Your feelings are 100% valid. Tell me more — I want to understand.",
        ],
        "anxious_stressed": [
            "That sounds really overwhelming 💙 When everything piles up it's hard to breathe. Can you tell me — is it one big thing or lots of small things stressing you?",
            "Hey, anxiety can feel SO heavy. You're not alone in this 🫂 Let's slow down together. What feels most urgent to you right now?",
            "I hear you — that kind of tension is exhausting. Take a breath with me 💙 In for 4 counts… hold… out for 4. Feel even a tiny bit better?",
        ],
        "angry": [
            "Ugh, that sounds genuinely frustrating 😤 Your anger makes total sense. What happened?",
            "That's so valid to feel angry about 💙 Anger usually means something important was crossed for you. Want to talk through it?",
        ],
        "default": [
            "Thank you for sharing that with me 💙 I'm here, fully listening. What's been on your mind the most lately?",
            "I really appreciate you opening up 🫂 That takes courage. Tell me more about how you're feeling.",
            "You've come to the right place 💙 Whatever you're going through, we can talk it through together. What's happening?",
            "I'm glad you're here 💜 Sometimes just talking helps. What's on your heart today?",
        ]
    },
    "guide": {
        "anxious_stressed": [
            "Let's ground ourselves first 🌿 Try the 5-4-3-2-1 technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. This anchors your nervous system in the present. How do you feel after?",
            "When stress builds up, your breath is the fastest reset button you have 🌬️ Try box breathing: inhale 4 counts, hold 4, exhale 4, hold 4. Repeat 3 times. What's the main stressor we should work through together?",
            "Let's reframe this together 🌿 Instead of 'I can't handle this,' try 'I have handled hard things before, and I can handle this too.' What's one small action you could take today?",
        ],
        "purpose_career": [
            "Clarity comes from action, not just thinking 🌿 Here's a journaling prompt: 'If I had no fear of failure, I would...' What comes up for you?",
            "Let's do a quick values exercise 🪴 Rank these: Freedom, Security, Connection, Achievement, Creativity. Your top 3 usually point toward what truly matters. Want to explore that?",
        ],
        "default": [
            "Awareness is the first step to any change 🌿 Let's get clear on what you're feeling. Can you describe your inner state in 3 words right now?",
            "Let's slow down and check in 🌱 What does your body feel like right now? Tense? Open? Heavy? The body carries emotional signals we often ignore.",
            "Every challenge is an invitation to grow 🌿 What's one thing this situation is trying to teach you?",
        ]
    },
    "neurologist": {
        "anxious_stressed": [
            "What you're experiencing is your amygdala's threat response activating 🧠 It's flooding your body with cortisol and adrenaline — a survival mechanism that misfires with modern stress. Diaphragmatic breathing (belly breathing) directly activates your parasympathetic system and calms this response within minutes. (Note: consult a licensed physician for clinical concerns.)",
            "Chronic stress physically changes the hippocampus — the memory and emotion regulation center 🧠 But neuroplasticity means these changes are reversible through consistent sleep, exercise, and mindfulness. Your brain can literally heal. (This is general wellness info, not a medical diagnosis.)",
        ],
        "sleep": [
            "Sleep deprivation impacts the prefrontal cortex — your rational decision-making center 🧠 Even one poor night increases amygdala reactivity by up to 60%, amplifying emotional responses. Maintaining a consistent sleep window (same time every day) is the single most powerful intervention. (Not medical advice — consult a physician.)",
        ],
        "default": [
            "From a neuroscience perspective, what you're describing involves the interplay between your limbic system (emotion) and prefrontal cortex (reasoning) 🧠 When stress is high, the limbic system dominates. Mindfulness and regulated breathing help restore the balance. (This is general wellness information, not a medical diagnosis.)",
            "The brain is remarkably plastic 🧠 Whatever patterns feel fixed right now — mood, focus, anxiety — can be reshaped through consistent behavioral interventions. What specific aspect would you like to understand better? (Consult a licensed physician for clinical concerns.)",
        ]
    },
    "career": {
        "stuck_confused": [
            "Career confusion usually means you're between versions of yourself — that's actually a growth signal, not a failure signal 🚀 Let me ask: what did you love doing as a kid before anyone told you what was 'practical'?",
            "Here's a reframe 💡 Instead of 'I don't know what I want,' try 'I haven't had the right experiences yet to know.' What's one role you've always been curious about but dismissed?",
            "Let's do a quick SWOT: What are your top 3 Strengths? What's one Weakness holding you back? What Opportunities are around you right now? What Threats (fears) are stopping you? Take 2 minutes and write it out.",
        ],
        "burnout": [
            "Burnout is your nervous system sending a non-negotiable signal 🚀 It's not weakness — it's a sign your effort has vastly exceeded your recovery. What's one thing you can eliminate or delegate this week?",
            "The most sustainable careers are built on energy management, not time management 💡 Where are you leaking energy right now — toxic people, meaningless tasks, unclear goals?",
        ],
        "default": [
            "Career uncertainty is incredibly common for your generation — the path is less linear now, and that's actually a good thing 🚀 What kind of work makes you lose track of time?",
            "Here's a powerful question 💡 In 5 years, what would you regret NOT having tried? That regret radar is often pointing exactly where you need to go.",
            "Let's map this out 🗺️ What do you want more of in your work life? What do you want less of? The gap between those two answers IS your career direction.",
        ]
    }
}

def _get_smart_fallback(persona: str, user_input: str) -> str:
    """Select a contextually relevant fallback based on keyword matching."""
    bank = FALLBACK_BANKS.get(persona, FALLBACK_BANKS["companion"])
    text = user_input.lower()

    # Try to match a themed bucket
    if persona == "psychologist":
        if _keyword_match(text, ["depress", "hopeless", "empty", "sad", "worthless", "numb", "no point"]):
            return random.choice(bank["depression"])
        if _keyword_match(text, ["anxious", "anxiety", "panic", "worry", "fear", "dread", "nervous", "overwhelm"]):
            return random.choice(bank["anxiety"])
        if _keyword_match(text, ["trauma", "abuse", "ptsd", "flashback", "nightmare", "triggered", "assault"]):
            return random.choice(bank["trauma"])
        if _keyword_match(text, ["self-worth", "self worth", "not good enough", "failure", "worthless", "imposter", "hate myself"]):
            return random.choice(bank["self_worth"])

    elif persona == "companion":
        if _keyword_match(text, ["sad", "cry", "depressed", "alone", "lonely", "unhappy", "hopeless"]):
            return random.choice(bank["sad_lonely"])
        if _keyword_match(text, ["anxious", "anxiety", "stress", "stressed", "panic", "overwhelm", "worry", "scared"]):
            return random.choice(bank["anxious_stressed"])
        if _keyword_match(text, ["angry", "mad", "frustrated", "furious", "annoyed"]):
            return random.choice(bank["angry"])

    elif persona == "guide":
        if _keyword_match(text, ["anxious", "stress", "overwhelm", "panic", "worry"]):
            return random.choice(bank["anxious_stressed"])
        if _keyword_match(text, ["purpose", "meaning", "career", "motive", "goal", "direction"]):
            return random.choice(bank["purpose_career"])

    elif persona == "neurologist":
        if _keyword_match(text, ["anxious", "anxiety", "stress", "panic", "overwhelm"]):
            return random.choice(bank["anxious_stressed"])
        if _keyword_match(text, ["sleep", "tired", "insomnia", "fatigue", "rest"]):
            return random.choice(bank["sleep"])

    elif persona == "career":
        if _keyword_match(text, ["stuck", "confused", "lost", "don't know", "no idea", "unsure", "clueless"]):
            return random.choice(bank["stuck_confused"])
        if _keyword_match(text, ["burnout", "exhausted", "tired", "drained", "overwhelm", "quit", "leave"]):
            return random.choice(bank["burnout"])

    # Default bucket
    return random.choice(bank.get("default", ["I'm here for you 💙 Tell me more."]))


# ─────────────────────────────────────────────────────────────────────────────
# Main Chat Function
# ─────────────────────────────────────────────────────────────────────────────
async def chat_with_persona(user_input: str, persona: str, history: list) -> str:
    """Calls OpenAI chat completions with the selected persona system prompt.
    Falls back to keyword-matched intelligent responses if OpenAI is unavailable.
    """
    system_prompt = PERSONAS.get(persona, PERSONAS["companion"])

    # If no real API key, use smart keyword-matched fallback
    if not OPENAI_API_KEY or OPENAI_API_KEY.strip() in ("", "your-openai-key", "sk-..."):
        return _get_smart_fallback(persona, user_input)

    try:
        messages = [{"role": "system", "content": system_prompt}]

        # Append chat history (last 8 turns for context)
        for h in history[-8:]:
            messages.append({"role": h["role"], "content": h["content"]})

        messages.append({"role": "user", "content": user_input})

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": messages,
                    "max_tokens": 350,
                    "temperature": 0.85
                }
            )
            data = response.json()
            if "choices" in data:
                return data["choices"][0]["message"]["content"]
            else:
                # API key invalid or quota exceeded — fall back gracefully
                return _get_smart_fallback(persona, user_input)

    except Exception as e:
        print(f"OpenAI Chat Error: {e}")
        return _get_smart_fallback(persona, user_input)
