import os
import cv2
import numpy as np
import base64
from ultralytics import YOLO

class FaceYoloAnalyzer:
    def __init__(self, model_path="/Users/aradhyjain/Desktop/project/ai_models/face/model/face_yolo_v1.pt"):
        self.model_path = model_path
        self.classes = ['Anxiety', 'Depress', 'Normal']
        self.model = None
        self._loaded = False
        
    def _try_load_model(self):
        """Lazy load the YOLO model."""
        if self._loaded:
            return
            
        if os.path.exists(self.model_path):
            try:
                print(f"Loading Face-YOLO model from {self.model_path}...")
                self.model = YOLO(self.model_path)
                print(f"✅ Face-YOLO: Loaded successfully.")
            except Exception as e:
                print(f"❌ Face-YOLO: Load error: {e}")
        else:
            print(f"⚠️ Face-YOLO: Model not found at {self.model_path}. Will use fallback if not found.")
        
        self._loaded = True

    def analyze(self, image_base64: str) -> dict:
        if not self._loaded:
            self._try_load_model()
            
        if self.model is None:
            return {"label": "Normal", "confidence": 0.0, "score": 0.5, "error": "Model not trained yet"}

        try:
            if "," in image_base64:
                image_base64 = image_base64.split(",")[1]

            img_bytes = base64.b64decode(image_base64)
            nparr = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is None:
                return {"label": "Normal", "confidence": 0.0, "score": 0.5, "error": "Decode failed"}

            # Inference
            results = self.model.predict(img, verbose=False)
            
            if len(results) == 0 or len(results[0].boxes) == 0:
                return {"label": "Normal", "confidence": 0.0, "score": 0.15, "info": "No face detected"}

            # Get the top detection (highest confidence)
            # YOLO results[0].boxes contains detections. For classification-style detection, we look at the class.
            top_box = results[0].boxes[0]
            conf = float(top_box.conf[0])
            cls_idx = int(top_box.cls[0])
            label = self.classes[cls_idx] if cls_idx < len(self.classes) else "Normal"
            
            # Map labels to a "Stress Score"
            stress_map = {"Anxiety": 0.85, "Depress": 0.90, "Normal": 0.15}
            score = stress_map.get(label, 0.5)
            
            return {
                "label": label,
                "confidence": conf,
                "score": score,
                "bboxes": results[0].boxes.xyxy.tolist() # return bounding boxes too
            }

        except Exception as e:
            print(f"❌ Face-YOLO: Analysis error: {e}")
            return {"label": "Normal", "confidence": 0.0, "score": 0.5, "error": str(e)}

# Singleton
face_yolo = FaceYoloAnalyzer()
