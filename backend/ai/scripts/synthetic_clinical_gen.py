"""
MindfulAI Synthetic Clinical Dataset Generator
===============================================
Generates high-fidelity, CBT-grounded conversation datasets for:
    - Offline model distillation
    - Fine-tuning emotion + distortion classifiers
    - Safety system adversarial training

Output format: JSONL (compatible with OpenAI fine-tune API + HuggingFace datasets)

Usage:
    python -m backend.ai.scripts.synthetic_clinical_gen \
        --output data/synthetic_clinical.jsonl \
        --samples 500
"""

from __future__ import annotations

import argparse
import json
import random
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterator, List

# ── Clinical Ground-Truth Templates ─────────────────────────────────────────

DISTORTIONS: Dict[str, Dict] = {
    "CATASTROPHIZING": {
        "user_templates": [
            "If I fail this presentation, my whole career is over.",
            "One bad day means everything will fall apart.",
            "I made a mistake. My life is ruined.",
            "I can't do anything right — this is going to be a disaster.",
        ],
        "ideal_responses": [
            "I hear you — that fear feels very real. Let's look at what actually happened versus what the worst case might be. What's a more likely outcome?",
            "You're describing the worst possible scenario, which is a very human reaction under pressure. Can we look at the evidence for and against that thought?",
            "One difficult moment doesn't define everything. What would you tell a close friend who said the same thing to you?",
        ],
        "reframe": "Is there a more balanced, middle-ground view of this situation?",
    },
    "ALL_OR_NOTHING": {
        "user_templates": [
            "I either do it perfectly or there's no point trying.",
            "Nobody likes me at all.",
            "I'm a complete failure.",
            "Either I'm 100% successful or I've failed entirely.",
        ],
        "ideal_responses": [
            "It sounds like you're seeing this in very black-and-white terms. Most things fall somewhere in the middle — can we look for the grey areas?",
            "The belief that it must be perfect or nothing can be exhausting. What would 'good enough' look like here?",
        ],
        "reframe": "Can we find evidence of partial success or effort that has value?",
    },
    "MIND_READING": {
        "user_templates": [
            "I know everyone thinks I'm stupid.",
            "She's definitely judging me for what I said.",
            "They all noticed my mistake and are laughing at me.",
            "My boss thinks I'm incompetent, I can tell.",
        ],
        "ideal_responses": [
            "It sounds like you're reading minds — which is incredibly hard even for professionals. What actual evidence do you have for what they're thinking?",
            "When we're anxious, our brains often fill in the blanks with worst-case interpretations. What's another explanation for their behaviour?",
        ],
        "reframe": "What evidence do you have for what the other person is actually thinking?",
    },
    "EMOTIONAL_REASONING": {
        "user_templates": [
            "I feel like a failure so I must be one.",
            "I feel guilty so I must have done something terrible.",
            "I feel hopeless, so things really are hopeless.",
        ],
        "ideal_responses": [
            "Feelings are important signals — but they aren't always facts. Feeling like a failure doesn't mean you are one. What does the evidence say?",
            "When we're distressed, it's easy to treat our emotions as objective reality. Let's gently separate the feeling from the fact.",
        ],
        "reframe": "Feelings are real, but are they accurate representations of reality here?",
    },
}

SAFETY_ADVERSARIAL: List[Dict] = [
    {
        "user": "I want to hurt myself.",
        "risk_level": "CRITICAL",
        "label": "self_harm_intent",
        "ideal_response": (
            "I'm really glad you reached out, and I want you to know I'm taking what you're sharing very seriously. "
            "Please reach out to a crisis line right now — in India you can call iCall at 9152987821. "
            "You don't have to go through this alone."
        ),
    },
    {
        "user": "There's no point in continuing.",
        "risk_level": "HIGH",
        "label": "hopelessness",
        "ideal_response": (
            "That sounds like an enormous weight to be carrying. I hear real pain in what you've shared. "
            "Can you tell me more about what's brought you to this moment? I'm here with you."
        ),
    },
    {
        "user": "Everyone would be better off without me.",
        "risk_level": "CRITICAL",
        "label": "suicidal_ideation",
        "ideal_response": (
            "What you're feeling right now is a crisis moment, and it deserves real human support. "
            "Please call or text 988 (US) or 9152987821 (India) immediately. "
            "You matter — this feeling is not permanent, even though it feels that way right now."
        ),
    },
]

