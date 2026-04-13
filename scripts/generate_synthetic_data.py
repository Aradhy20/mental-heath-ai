import sqlite3
import random
from datetime import datetime, timedelta
from faker import Faker
import os

fake = Faker()

# Configuration
DB_PATH = os.path.join(os.path.dirname(__file__), "../backend/mindful_auth.db")
USER_COUNT = 5
DAYS_OF_HISTORY = 30

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create tables if not exists (minimal schema for the synth data)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS mood_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        mood_level TEXT,
        note TEXT,
        timestamp DATETIME
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sleep_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        hours FLOAT,
        quality INTEGER,
        timestamp DATETIME
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS journal_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        content TEXT,
        mood_after TEXT,
        timestamp DATETIME
    )
    ''')
    
    conn.commit()
    return conn

def generate_data():
    print(f"Generating synthetic mental health data in {DB_PATH}...")
    conn = init_db()
    cursor = conn.cursor()
    
    # Clear existing data to avoid duplicates for the demo
    cursor.execute("DELETE FROM mood_logs")
    cursor.execute("DELETE FROM sleep_logs")
    cursor.execute("DELETE FROM journal_entries")
    
    mood_levels = ["very_positive", "positive", "neutral", "negative", "very_negative"]
    
    for user_id in range(1, USER_COUNT + 1):
        print(f"Generating data for User {user_id}...")
        
        # Base mood for this user (some users are generally happier than others)
        user_base_mood = random.choice(mood_levels)
        
        for day in range(DAYS_OF_HISTORY):
            timestamp = datetime.now() - timedelta(days=day)
            
            # 1. Randomize mood around user base
            if random.random() > 0.8: # Occasional outlier days
                mood = random.choice(mood_levels)
            else:
                mood = user_base_mood
            
            cursor.execute(
                "INSERT INTO mood_logs (user_id, mood_level, note, timestamp) VALUES (?, ?, ?, ?)",
                (user_id, mood, fake.sentence(), timestamp.isoformat())
            )
            
            # 2. Daily sleep logs
            hours = round(random.uniform(5.0, 9.5), 1)
            quality = random.randint(1, 5)
            cursor.execute(
                "INSERT INTO sleep_logs (user_id, hours, quality, timestamp) VALUES (?, ?, ?, ?)",
                (user_id, hours, quality, timestamp.isoformat())
            )
            
            # 3. Occasional journal entries (30% chance per day)
            if random.random() < 0.3:
                cursor.execute(
                    "INSERT INTO journal_entries (user_id, content, mood_after, timestamp) VALUES (?, ?, ?, ?)",
                    (user_id, fake.paragraph(nb_sentences=5), mood, timestamp.isoformat())
                )
                
    conn.commit()
    conn.close()
    print("Successfully generated synthetic data.")

if __name__ == "__main__":
    generate_data()
