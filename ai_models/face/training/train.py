import os
import sys
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau

# Add parent directory to path to import model
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.append(parent_dir)

try:
    from face.model.emotion_cnn import EmotionCNN
except ImportError:
    # Fallback import
    sys.path.append(os.path.dirname(parent_dir))
    from face.model.emotion_cnn import EmotionCNN

def train_face_model(train_dir="../../../data/train", val_dir="../../../data/valid", output_dir="../model", epochs=50):
    """
    Train the facial emotion CNN
    """
    print("Initializing Face Model Training...")
    
    # Initialize model
    emotion_cnn = EmotionCNN()
    model = emotion_cnn.model
    
    if model is None:
        print("Failed to initialize model (TensorFlow missing?). Exiting.")
        return

    # Data Generators
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=10,
        width_shift_range=0.1,
        height_shift_range=0.1,
        shear_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True,
        fill_mode='nearest'
    )
    
    val_datagen = ImageDataGenerator(rescale=1./255)
    
    # Check if dataset exists
    if not os.path.exists(train_dir):
        print(f"Training directory {train_dir} not found.")
        print("Please download the FER-2013 dataset or similar and extract it to ai_models/face/training/dataset/")
        return

    print(f"Loading data from {train_dir}...")
    
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(48, 48),
        color_mode='grayscale',
        batch_size=64,
        class_mode='categorical',
        shuffle=True
    )
    
    validation_generator = val_datagen.flow_from_directory(
        val_dir,
        target_size=(48, 48),
        color_mode='grayscale',
        batch_size=64,
        class_mode='categorical',
        shuffle=False
    )
    
    # Callbacks
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    checkpoint = ModelCheckpoint(
        os.path.join(output_dir, 'face_model.h5'),
        monitor='val_accuracy',
        save_best_only=True,
        mode='max',
        verbose=1
    )
    
    early_stop = EarlyStopping(
        monitor='val_loss',
        patience=10,
        restore_best_weights=True,
        verbose=1
    )
    
    reduce_lr = ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.2,
        patience=5,
        min_lr=1e-6,
        verbose=1
    )
    
    # Train
    print("Starting training...")
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // 64,
        epochs=epochs,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // 64,
        callbacks=[checkpoint, early_stop, reduce_lr]
    )
    
    print("Training complete.")

if __name__ == "__main__":
    train_face_model()
