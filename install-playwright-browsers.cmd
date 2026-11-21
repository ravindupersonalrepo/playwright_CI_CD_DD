@echo off
setlocal

cd /d "%~dp0"

set "PLAYWRIGHT_BROWSERS_PATH=0"
set "NODE_TLS_REJECT_UNAUTHORIZED=0"
set "LOCAL_BROWSERS_DIR="

for /d %%D in ("node_modules\.pnpm\playwright-core@*\node_modules\playwright-core\.local-browsers") do (
  set "LOCAL_BROWSERS_DIR=%%~fD"
  goto localBrowsersResolved
)

:localBrowsersResolved
if defined LOCAL_BROWSERS_DIR (
  if exist "%LOCAL_BROWSERS_DIR%\__dirlock" (
    del /f /q "%LOCAL_BROWSERS_DIR%\__dirlock"
  )
)

call "%~dp0scripts\run-playwright.cmd" install chromium ffmpeg

if errorlevel 1 (
  echo.
  echo First browser install attempt failed. Cleaning the local Playwright browser cache and retrying once...

  if defined LOCAL_BROWSERS_DIR (
    if exist "%LOCAL_BROWSERS_DIR%\__dirlock" (
      del /f /q "%LOCAL_BROWSERS_DIR%\__dirlock"
    )

    if exist "%LOCAL_BROWSERS_DIR%" (
      rmdir /s /q "%LOCAL_BROWSERS_DIR%"
      mkdir "%LOCAL_BROWSERS_DIR%"
    )
  )

  call "%~dp0scripts\run-playwright.cmd" install chromium ffmpeg
)

if errorlevel 1 (
  echo.
  echo Browser installation failed.
  echo Run this file again after the current download is fully stopped.
  pause
  exit /b 1
)

echo.
echo Browser installation finished successfully.
pause
