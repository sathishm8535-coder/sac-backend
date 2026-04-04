@echo off
echo ========================================
echo   Exam System - Complete Setup
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [2/4] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo [3/4] Checking Environment Files...
if not exist ".env" (
    echo Creating frontend .env file...
    copy .env.example .env
)
cd ..\backend
if not exist ".env" (
    echo Creating backend .env file...
    copy .env.example .env
)
cd ..
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo IMPORTANT: Update your MongoDB connection string in backend\.env
echo.
echo To start the application:
echo   1. Backend:  cd backend  ^&^& npm run dev
echo   2. Frontend: cd frontend ^&^& npm run dev
echo.
pause
