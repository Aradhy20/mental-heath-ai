import os
import tensorflow as tf
import ssl
ssl._create_default_https_context = ssl._create_unverified_context
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau

# Paths
PROCESS_ROOT = "/Users/aradhyjain/Desktop/project/ai_models/face/training/processed_dataset"
TRAIN_DIR = os.path.join(PROCESS_ROOT, "train")
VAL_DIR = os.path.join(PROCESS_ROOT, "valid")
MODEL_OUT = "/Users/aradhyjain/Desktop/project/ai_models/face/model/face_model_v2.h5"

# Config
IMG_SIZE = (224, 224) # Standard for MobileNetV2
BATCH_SIZE = 32
EPOCHS = 15 # Fast training for now
NUM_CLASSES = 3 # Anxiety, Depress, Normal

def build_model():
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3))
    base_model.trainable = False # Freeze base
    
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(NUM_CLASSES, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model

def train():
    # Augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest'
    )
    val_datagen = ImageDataGenerator(rescale=1./255)

    print("Loading datasets...")
    train_gen = train_datagen.flow_from_directory(
        TRAIN_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )
    
    val_gen = val_datagen.flow_from_directory(
        VAL_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )

    model = build_model()
    
    # Callbacks
    os.makedirs(os.path.dirname(MODEL_OUT), exist_ok=True)
    checkpoint = ModelCheckpoint(MODEL_OUT, monitor='val_accuracy', save_best_only=True, mode='max', verbose=1)
    early_stop = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3, min_lr=0.00001)

    print("Starting Transfer Learning Phase...")
    model.fit(
        train_gen,
        epochs=EPOCHS,
        validation_data=val_gen,
        callbacks=[checkpoint, early_stop, reduce_lr]
    )
    
    # Optional: Unfreeze some layers for fine-tuning
    print("Starting Fine-tuning Phase...")
    model.layers[0].trainable = True
    # Freeze everything except the last 20 layers
    for layer in model.layers[0].layers[:-20]:
        layer.trainable = False
        
    model.compile(optimizer=tf.keras.optimizers.Adam(1e-5), loss='categorical_crossentropy', metrics=['accuracy'])
    
    model.fit(
        train_gen,
        epochs=5,
        validation_data=val_gen,
        callbacks=[checkpoint, early_stop]
    )

    print(f"Training complete. Best model saved to {MODEL_OUT}")

if __name__ == "__main__":
    train()
