@echo off
setlocal

set "REPORT_FILE=%~dp0playwright-report\index.html"

if not exist "%REPORT_FILE%" (
  echo Playwright HTML report was not found.
  echo Expected: "%REPORT_FILE%"
  exit /b 1
)

start "Playwright Report" "%REPORT_FILE%"
exit /b 0