SUPPORT_DIALOGUES: List[Dict] = [
    {
        "user": "I've been feeling really anxious about work lately.",
        "emotion": "anxiety",
        "risk_level": "LOW",
        "ideal_response": "That sounds really draining. Work pressure can build up quietly. Can you tell me what's been weighing on you the most?",
    },
    {
        "user": "I just feel really sad and I don't know why.",
        "emotion": "sadness",
        "risk_level": "LOW",
        "ideal_response": "Unexplained sadness can be one of the hardest things to sit with. You don't always need a reason to feel this way — how long has this been going on?",
    },
    {
        "user": "I had a panic attack at work today.",
        "emotion": "fear",
        "risk_level": "MODERATE",
        "ideal_response": "A panic attack at work must have been frightening, especially in front of others. First — you're safe now. Can you walk me through what triggered it?",
    },
]


# ── Generators ───────────────────────────────────────────────────────────────

def _cbt_samples(n: int) -> Iterator[Dict]:
    distortion_keys = list(DISTORTIONS.keys())
    for _ in range(n):
        trap = random.choice(distortion_keys)
        data = DISTORTIONS[trap]
        user_msg = random.choice(data["user_templates"])
        ideal    = random.choice(data["ideal_responses"])
        yield {
            "type": "cbt_reframe",
            "distortion": trap,
            "messages": [
                {"role": "user",      "content": user_msg},
                {"role": "assistant", "content": ideal},
            ],
            "reframe_hint": data["reframe"],
            "metadata": {
                "risk_level": "LOW",
                "emotion": "anxiety",
                "source": "synthetic_clinical_gen",
                "generated_at": datetime.utcnow().isoformat(),
            },
        }


def _safety_samples() -> Iterator[Dict]:
    for sample in SAFETY_ADVERSARIAL:
        yield {
            "type": "safety_critical",
            "distortion": None,
            "messages": [
                {"role": "user",      "content": sample["user"]},
                {"role": "assistant", "content": sample["ideal_response"]},
            ],
            "reframe_hint": None,
            "metadata": {
                "risk_level": sample["risk_level"],
                "label":      sample["label"],
                "source":     "synthetic_clinical_gen",
                "generated_at": datetime.utcnow().isoformat(),
            },
        }


def _support_samples() -> Iterator[Dict]:
    for sample in SUPPORT_DIALOGUES:
        yield {
            "type": "empathic_support",
            "distortion": None,
            "messages": [
                {"role": "user",      "content": sample["user"]},
                {"role": "assistant", "content": sample["ideal_response"]},
            ],
            "reframe_hint": None,
            "metadata": {
                "risk_level": sample["risk_level"],
                "emotion":    sample["emotion"],
                "source":     "synthetic_clinical_gen",
                "generated_at": datetime.utcnow().isoformat(),
            },
        }


def generate(n_cbt: int = 200, output_path: Path = Path("data/synthetic_clinical.jsonl")) -> int:
    """
    Generate a JSONL dataset combining CBT, safety-critical, and support samples.
    Returns the total number of records written.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)
    total = 0

    with open(output_path, "w") as f:
        for record in _cbt_samples(n_cbt):
            f.write(json.dumps(record) + "\n")
            total += 1

        for record in _safety_samples():
            f.write(json.dumps(record) + "\n")
            total += 1

        for record in _support_samples():
            f.write(json.dumps(record) + "\n")
            total += 1

    print(f"[SyntheticGen] ✅  {total:,} records → {output_path}")
    return total


# ── CLI ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="MindfulAI Synthetic Clinical Dataset Generator")
    parser.add_argument("--output",  default="data/synthetic_clinical.jsonl", type=Path)
    parser.add_argument("--samples", default=200, type=int, help="Number of CBT samples to generate")
    args = parser.parse_args()

    n = generate(n_cbt=args.samples, output_path=args.output)
    sys.exit(0 if n > 0 else 1)
