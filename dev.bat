@echo off
title UniCollab - Hot Reload Development Mode
echo Starting Backend & Frontend in separate windows...
set PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%
start "UniCollab Backend" cmd /k "cd backend && py run.py"
start "UniCollab Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul
start "" "http://localhost:5173"
