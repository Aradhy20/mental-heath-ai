import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.utils import resample
import torch

class DataCleaner:
    def __init__(self, random_state=42):
        self.random_state = random_state

    def clean_text_data(self, df: pd.DataFrame, text_col='content', label_col='sentiment') -> pd.DataFrame:
        """Removes nulls, duplicates, and extremely short/long texts."""
        df = df.dropna(subset=[text_col, label_col])
        df = df.drop_duplicates(subset=[text_col])
        df['word_count'] = df[text_col].apply(lambda x: len(str(x).split()))
        df = df[(df['word_count'] > 2) & (df['word_count'] < 100)].copy()
        
        # Standardize labels to core emotions
        sentiment_map = {
            "happiness": "happy", "enthusiasm": "happy", "fun": "happy", "love": "happy",
            "sadness": "sad", "empty": "sad",
            "worry": "anxious", 
            "anger": "angry", "hate": "angry", 
            "neutral": "neutral", "boredom": "neutral", "relief": "neutral", "surprise": "neutral"
        }
        df['core_emotion'] = df[label_col].map(sentiment_map).fillna('neutral')
        return df

    def balance_classes(self, df: pd.DataFrame, label_col='core_emotion', strategy='oversample') -> pd.DataFrame:
        """Balances classes to prevent bias towards majority emotions."""
        class_counts = df[label_col].value_counts()
        target_count = class_counts.max() if strategy == 'oversample' else class_counts.min()
        
        dfs = []
        for label in class_counts.index:
            df_class = df[df[label_col] == label]
            if len(df_class) == target_count:
                dfs.append(df_class)
            else:
                df_resampled = resample(
                    df_class, 
                    replace=(strategy == 'oversample'),     
                    n_samples=target_count,    
                    random_state=self.random_state
                )
                dfs.append(df_resampled)
        
        return pd.concat(dfs).sample(frac=1, random_state=self.random_state).reset_index(drop=True)

    def split_data(self, dataset, test_size=0.15, val_size=0.15):
        """Standard Train/Val/Test Split."""
        train_val, test = train_test_split(dataset, test_size=test_size, random_state=self.random_state)
        val_prop = val_size / (1.0 - test_size)
        train, val = train_test_split(train_val, test_size=val_prop, random_state=self.random_state)
        return train, val, test

    @staticmethod
    def get_class_weights(df, label_col='core_emotion', num_classes=5):
        """Returns torch tensor of class weights for Loss Functions."""
        counts = df[label_col].value_counts()
        total = len(df)
        weights = []
        emotion_map = {"happy": 0, "sad": 1, "anxious": 2, "angry": 3, "neutral": 4}
        
        # Initialize default weights
        class_weights = np.ones(num_classes)
        for emo, count in counts.items():
            if emo in emotion_map:
                idx = emotion_map[emo]
                class_weights[idx] = total / (num_classes * count)
                
        return torch.tensor(class_weights, dtype=torch.float32)
