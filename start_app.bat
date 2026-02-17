@echo off
echo ========================================
echo Mental Health App - Full Application Start
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.12+ and try again
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js and try again
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed
    echo Please install Node.js (which includes npm) and try again
    pause
    exit /b 1
)

echo [1/3] Starting Backend Services...
echo.

REM Start the full application using Python script
python scripts/start_full_app.py

echo.
echo Press any key to exit...
pause >nul