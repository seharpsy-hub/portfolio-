@echo off
setlocal enabledelayedexpansion
title Universal Portfolio CMS - Setup
color 0A

echo ============================================
echo   UNIVERSAL PORTFOLIO CMS - AUTO SETUP
echo ============================================
echo.
echo This will check your system and set up:
echo   - Frontend (Next.js)
echo   - Backend  (FastAPI + Python)
echo   - Environment files
echo   - Project folders
echo.
pause

REM ==============================================
REM STEP 1: Check Node.js
REM ==============================================
echo.
echo [1/6] Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo   [X] Node.js is NOT installed.
    echo       Please download and install it from: https://nodejs.org
    echo       ^(choose the LTS version^), then run this file again.
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%v in ('node -v') do echo   [OK] Node.js found: %%v
)

REM ==============================================
REM STEP 2: Check Python
REM ==============================================
echo.
echo [2/6] Checking Python...
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo   [X] Python is NOT installed.
    echo       Please download and install it from: https://python.org
    echo       ^(check "Add Python to PATH" during install^), then run this file again.
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%v in ('python --version') do echo   [OK] Python found: %%v
)

REM ==============================================
REM STEP 3: Create Project Folders
REM ==============================================
echo.
echo [3/6] Creating project folders...

if not exist "frontend" mkdir frontend
if not exist "backend" mkdir backend
if not exist "backend\app" mkdir backend\app
if not exist "media" mkdir media

echo   [OK] Folders created: frontend, backend, media

REM ==============================================
REM STEP 4: Setup Frontend (Next.js)
REM ==============================================
echo.
echo [4/6] Setting up Frontend (Next.js)...

cd frontend
if not exist "package.json" (
    echo   Installing Next.js project... this may take a few minutes.
    call npx --yes create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
) else (
    echo   [OK] Next.js project already exists, skipping.
)
cd ..

REM ==============================================
REM STEP 5: Setup Backend (FastAPI)
REM ==============================================
echo.
echo [5/6] Setting up Backend (FastAPI + Python)...

cd backend

if not exist "venv" (
    echo   Creating Python virtual environment...
    python -m venv venv
)

echo   Activating virtual environment and installing packages...
call venv\Scripts\activate.bat

python -m pip install --upgrade pip >nul
pip install fastapi uvicorn[standard] sqlalchemy psycopg2-binary python-dotenv pydantic alembic redis >nul

if not exist "app\main.py" (
    echo from fastapi import FastAPI> app\main.py
    echo.>> app\main.py
    echo app = FastAPI(title="Universal Portfolio CMS API")>> app\main.py
    echo.>> app\main.py
    echo @app.get("/")>> app\main.py
    echo def read_root():>> app\main.py
    echo     return {"message": "Universal Portfolio CMS API is running"}>> app\main.py
)

if not exist "requirements.txt" (
    pip freeze > requirements.txt
)

call venv\Scripts\deactivate.bat
cd ..

echo   [OK] Backend environment ready.

REM ==============================================
REM STEP 6: Create Environment Files
REM ==============================================
echo.
echo [6/6] Creating environment files...

if not exist "backend\.env" (
    (
        echo DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio_cms
        echo REDIS_URL=redis://localhost:6379
        echo SECRET_KEY=change_this_secret_key
        echo ENVIRONMENT=development
    ) > backend\.env
    echo   [OK] backend\.env created ^(edit your DB password before running^)
) else (
    echo   [OK] backend\.env already exists, skipping.
)

if not exist "frontend\.env.local" (
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000
    ) > frontend\.env.local
    echo   [OK] frontend\.env.local created
) else (
    echo   [OK] frontend\.env.local already exists, skipping.
)

REM ==============================================
REM DONE
REM ==============================================
echo.
echo ============================================
echo   SETUP COMPLETE!
echo ============================================
echo.
echo Next steps:
echo   1. Edit backend\.env with your real PostgreSQL password.
echo   2. Make sure PostgreSQL and Redis are installed and running.
echo   3. To start the backend:
echo        cd backend
echo        venv\Scripts\activate
echo        uvicorn app.main:app --reload
echo.
echo   4. To start the frontend ^(in a new terminal window^):
echo        cd frontend
echo        npm run dev
echo.
echo   5. Open http://localhost:3000 in your browser.
echo.
pause
