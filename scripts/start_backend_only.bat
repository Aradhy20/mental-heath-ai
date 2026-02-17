@echo off
echo Starting Backend Services...

cd backend

start "Auth Service (8001)" cmd /k "python auth_service/main.py"
timeout /t 2 /nobreak >nul

start "Text Analysis (8002)" cmd /k "python text_service/main.py"
timeout /t 2 /nobreak >nul

start "Voice Analysis (8003)" cmd /k "python voice_service/main.py"
timeout /t 2 /nobreak >nul

start "Face Analysis (8004)" cmd /k "python face_service/main.py"
timeout /t 2 /nobreak >nul

start "Fusion Service (8005)" cmd /k "python fusion_service/main.py"
timeout /t 2 /nobreak >nul

start "Doctor Service (8006)" cmd /k "python doctor_service/main.py"
timeout /t 2 /nobreak >nul

start "Notification Service (8007)" cmd /k "python notification_service/main.py"
timeout /t 2 /nobreak >nul

start "Report Service (8008)" cmd /k "python report_service/main.py"
timeout /t 2 /nobreak >nul

echo All backend services started.
