@echo off
chcp 65001 >nul
echo Creating backup...
powershell -ExecutionPolicy Bypass -File "%~dp0backup.ps1"
echo Done!
pause
