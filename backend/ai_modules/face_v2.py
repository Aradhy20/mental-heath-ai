import os
import cv2
import numpy as np
import base64
import tensorflow as tf
from tensorflow.keras.models import load_model

class FaceV2Analyzer:
    def __init__(self, model_path="/Users/aradhyjain/Desktop/project/ai_models/face/model/face_model_v2.h5"):
        self.model_path = model_path
        self.classes = ['Anxiety', 'Depress', 'Normal']
        self.img_size = (224, 224)
        self.model = None
        self._loaded = False
        
    def _try_load_model(self):
        """Lazy load the Keras model."""
        if self._loaded:
            return
            
        if os.path.exists(self.model_path):
            try:
                # Load with cross-device compatibility settings
                print(f"Loading FaceV2 model (MobileNetV2) from {self.model_path}...")
                self.model = load_model(self.model_path)
                print(f"✅ FaceV2: Loaded MobileNetV2 successfully.")
            except Exception as e:
                print(f"❌ FaceV2: Load error: {e}")
        else:
            print(f"⚠️ FaceV2: Model not found at {self.model_path}")
        
        self._loaded = True

    def analyze(self, image_base64: str) -> dict:
        if not self._loaded:
            self._try_load_model()
            
        if self.model is None:
            return {"label": "Normal", "confidence": 0.0, "scores": {}, "error": "Model not loaded"}

        try:
            if "," in image_base64:
                image_base64 = image_base64.split(",")[1]

            img_bytes = base64.b64decode(image_base64)
            nparr = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is None:
                return {"label": "Normal", "confidence": 0.0, "scores": {}, "error": "Decode failed"}

            # Standard preprocessing
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img_resized = cv2.resize(img_rgb, self.img_size)
            img_array = img_resized.astype(np.float32) / 255.0
            img_batch = np.expand_dims(img_array, axis=0)

            # Inference
            preds = self.model.predict(img_batch, verbose=0)[0]
            max_idx = np.argmax(preds)
            
            result = {
                "label": self.classes[max_idx],
                "confidence": float(preds[max_idx]),
                "scores": {self.classes[i]: float(preds[i]) for i in range(len(self.classes))}
            }
            
            # Map labels to a "Stress Score" for existing dashboard compatibility
            # Anxiety/Depress = high stress, Normal = low stress
            stress_map = {"Anxiety": 0.85, "Depress": 0.90, "Normal": 0.15}
            result["score"] = stress_map.get(result["label"], 0.5)
            
            return result

        except Exception as e:
            print(f"❌ FaceV2: Analysis error: {e}")
            return {"label": "Normal", "confidence": 0.0, "scores": {}, "error": str(e)}

# Singleton
face_v2 = FaceV2Analyzer()
