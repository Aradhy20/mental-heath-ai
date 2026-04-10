"""Train all AI models in the repository.

This script runs the text emotion, voice sentiment, and face emotion
model training pipelines sequentially. It is intended for local development
and model refresh workflows.
"""

import sys
import os

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from ai_models.face.training.train import train_face_model
from ai_models.text.training.train import train_text_model
from ai_models.voice.training.train import train_voice_model


def train_all(
    text_epochs: int = 1,
    face_epochs: int = 10,
    voice_data_dir: str | None = None,
):
    print("\n=== Starting full AI model training pipeline ===\n")

    print("\n--- Text model training ---\n")
    train_text_model(epochs=text_epochs)

    print("\n--- Voice model training ---\n")
    train_voice_model(data_dir=voice_data_dir)

    print("\n--- Face model training ---\n")
    train_face_model(epochs=face_epochs)

    print("\n=== All models trained successfully ===\n")


if __name__ == "__main__":
    train_all()
