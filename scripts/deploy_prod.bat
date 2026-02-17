@echo off
echo ===================================================
echo   Mental Health App - Production Deployment Script
echo ===================================================
echo.

echo [1/4] Checking for .env file...
if not exist .env (
    echo Warning: .env file not found! Creating from .env.example...
    copy .env.example .env
    echo Please update .env with secure credentials before proceeding.
    pause
) else (
    echo .env file found.
)

echo.
echo [2/4] Stopping existing containers...
docker-compose -f docker-compose.prod.yml down

echo.
echo [3/4] Building and starting services...
echo This may take a while...
docker-compose -f docker-compose.prod.yml up -d --build

echo.
echo [4/4] Verifying deployment...
timeout /t 10 /nobreak >nul
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo ===================================================
echo   Deployment Complete! 🚀
echo   Frontend: http://localhost:3000
echo ===================================================
pause
