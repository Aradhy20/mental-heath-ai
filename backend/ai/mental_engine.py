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
        # 1. RISK DETECTION (Priority Override)
        risk_result = {"risk_level": "LOW", "bypass_required": False}
        if text:
            risk_result = risk_detector.analyze_risk(text)
            
        if risk_result.get("bypass_required"):
            return {
                "emotion": "crisis",
                "confidence": 1.0,
                "risk_level": risk_result["risk_level"],
                "mental_state": "CRITICAL",
                "modality_contribution": {"text": 1.0},
                "risk_details": risk_result
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

        # 7. CONSOLIDATED OUTPUT
        # Prefer Neural Emotion if available, fallback to fused score mapping
        emotion = neural_preds.get("emotion")
        if not emotion:
            mental_score = final_state_data.get("final_state", fused_results["final_score"])
            if mental_score > 0.7: emotion = "distressed"
            elif mental_score > 0.4: emotion = "neutral"
            else: emotion = "calm"

        result = {
            "emotion": emotion,
            "confidence": neural_preds.get("confidence", fused_results["confidence"]),
            "risk_level": risk_result["risk_level"],
            "mental_state": final_state_data.get("trend_direction", "stable"),
            "modality_contribution": fused_results["modality_contribution"],
            "score": float(fused_results["final_score"]),
            "historical_context": {
                "past_trend": final_state_data.get("past_trend"),
                "current_signal": final_state_data.get("current_signal"),
                "digital_twin_memory": memory_context
            },
            "biometrics": wearable_data,
            "neural_insights": neural_preds
        }

        # 8. DIGITAL TWIN (MEMORY STORAGE) - Background/Async
        if text and user_id != "guest":
            await memory_engine.store_snapshot(user_id, text, result)

        return result

# Singleton instance
mental_engine = MentalEngine()
