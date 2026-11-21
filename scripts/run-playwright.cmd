@echo off
setlocal

for %%I in ("%~dp0..") do cd /d "%%~fI"
if errorlevel 1 (
  echo Project root could not be resolved.
  exit /b 1
)

set "PATH=%APPDATA%\npm;%PATH%"
set "NODE_DIR="

for /f "tokens=2,*" %%A in ('reg query "HKLM\SOFTWARE\Node.js" /v InstallPath 2^>nul ^| find "InstallPath"') do set "NODE_DIR=%%B"

if not defined NODE_DIR (
  for /f "tokens=2,*" %%A in ('reg query "HKCU\SOFTWARE\Node.js" /v InstallPath 2^>nul ^| find "InstallPath"') do set "NODE_DIR=%%B"
)

if defined NODE_DIR (
  set "PATH=%NODE_DIR%;%PATH%"
)

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js was not found. Install Node.js or add it to PATH.
  exit /b 1
)

set "PLAYWRIGHT_CMD="
where npx.cmd >nul 2>&1
if not errorlevel 1 (
  set "PLAYWRIGHT_CMD=npx.cmd playwright"
)

if not defined PLAYWRIGHT_CMD (
  if exist "%ProgramFiles%\nodejs\npx.cmd" (
    set "PLAYWRIGHT_CMD=%ProgramFiles%\nodejs\npx.cmd playwright"
  )
)

if not defined PLAYWRIGHT_CMD (
  where pnpm >nul 2>&1
  if not errorlevel 1 (
    set "PLAYWRIGHT_CMD=pnpm exec playwright"
  )
)

if not defined PLAYWRIGHT_CMD (
  if exist "%APPDATA%\npm\pnpm.cmd" (
    set "PLAYWRIGHT_CMD=%APPDATA%\npm\pnpm.cmd exec playwright"
  )
)

if not defined PLAYWRIGHT_CMD (
  echo Neither npx nor pnpm was found. Install Node.js tools or add them to PATH.
  exit /b 1
)

set "PLAYWRIGHT_BROWSERS_PATH=0"

if /i "%~1"=="install" (
  set "NODE_TLS_REJECT_UNAUTHORIZED=0"
)

if "%~1"=="" (
  echo No Playwright command was provided.
  exit /b 1
)

call %PLAYWRIGHT_CMD% %*
exit /b %errorlevel%
