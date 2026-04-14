"""
MindfulAI Fusion Engine
Combines multi-modal features into a unified mental state representation.
"""

import numpy as np
from typing import Dict, List, Optional, Any

class FusionEngine:
    def __init__(self):
        # Default Weights
        self.weights = {
            "text": 0.5,
            "audio": 0.3,
            "face": 0.2
        }

    def fuse_features(self, pipeline_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Combines features using weighted and confidence-based logic.
        """
        text_data = pipeline_results.get("text")
        audio_data = pipeline_results.get("audio")
        face_data = pipeline_results.get("face")

        # 1. Feature-level Fusion (Concatenation)
        # We only concatenate embeddings/vectors that are compatible
        combined_vector = []
        if text_data and "embedding" in text_data:
            combined_vector.extend(text_data["embedding"][:32]) # Take first 32 dimensions for demo
        
        if audio_data and "mfcc_mean" in audio_data:
            combined_vector.extend(audio_data["mfcc_mean"])

        # 2. Score Fusion (Weighted)
        modality_scores = {}
        availabilities = {}
        
        # Calculate heuristic scores for each modality (0-1)
        # Text Score: Based on stress indicators
        if text_data:
            indicators = text_data.get("indicators", {})
            stress_ratio = indicators.get("first_person_ratio", 0) + (indicators.get("negation_count", 0) * 0.1)
            text_score = min(stress_ratio, 1.0)
            modality_scores["text"] = text_score
            availabilities["text"] = 1.0
        
        # Audio Score: Based on energy/pitch
        if audio_data and not "error" in audio_data:
            audio_score = min(audio_data.get("energy", 0) * 10 + (audio_data.get("pitch", 150) / 1000), 1.0)
            modality_scores["audio"] = audio_score
            availabilities["audio"] = 1.0
        
        # Face Score: Based on landmarks
        if face_data and face_data.get("detected"):
            face_score = 1.0 - face_data.get("smile_intensity", 0.5) # simple inverse
            modality_scores["face"] = face_score
            availabilities["face"] = 1.0

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
            # Re-normalize contributions for output
            modality_contribution = {k: v / total_weight for k, v in modality_contribution.items()}
        else:
            final_score = 0.5 # Neutral fallback

        return {
            "fused_vector": combined_vector,
            "final_score": float(final_score),
            "modality_contribution": modality_contribution,
            "confidence": float(total_weight) # High weight = high confidence
        }

# Singleton instance
fusion_engine = FusionEngine()
