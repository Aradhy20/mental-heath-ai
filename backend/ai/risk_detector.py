"""
MindfulAI Risk Detector
Identifies high-risk clinical keywords and triggers safety overrides.
"""

from core.logging import log

# ML Fallback
try:
    from transformers import pipeline
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False

class RiskDetector:
    def __init__(self):
        # High-risk trigger keywords
        self.critical_keywords = [
            "suicide", "kill myself", "die", "end it all", 
            "hurt myself", "better off dead", "no reason to live"
        ]
        
        # Moderate risk (Anxiety/Stress)
        self.concerning_keywords = [
            "scared", "panicking", "can't breathe", "hopeless", "worthless"
        ]
        
        self.classifier = None

    def _lazy_init(self):
        if self.classifier is None and HAS_TRANSFORMERS:
            try:
                log.info("RiskDetector: Lazy-loading BERT sentiment classifier...")
                from transformers import pipeline
                self.classifier = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")
                log.info("RiskDetector: ✅ Classifier Ready")
            except Exception as e:
                log.error(f"RiskDetector: Failed to load ML classifier: {e}")

    def check_risk(self, text: str):
        self._lazy_init()
        """
        Returns (is_crisis: bool, risk_level: str)
        Uses both exact keyword matching and an ML fallback.
        """
        text_lower = text.lower()
        
        # 1. KEYWORD MATCH (Immediate Priority)
        # Check for CRITICAL risk
        for kw in self.critical_keywords:
            if kw in text_lower:
                log.warning(f"CRITICAL RISK DETECTED: Trigger word '{kw}' found.")
                return True, "HIGH"
        
        # Check for CONCERNING risk
        for kw in self.concerning_keywords:
            if kw in text_lower:
                log.info(f"Concerning symptoms detected in text: '{kw}'")
                return False, "MODERATE"
        
        # 2. ML CLASSIFIER (If keyword doesn't trigger)
        if self.classifier:
            try:
                result = self.classifier(text[:512])[0]
                # Ratings 1 star or 2 star treated as potential distress 
                if result['label'] in ['1 star', '2 stars'] and result['score'] > 0.8:
                     log.info(f"ML Detected distress: {result['label']}")
                     return False, "MODERATE"
            except Exception as e:
                log.error(f"Risk ML Error: {e}")

        return False, "LOW"

risk_detector = RiskDetector()
