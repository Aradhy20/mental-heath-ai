"""
MindfulAI Fusion Engine
Combines multi-modal features into a unified mental state representation.
"""

import numpy as np
from typing import Dict, List, Optional, Any

class FusionEngine:
    def __init__(self):
        # Default Weights (Updated to include Wearables)
        self.weights = {
            "text": 0.4,
            "audio": 0.25,
            "face": 0.2,
            "wearable": 0.15
        }

    def fuse_features(self, pipeline_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Combines features using weighted and confidence-based logic.
        Now supports Wearable/HRV metrics.
        """
        text_data = pipeline_results.get("text")
        audio_data = pipeline_results.get("audio")
        face_data = pipeline_results.get("face")
        wearable_data = pipeline_results.get("wearable")

        # 1. Feature-level Fusion (Concatenation)
        combined_vector = []
        if text_data and "embedding" in text_data:
            combined_vector.extend(text_data["embedding"][:32])
        
        if audio_data and "mfcc_mean" in audio_data:
            combined_vector.extend(audio_data["mfcc_mean"])

        # 2. Score Fusion (Weighted)
        modality_scores = {}
        
        # Text Score
        if text_data:
            indicators = text_data.get("indicators", {})
            stress_ratio = indicators.get("first_person_ratio", 0) + (indicators.get("negation_count", 0) * 0.1)
            modality_scores["text"] = min(stress_ratio, 1.0)
        
        # Audio Score
        if audio_data and not "error" in audio_data:
            audio_score = min(audio_data.get("energy", 0) * 10 + (audio_data.get("pitch", 150) / 1000), 1.0)
            modality_scores["audio"] = audio_score
        
        # Face Score
        if face_data and face_data.get("detected"):
            modality_scores["face"] = 1.0 - face_data.get("smile_intensity", 0.5)

        # Wearable (HRV) Score - Phase 3.1
        if wearable_data:
            # Low HRV (normalized) usually means high physiological stress
            hrv_val = wearable_data.get("hrv_score", 50.0)
            # Normalize 20-100 range to 0-1 (inverse)
            wearable_score = 1.0 - (max(0, min(hrv_val - 20, 80)) / 80)
            modality_scores["wearable"] = wearable_score

        # 3. Confidence-based Adjusted Weighted Fusion
        final_score = 0
        total_weight = 0
        modality_contribution = {}

        for mod, weight in self.weights.items():
            if mod in modality_scores:
                final_score += modality_scores[mod] * weight
                total_weight += weight
                modality_contribution[mod] = weight
        
        # Re-normalize if some modalities are missing
        if total_weight > 0:
            final_score = final_score / total_weight
            modality_contribution = {k: v / total_weight for k, v in modality_contribution.items()}
        else:
            final_score = 0.5

        return {
            "fused_vector": combined_vector,
            "final_score": float(final_score),
            "modality_contribution": modality_contribution,
            "confidence": float(total_weight)
        }

# Singleton instance
fusion_engine = FusionEngine()
