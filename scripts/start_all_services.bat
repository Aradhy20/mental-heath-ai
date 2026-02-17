@echo off
echo ==========================================
echo Mental Health App - Starting All Services
echo ==========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

echo [1/8] Starting Auth Service (Port 8001)...
start "Auth Service" cmd /k "cd /d "%~dp0backend\auth_service" && python main.py"
timeout /t 2 /nobreak >nul

echo [2/8] Starting Text Service (Port 8002)...
start "Text Service" cmd /k "cd /d "%~dp0backend\text_service" && python main.py"
timeout /t 2 /nobreak >nul

echo [3/8] Starting Voice Service (Port 8003)...
start "Voice Service" cmd /k "cd /d "%~dp0backend\voice_service" && python main.py"
timeout /t 2 /nobreak >nul

echo [4/8] Starting Face Service (Port 8004)...
start "Face Service" cmd /k "cd /d "%~dp0backend\face_service" && python main.py"
timeout /t 2 /nobreak >nul

echo [5/8] Starting Fusion Service (Port 8005)...
start "Fusion Service" cmd /k "cd /d "%~dp0backend\fusion_service" && python main.py"
timeout /t 2 /nobreak >nul

echo [6/8] Starting Doctor Service (Port 8006)...
start "Doctor Service" cmd /k "cd /d "%~dp0backend\doctor_service" && python main.py"
timeout /t 2 /nobreak >nul

echo [7/8] Starting Notification Service (Port 8007)...
start "Notification Service" cmd /k "cd /d "%~dp0backend\notification_service" && python main.py"
timeout /t 2 /nobreak >nul

echo [8/8] Starting Report Service (Port 8008)...
start "Report Service" cmd /k "cd /d "%~dp0backend\report_service" && python main.py"
timeout /t 2 /nobreak >nul

echo.
echo ==========================================
echo All backend services are starting...
echo Please wait 10 seconds for services to initialize
echo ==========================================
echo.
echo Service URLs:
echo - Auth Service:         http://localhost:8001
echo - Text Service:         http://localhost:8002
echo - Voice Service:        http://localhost:8003
echo - Face Service:         http://localhost:8004
echo - Fusion Service:       http://localhost:8005
echo - Doctor Service:       http://localhost:8006
echo - Notification Service: http://localhost:8007
echo - Report Service:       http://localhost:8008
echo.
echo Frontend (Next.js) should be started separately:
echo   cd frontend
echo   npm run dev
echo.
echo Press any key to open the browser...
pause >nul

start http://localhost:3000

echo.
echo ==========================================
echo All services started!
echo Close this window to keep services running
echo ==========================================
pause
