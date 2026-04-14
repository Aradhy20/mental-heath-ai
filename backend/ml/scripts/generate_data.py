import json
import random
import os
import numpy as np

# 🧠 CLINICAL DATA CONFIG
EMOTIONS = ["happy", "sad", "anxious", "angry", "neutral"]
PATTERNS = ["none", "overthinking", "catastrophizing", "self-blame"]
RISK_LEVELS = ["LOW", "MODERATE", "HIGH"]

TEXT_SAMPLES = {
    "happy": [
        "I feel really good today, like everything is finally clicking.",
        "So grateful for the support I have. Life is beautiful.",
        "Had a productive morning and I feel energized.",
        "Spending time outside really cheered me up.",
        "I am proud of what I accomplished this week."
    ],
    "sad": [
        "I just feel so heavy and drained, I can't find the motivation.",
        "Nothing feels right lately, I just want to stay in bed.",
        "Thinking about the past always makes me feel so lonely.",
        "I feel like I'm failing everyone around me.",
        "It's hard to see the light at the end of the tunnel right now."
    ],
    "anxious": [
        "My heart is racing and I can't stop thinking about what if it goes wrong.",
        "I feel like something bad is about to happen but I don't know what.",
        "I'm so overwhelmed with work, I can't breathe sometimes.",
        "I've been pacing around all morning, I just can't settle down.",
        "Every small noise makes me jump, I'm just so on edge."
    ],
    "angry": [
        "I'm so frustrated with how things are being handled.",
        "I just want to scream, nobody is listening to me.",
        "I feel so much tension in my chest, I'm just furious.",
        "Why does everything have to be so difficult?",
        "I'm tired of being treated this way, it's not fair."
    ]
}

RISK_TRIGGERS = [
    "I want to end my life",
    "I can't go on like this anymore",
    "Everything would be better without me",
    "I'm thinking of hurting myself",
    "I've planned how to end it"
]

def generate_text_data(count=500):
    data = []
    for _ in range(count):
        emotion = random.choice(EMOTIONS)
        if emotion in TEXT_SAMPLES:
            text = random.choice(TEXT_SAMPLES[emotion])
        else:
            text = "It's a normal day, just going through the routine."
            
        risk = "LOW"
        pattern = "none"
        
        # Inject risk
        if random.random() < 0.1: # 10% risk
            text = random.choice(RISK_TRIGGERS)
            risk = "HIGH"
            emotion = "sad"
            
        # Inject pattern
        if "what if" in text.lower() or "wrong" in text.lower():
            pattern = "catastrophizing"
        elif "always" in text.lower() or "everyone" in text.lower():
            pattern = "overthinking"
            
        data.append({
            "text": text,
            "label_emotion": emotion,
            "label_risk": risk,
            "label_pattern": pattern
        })
    return data

def generate_audio_features(count=500):
    """Generates synthetic MFCC + Pitch + Energy vectors"""
    data = []
    for _ in range(count):
        # 13 MFCCs + Pitch + Energy = 15 features
        mfcc = np.random.normal(0, 1, 13) 
        pitch = random.uniform(100, 400)
        energy = random.uniform(0.01, 0.5)
        
        # Simple heuristic mapping for "Stress"
        # High pitch + High energy + High spectral variance = High Stress
        stress_level = 0.3 # Low
        if pitch > 300 and energy > 0.3:
            stress_level = 0.8 # High
        elif pitch > 250:
            stress_level = 0.5 # Moderate
            
        features = np.concatenate([mfcc, [pitch, energy]]).tolist()
        data.append({
            "features": features,
            "label_stress": stress_level
        })
    return data

def save_datasets():
    os.makedirs("backend/ml/data", exist_ok=True)
    
    text_data = generate_text_data(1000)
    audio_data = generate_audio_features(1000)
    
    with open("backend/ml/data/text_clinical.json", "w") as f:
        json.dump(text_data, f, indent=2)
        
    with open("backend/ml/data/audio_clinical.json", "w") as f:
        json.dump(audio_data, f, indent=2)
        
    print(f"✅ Generated 1000 samples for Text and Audio datasets.")

if __name__ == "__main__":
    save_datasets()
