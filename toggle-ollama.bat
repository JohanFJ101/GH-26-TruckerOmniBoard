@echo off
REM Toggle Ollama on/off for DispatchIQ project
REM Usage: toggle-ollama.bat on|off|status

setlocal enabledelayedexpansion

if "%1"=="" goto status
if /i "%1"=="on" goto start_ollama
if /i "%1"=="off" goto stop_ollama
if /i "%1"=="status" goto status
echo Usage: toggle-ollama.bat on^|off^|status
exit /b 1

:start_ollama
echo Checking if Ollama is running...
curl -s http://localhost:11434/api/tags >nul 2>&1
if not errorlevel 1 (
  echo [OK] Ollama is already running on localhost:11434
  exit /b 0
)

echo Starting Ollama...
start /b ollama serve
timeout /t 3 /nobreak

echo Waiting for Ollama to start...
setlocal enabledelayedexpansion
for /l %%i in (1,1,30) do (
  curl -s http://localhost:11434/api/tags >nul 2>&1
  if not errorlevel 1 (
    echo [OK] Ollama started successfully
    exit /b 0
  )
  timeout /t 1 /nobreak
)

echo [ERROR] Ollama failed to start. Run 'ollama serve' manually.
exit /b 1

:stop_ollama
echo Stopping Ollama...
taskkill /IM ollama.exe /F >nul 2>&1
if errorlevel 1 (
  echo [OK] Ollama was not running
) else (
  echo [OK] Ollama stopped
)
exit /b 0

:status
curl -s http://localhost:11434/api/tags >nul 2>&1
if not errorlevel 1 (
  echo Status: [OK] ONLINE - Gemma 4 is running
  echo Endpoint: http://localhost:11434
) else (
  echo Status: [OFFLINE] Using fallback mock data
  echo To enable: toggle-ollama.bat on
)
exit /b 0
