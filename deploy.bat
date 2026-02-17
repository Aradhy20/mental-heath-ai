@echo off
REM Mental Health App - Windows Deployment Script
REM Deploys frontend to Vercel

echo ========================================
echo   Mental Health App - Quick Deploy
echo ========================================
echo.

REM Check if Vercel is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Vercel CLI not found. Installing...
    call npm install -g vercel
)

echo.
echo [1/3] Building Frontend...
cd frontend
call npm install
call npm run build

echo.
echo [2/3] Deploying to Vercel...
call vercel --prod

echo.
echo [3/3] Deployment Complete!
echo.
echo ========================================
echo   Your app is now live on Vercel!
echo ========================================
echo.
echo Next steps:
echo 1. Note your Vercel URL
echo 2. For backend, use Railway or Render
echo 3. Update API URLs in environment variables
echo.
pause
