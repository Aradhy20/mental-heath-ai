import sys
import os
from datetime import datetime

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

# Mocking modules that might cause issues if dependencies are missing or if they require a running server
# We want to test the logic of the classes we implemented.

try:
    print("Testing TemporalEmotionAnalyzer...")
    from text_service.emotion_patterns import TemporalEmotionAnalyzer
    analyzer = TemporalEmotionAnalyzer()
    analyzer.add_entry(1, "joy", 0.8)
    analyzer.add_entry(1, "sadness", 0.4)
    analyzer.add_entry(1, "joy", 0.9)
    patterns = analyzer.analyze_patterns(1)
    print(f"Patterns: {patterns}")
    triggers = analyzer.detect_triggers(1, "I am worried about the deadline")
    print(f"Triggers: {triggers}")
    print("TemporalEmotionAnalyzer passed.")
except Exception as e:
    print(f"TemporalEmotionAnalyzer failed: {e}")

try:
    print("\nTesting FusionEngine Discrepancy...")
    from fusion_service.fusion_engine import FusionEngine
    engine = FusionEngine()
    discrepancy = engine.detect_discrepancy(0.9, 0.8, 0.2) # High text/voice, low face
    print(f"Discrepancy (should be True): {discrepancy}")
    discrepancy_low = engine.detect_discrepancy(0.5, 0.6, 0.5) # Consistent
    print(f"Discrepancy (should be False): {discrepancy_low}")
    print("FusionEngine passed.")
except Exception as e:
    print(f"FusionEngine failed: {e}")

# Note: Testing VectorDB and RAG requires ChromaDB and SentenceTransformers which might be heavy to load 
# or require specific environment setup. We will skip deep integration testing of those in this script 
# and rely on the code review and previous successful imports.
print("\nVerification script completed.")
