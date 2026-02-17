-- Create tables for the mental health detection system

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Text analysis results
CREATE TABLE IF NOT EXISTS text_analysis (
    text_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    input_text TEXT,
    emotion_label VARCHAR(50),
    emotion_score DECIMAL(5,4),
    confidence DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Voice analysis results
CREATE TABLE IF NOT EXISTS voice_analysis (
    voice_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    voice_score DECIMAL(5,4),
    voice_label VARCHAR(50),
    confidence DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Face analysis results
CREATE TABLE IF NOT EXISTS face_analysis (
    face_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    face_score DECIMAL(5,4),
    emotion_label VARCHAR(50),
    confidence DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Final fusion results
CREATE TABLE IF NOT EXISTS results (
    result_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    final_score DECIMAL(5,4),
    risk_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(3, 2),
    contact VARCHAR(20)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    notif_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'unread'
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_text_analysis_user_id ON text_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_analysis_user_id ON voice_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_face_analysis_user_id ON face_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_results_user_id ON results(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);