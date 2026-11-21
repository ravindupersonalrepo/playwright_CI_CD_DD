@echo off
setlocal EnableExtensions EnableDelayedExpansion

if "%~1"=="" (
  echo Usage: run-test.cmd ^<test-file^> [additional Playwright args]
  echo Example: run-test.cmd tests\e2e\currency.spec.ts --headed
  echo Example: run-test.cmd tests\e2e\register-login.spec.ts --headed
  exit /b 1
)

set "TEST_FILE=%~1"
set "TEST_FILE=!TEST_FILE:\=/!"
shift
set "EXTRA_ARGS="

:collectArgs
if "%~1"=="" goto runTest
set "EXTRA_ARGS=!EXTRA_ARGS! %~1"
shift
goto collectArgs

:runTest
call "%~dp0scripts\run-playwright.cmd" test "%TEST_FILE%" --project=chromium!EXTRA_ARGS!
set "TEST_EXIT_CODE=%errorlevel%"
if %TEST_EXIT_CODE%==0 (
  start "Monocart Report" "%~dp0open-monocart-report.cmd"
)

echo.
pause
exit /b %TEST_EXIT_CODE%
