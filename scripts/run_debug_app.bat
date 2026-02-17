@echo off
setlocal
echo ========================================
echo   MENTAL HEALTH APP - DEBUG LAUNCH
echo ========================================
echo.

REM 0. Virtual Environment Setup
echo [0/6] Checking Virtual Environment...
if not exist "venv" (
    echo   [!] Virtual environment not found. Creating...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo   [ERROR] Failed to create virtual environment.
        pause
        exit /b
    )
    echo   [OK] Created venv. Installing constraints...
    call venv\Scripts\activate
    python -m pip install --upgrade pip
    echo   [!] Installing base requirements...
    pip install -r requirements.txt
) else (
    echo   [OK] Virtual environment found.
    call venv\Scripts\activate
)
echo.

REM 1. Check Python
echo [1/6] Checking Python...
python --version
if %errorlevel% neq 0 (
    echo [ERROR] Python is not working correctly in venv!
    pause
    exit /b
)
echo [OK] Using Python from %VIRTUAL_ENV%
echo.

REM 2. Check Database Status
echo [2/6] Checking SQLite Database Status...
python check_sqlite_status.py
echo.

REM 3. Check Dependencies (Quick Check)
echo [3/6] Checking Dependencies...
python -c "import fastapi, uvicorn, sqlalchemy" > nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Core dependencies might be missing. Installing...
    pip install fastapi uvicorn sqlalchemy python-multipart
) else (
    echo [OK] Core dependencies found.
)
echo.

REM 4. Start Backend Services
echo [4/6] Starting All Backend Services...
echo.
echo   Starting shared services launcher...
echo   (This will open separate windows for each service)
echo.

set "VENV_ACTIVATE=%CD%\venv\Scripts\activate.bat"

cd backend

REM Start Auth Service
start "Auth Service (SQLite)" cmd /k "call "%VENV_ACTIVATE%" && echo Starting Auth... && python auth_service/main.py"

REM Start Text Service
start "Text Service (SQLite)" cmd /k "call "%VENV_ACTIVATE%" && echo Starting Text... && python text_service/main.py"

REM Start Voice Service
start "Voice Service (SQLite)" cmd /k "call "%VENV_ACTIVATE%" && echo Starting Voice... && python voice_service/main.py"

REM Start Face Service
start "Face Service (SQLite)" cmd /k "call "%VENV_ACTIVATE%" && echo Starting Face... && python face_service/main.py"

REM Start Fusion Service
start "Fusion Service" cmd /k "call "%VENV_ACTIVATE%" && echo Starting Fusion... && python fusion_service/main.py"

REM Start Mood Service
start "Mood Service (SQLite)" cmd /k "call "%VENV_ACTIVATE%" && echo Starting Mood... && python mood_journal_service/main.py"

cd ..
timeout /t 5 /nobreak > nul

REM 5. Start Frontend
echo.
echo [5/6] Starting Frontend...
cd frontend
if exist "node_modules" (
    echo [OK] node_modules found.
) else (
    echo [WARNING] node_modules not found. Running npm install...
    call npm install
)

echo Starting Next.js...
start "Frontend" cmd /k "npm run dev"

echo.
echo ===================================================
echo   DEBUG STARTUP COMPLETE
echo ===================================================
echo.
echo   Backend APIs:
echo   - Auth:   http://localhost:8001/health
echo   - Text:   http://localhost:8002/health
echo   - Voice:  http://localhost:8003/health
echo   - Face:   http://localhost:8004/health
echo   - Fusion: http://localhost:8005/health
echo   - Mood:   http://localhost:8008/health
echo.
echo   Frontend: http://localhost:3000
echo.
echo   Check the opened terminal windows for any error messages.
echo.
echo   Launch complete. Exiting launcher in 10 seconds...
timeout /t 10
