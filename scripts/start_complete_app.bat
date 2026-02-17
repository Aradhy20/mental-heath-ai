@echo off
echo ========================================
echo Mental Health App - Complete Startup
echo MongoDB + Backend Services + Frontend
echo ========================================
echo.

REM Check if MongoDB is running
echo [1/3] Checking MongoDB status...
timeout /t 1 /nobreak > nul

sc query MongoDB | find "RUNNING" > nul
if %errorlevel% == 0 (
    echo   [OK] MongoDB is running
) else (
    echo   [!] MongoDB is not running
    echo   Starting MongoDB service...
    net start MongoDB
    if %errorlevel% == 0 (
        echo   [OK] MongoDB started successfully
    ) else (
        echo   [ERROR] Could not start MongoDB
        echo.
        echo   Please start MongoDB manually:
        echo   - Option 1: Run "net start MongoDB" as Administrator
        echo   - Option 2: Start mongod manually: "mongod --dbpath=C:\data\db"
        echo   - Option 3: Use Docker: "docker run -d -p 27017:27017 mongo"
        echo.
        pause
    )
)

echo.
echo [2/3] Starting Backend Services...
timeout /t 1 /nobreak > nul

REM Start backend services in new windows
echo   - Starting Auth Service (Port 8001)...
start "Auth Service" cmd /k "cd backend\auth_service && "D:\mental  health app\venv\Scripts\python.exe" main.py"
timeout /t 2 /nobreak > nul

echo   - Starting Text Service (Port 8002)...
start "Text Service" cmd /k "cd backend\text_service && "D:\mental  health app\venv\Scripts\python.exe" main.py"
timeout /t 2 /nobreak > nul

echo   - Starting Voice Service (Port 8003)...
start "Voice Service" cmd /k "cd backend\voice_service && "D:\mental  health app\venv\Scripts\python.exe" main.py"
timeout /t 2 /nobreak > nul

echo   - Starting Face Service (Port 8004)...
start "Face Service" cmd /k "cd backend\face_service && "D:\mental  health app\venv\Scripts\python.exe" main.py"
timeout /t 2 /nobreak > nul

echo   - Starting Fusion Service (Port 8005)...
start "Fusion Service" cmd /k "cd backend\fusion_service && "D:\mental  health app\venv\Scripts\python.exe" main.py"
timeout /t 2 /nobreak > nul

echo   - Starting Mood/Journal Service (Port 8008)...
start "Mood/Journal Service" cmd /k "cd backend\mood_journal_service && "D:\mental  health app\venv\Scripts\python.exe" main.py"
timeout /t 2 /nobreak > nul

echo.
echo [3/3] Starting Frontend...
timeout /t 3 /nobreak > nul
echo   - Starting Next.js Frontend (Port 3000)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo  All Services Started Successfully!
echo ========================================
echo.
echo  Services Running:
echo  - MongoDB:        localhost:27017
echo  - Auth:           http://localhost:8001
echo  - Text Analysis:  http://localhost:8002
echo  - Voice Analysis: http://localhost:8003
echo  - Face Analysis:  http://localhost:8004
echo  - Fusion:         http://localhost:8005
echo  - Mood/Journal:   http://localhost:8008
echo  - Frontend:       http://localhost:3000
echo.
echo  Wait 10-15 seconds for all services to fully start.
echo  Then open: http://localhost:3000
echo.
echo  Press any key to open the app in your browser...
pause

REM Open browser after 10 seconds
timeout /t 10 /nobreak > nul
start http://localhost:3000

echo.
echo  To stop all services:
echo  - Close all terminal windows
echo  - Or run: stop_all_services.bat
echo.
