@echo off
echo Starting Mental Health App Services...

echo Starting Auth Service (Port 8001)...
start "Auth Service" /min cmd /k "cd backend\auth_service && python main.py"

echo Starting Text Analysis Service (Port 8002)...
start "Text Service" /min cmd /k "cd backend\text_service && python main.py"

echo Starting Voice Analysis Service (Port 8003)...
start "Voice Service" /min cmd /k "cd backend\voice_service && python main.py"

echo Starting Face Analysis Service (Port 8004)...
start "Face Service" /min cmd /k "cd backend\face_service && python main.py"

echo Starting Fusion Service (Port 8005)...
start "Fusion Service" /min cmd /k "cd backend\fusion_service && python main.py"

echo Starting Doctor Service (Port 8006)...
start "Doctor Service" /min cmd /k "cd backend\doctor_service && python main.py"

echo Starting Notification Service (Port 8007)...
start "Notification Service" /min cmd /k "cd backend\notification_service && python main.py"

echo Starting Mood & Journal Service (Port 8008)...
start "Mood Service" /min cmd /k "cd backend\mood_journal_service && python main.py"

echo Starting Report Service (Port 8009)...
start "Report Service" /min cmd /k "cd backend\report_service && python main.py"

echo Starting Frontend (Port 3000)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo All services started! 
echo Please ensure your environment is set up and SQLite is initialized.
pause

