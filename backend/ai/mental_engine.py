"""
MindfulAI Mental Health Engine (The Brain)
Unified orchestrator for feature extraction, fusion, risk detection, and temporal analysis.
"""

from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession

# Import modules
from ai.feature_pipeline import feature_pipeline
from ai.fusion_engine import fusion_engine
from ai.temporal_engine import temporal_engine
from ai.risk_detector import risk_detector
from ai.inference_utils import inference_engine
from ai.memory_engine import memory_engine
import torch

class MentalEngine:
    def __init__(self):
        self.name = "MindfulAI Core Brain"

    async def analyze_state(
        self,
        text: str = None,
        audio_data: bytes = None,
        face_frame: Any = None,
        wearable_data: Dict[str, Any] = None, # New biometric input
        user_id: str = "guest",
        db: AsyncSession = None
    ) -> Dict[str, Any]:
        """
        Processes multi-modal input through the full intelligence pipeline.
        Now supports Digital Twin memory and Wearable Biometrics.
        """
        # 1. RISK DETECTION (Phase 4: High-Priority Override)
        risk_result = {"risk_level": "LOW", "bypass_required": False}
        if text:
            # Detect severe clinical signals (Suicide/Self-Harm)
            risk_result = risk_detector.check_risk(text) # Returns (is_crisis, label) 
            
        if risk_result[0]: # is_crisis is True
            log.critical("!!! SAFETY OVERRIDE TRIGGERED !!! High-risk patient signal detected.")
            return {
                "mental_state_vector": {
                    "emotion": "Crisis",
                    "stress_level": "CRITICAL",
                    "risk_level": "HIGH",
                    "energy_level": 0,
                    "cognitive_pattern": "Emergency Situation"
                },
                "safety_override": True,
                "message": "Clinical safety protocol engaged. Your safety is our only priority right now.",
                "emergency_resources": {
                    "helpline": "988 (Suicide & Crisis Lifeline)",
                    "text": "Text 'HOME' to 741741",
                    "action": "Please contact a professional immediateley or visit the nearest emergency room."
                },
                "risk_details": risk_result[1]
            }

        # 2. DIGITAL TWIN (MEMORY RETRIEVAL)
        memory_context = None
        if text and user_id != "guest":
            memory_context = await memory_engine.get_digital_twin_context(user_id, text)

        # 3. FEATURE EXTRACTION
        features = feature_pipeline.process_all(text, audio_data, face_frame)
        
        # Inject wearables if available
        if wearable_data:
            features["wearable"] = wearable_data

        # 4. NEURAL INFERENCE
        neural_preds = {}
        if text and features.get("text") and features["text"].get("embedding"):
            emb = torch.tensor(features["text"]["embedding"], dtype=torch.float32)
            neural_preds = inference_engine.predict_context(emb)
            neural_risk = inference_engine.predict_risk(emb)
            risk_result["neural_risk"] = neural_risk
            # Update risk if neural model is confident
            if neural_risk == "HIGH":
                risk_result["risk_level"] = "HIGH"

        if audio_data and features.get("audio") and features["audio"].get("mfcc_mean"):
            # Combine MFCC + Pitch + Energy for stress inference
            audio_feat = features["audio"]["mfcc_mean"] + [features["audio"]["pitch"], features["audio"]["energy"]]
            stress_score = inference_engine.predict_stress(audio_feat)
            features["audio"]["stress_score"] = stress_score

        # 5. MULTI-MODAL FUSION
        fused_results = fusion_engine.fuse_features(features)

        # 6. TEMPORAL ANALYSIS
        final_state_data = {"final_state": fused_results["final_score"]}
        if db:
            final_state_data = await temporal_engine.calculate_weighted_state(
                fused_results["final_score"], 
                user_id, 
                db
            )

        # 7. CONSOLIDATED OUTPUT (Phases 2 & 5)
        # Prefer Neural Emotion if available, fallback to fused score mapping
        emotion = neural_preds.get("emotion")
        if not emotion:
            mental_score = final_state_data.get("final_state", fused_results["final_score"])
            if mental_score > 0.7: emotion = "distressed"
            elif mental_score > 0.4: emotion = "neutral"
            else: emotion = "calm"

        # Create the expert Clinical "Mental State Vector"
        mental_state_vector = {
            "emotion": emotion,
            "stress_level": "HIGH" if final_state_data.get("final_state", 0) > 0.7 else "MEDIUM" if final_state_data.get("final_state", 0) > 0.4 else "LOW",
            "risk_level": risk_result["risk_level"],
            "energy_level": features.get("wearable", {}).get("energy_level", 5),
            "cognitive_pattern": neural_preds.get("top_distortion", "None detected")
        }

        # Calculate Deviation from baseline
        baseline = memory_context.get("emotional_baseline", 0.5) if memory_context else 0.5
        deviation = float(abs(fused_results["final_score"] - baseline))

        result = {
            "mental_state_vector": mental_state_vector,
            "deviation_from_baseline": deviation,
            "confidence": neural_preds.get("confidence", fused_results["confidence"]),
            "historical_context": {
                "prediction": final_state_data.get("prediction"),
                "trend": final_state_data.get("trend_direction"),
                "digital_twin_memory": memory_context
            },
            "modality_contribution": fused_results["modality_contribution"],
            "score": float(fused_results["final_score"]),
            "biometrics": wearable_data,
            "neural_insights": neural_preds
        }

        # 8. DIGITAL TWIN (MEMORY STORAGE) - Background/Async
        if text and user_id != "guest":
            await memory_engine.store_snapshot(user_id, text, result)

        return result

# Singleton instance
mental_engine = MentalEngine()
