@echo off
npx tsx "%~dp0scripts\new-issue.ts" %*
if "%~1"=="" timeout /t 3 >nul
