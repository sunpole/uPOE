@echo off
setlocal EnableExtensions

rem ============================================================================
rem uPOE - install/update local loot filter for Path of Exile 1
rem
rem Installs:
rem   1) uPOE.filter                 - our custom rules (Currency first)
rem   2) NeverSink-0-SOFT.filter    - full fallback foundation
rem
rem NeverSink is downloaded from the official NeverSinkDev GitHub repository.
rem ============================================================================

set "SOURCE=%~dp0uPOE.filter"
set "VENDOR_DIR=%~dp0vendor"
set "NS_SOURCE=%VENDOR_DIR%\NeverSink-0-SOFT.filter"
set "NS_TEMP=%VENDOR_DIR%\NeverSink-0-SOFT.filter.tmp"
set "NS_URL=https://raw.githubusercontent.com/NeverSinkDev/NeverSink-Filter/master/NeverSink%%27s%%20filter%%20-%%200-SOFT.filter"

if not exist "%SOURCE%" (
    echo [ERROR] uPOE.filter was not found next to this BAT file.
    echo Expected: "%SOURCE%"
    echo.
    pause
    exit /b 1
)

if not exist "%VENDOR_DIR%" mkdir "%VENDOR_DIR%" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Could not create vendor folder:
    echo "%VENDOR_DIR%"
    echo.
    pause
    exit /b 1
)

echo.
echo ==============================================
echo uPOE - UPDATING NEVER SINK FOUNDATION
echo ==============================================

del /Q "%NS_TEMP%" >nul 2>&1

where curl.exe >nul 2>&1
if not errorlevel 1 (
    curl.exe -L --fail --silent --show-error "%NS_URL%" -o "%NS_TEMP%"
) else (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; Invoke-WebRequest -UseBasicParsing -Uri '%NS_URL%' -OutFile '%NS_TEMP%'"
)

if exist "%NS_TEMP%" (
    findstr /C:"NeverSink's Indepth Loot Filter" "%NS_TEMP%" >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] Downloaded file did not pass NeverSink header validation.
        del /Q "%NS_TEMP%" >nul 2>&1
    ) else (
        findstr /C:"TYPE:     0-SOFT" "%NS_TEMP%" >nul 2>&1
        if errorlevel 1 (
            echo [WARNING] Downloaded file is not NeverSink 0-SOFT.
            del /Q "%NS_TEMP%" >nul 2>&1
        ) else (
            move /Y "%NS_TEMP%" "%NS_SOURCE%" >nul
            echo [OK] NeverSink 0-SOFT downloaded and validated.
        )
    )
)

if not exist "%NS_SOURCE%" (
    echo [ERROR] NeverSink 0-SOFT could not be downloaded and no cached copy exists.
    echo uPOE itself is safe because the Import is Optional, but the full foundation
    echo would be missing, so installation is stopped here.
    echo.
    pause
    exit /b 1
)

rem Ask Windows for the real Documents folder. This also works when Documents
rem is redirected to OneDrive or another location.
for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "[Environment]::GetFolderPath('MyDocuments')"`) do set "DOCS=%%I"
if not defined DOCS set "DOCS=%USERPROFILE%\Documents"

set "DEST_DIR=%DOCS%\My Games\Path of Exile"
set "DEST=%DEST_DIR%\uPOE.filter"
set "NS_DEST=%DEST_DIR%\NeverSink-0-SOFT.filter"
set "BACKUP=%DEST_DIR%\uPOE.filter.bak"
set "NS_BACKUP=%DEST_DIR%\NeverSink-0-SOFT.filter.bak"

if not exist "%DEST_DIR%" (
    mkdir "%DEST_DIR%" >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Could not create Path of Exile filter folder:
        echo "%DEST_DIR%"
        echo.
        pause
        exit /b 1
    )
)

rem Keep one backup of the previously installed files.
if exist "%DEST%" copy /Y "%DEST%" "%BACKUP%" >nul
if exist "%NS_DEST%" copy /Y "%NS_DEST%" "%NS_BACKUP%" >nul

copy /Y "%SOURCE%" "%DEST%" >nul
if errorlevel 1 (
    echo [ERROR] Could not copy uPOE.filter.
    pause
    exit /b 1
)

copy /Y "%NS_SOURCE%" "%NS_DEST%" >nul
if errorlevel 1 (
    echo [ERROR] Could not copy NeverSink foundation.
    pause
    exit /b 1
)

rem Basic verification: source and destination sizes must match.
for %%A in ("%SOURCE%") do set "SOURCE_SIZE=%%~zA"
for %%A in ("%DEST%") do set "DEST_SIZE=%%~zA"
for %%A in ("%NS_SOURCE%") do set "NS_SOURCE_SIZE=%%~zA"
for %%A in ("%NS_DEST%") do set "NS_DEST_SIZE=%%~zA"

if not "%SOURCE_SIZE%"=="%DEST_SIZE%" (
    echo [ERROR] uPOE copy verification failed.
    pause
    exit /b 1
)

if not "%NS_SOURCE_SIZE%"=="%NS_DEST_SIZE%" (
    echo [ERROR] NeverSink copy verification failed.
    pause
    exit /b 1
)

echo.
echo ==============================================
echo uPOE + NEVER SINK FOUNDATION INSTALLED
echo ==============================================
echo.
echo uPOE:
echo   %DEST%
echo.
echo Foundation:
echo   %NS_DEST%
echo.
for /f "tokens=*" %%V in ('findstr /C:"# VERSION:" "%NS_SOURCE%"') do echo NeverSink %%V
for /f "tokens=*" %%V in ('findstr /C:"# TYPE:" "%NS_SOURCE%"') do echo NeverSink %%V
echo.
echo In Path of Exile select item filter: uPOE
echo If the game is already running, reload the item filter in Options.
echo.
pause

endlocal
