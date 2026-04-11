import os
import cv2
import numpy as np
from tqdm import tqdm
from pathlib import Path

# Paths
DATASET_ROOT = "/Users/aradhyjain/Desktop/project/Mental-Health-Detection--1"
PROCESSED_ROOT = "/Users/aradhyjain/Desktop/project/ai_models/face/training/processed_dataset"
CLASSES = ['Anxiety', 'Depress', 'Normal']

def preprocess():
    for split in ['train', 'valid', 'test']:
        print(f"Processing {split} split...")
        img_dir = Path(DATASET_ROOT) / split / "images"
        lbl_dir = Path(DATASET_ROOT) / split / "labels"
        
        target_base = Path(PROCESSED_ROOT) / split
        for cls in CLASSES:
            (target_base / cls).mkdir(parents=True, exist_ok=True)

        img_files = list(img_dir.glob("*.jpg")) + list(img_dir.glob("*.png")) + list(img_dir.glob("*.jpeg"))
        
        for img_path in tqdm(img_files):
            # Find matching label
            lbl_path = lbl_dir / f"{img_path.stem}.txt"
            if not lbl_path.exists():
                continue
            
            img = cv2.imread(str(img_path))
            if img is None: continue
            h, w, _ = img.shape
            
            with open(lbl_path, 'r') as f:
                lines = f.readlines()
                
            for i, line in enumerate(lines):
                parts = list(map(float, line.strip().split()))
                if not parts: continue
                
                cls_id = int(parts[0])
                if cls_id >= len(CLASSES): continue
                
                # Coordinates are x1 y1 x2 y2 ... normalized
                coords = parts[1:]
                x_coords = coords[0::2]
                y_coords = coords[1::2]
                
                if not x_coords or not y_coords: continue
                
                xmin = int(min(x_coords) * w)
                xmax = int(max(x_coords) * w)
                ymin = int(min(y_coords) * h)
                ymax = int(max(y_coords) * h)
                
                # Add some padding (20%)
                pad_x = int((xmax - xmin) * 0.1)
                pad_y = int((ymax - ymin) * 0.1)
                
                xmin = max(0, xmin - pad_x)
                xmax = min(w, xmax + pad_x)
                ymin = max(0, ymin - pad_y)
                ymax = min(h, ymax + pad_y)
                
                crop = img[ymin:ymax, xmin:xmax]
                if crop.size == 0: continue
                
                # Save crop
                cls_name = CLASSES[cls_id]
                save_name = f"{img_path.stem}_crop_{i}.jpg"
                cv2.imwrite(str(target_base / cls_name / save_name), crop)

if __name__ == "__main__":
    preprocess()
