@echo off
title UniCollab - Campus Network
echo ====================================================
echo Starting UniCollab Platform (Unified Port 8000)...
echo ====================================================
set PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%
start "" "http://localhost:8000"
cd backend
py run.py
pause
