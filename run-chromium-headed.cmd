@echo off
call "%~dp0scripts\run-playwright.cmd" test --project=chromium --headed
set "TEST_EXIT_CODE=%errorlevel%"
if %TEST_EXIT_CODE%==0 (
  start "Monocart Report" "%~dp0open-monocart-report.cmd"
)

echo.
pause
exit /b %TEST_EXIT_CODE%
