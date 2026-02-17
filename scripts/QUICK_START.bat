@echo off
REM Quick start with health check
echo Checking services...
python check_services.py

if %errorlevel% == 0 (
    echo All services ready!
    cd frontend
    start "Frontend" cmd /k "npm run dev"
    timeout /t 5 /nobreak > nul
    start http://localhost:3000
) else (
    echo Please start services first: start_complete_app.bat
    pause
)
