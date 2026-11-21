@echo off
setlocal

set "REPORT_FILE=%~dp0monocart-report\index.html"

if not exist "%REPORT_FILE%" (
  echo Monocart report was not found.
  echo Expected: "%REPORT_FILE%"
  echo Run a Playwright test first to generate the Monocart report.
  exit /b 1
)

start "Monocart Report" "%REPORT_FILE%"
exit /b 0
