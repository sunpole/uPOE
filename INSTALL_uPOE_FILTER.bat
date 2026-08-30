@echo off
setlocal EnableExtensions

rem ============================================================================
rem uPOE - ONE CLICK UPDATE + INSTALL for Path of Exile 1
rem
rem Order:
rem   1) safely sync this local repository with GitHub main
rem   2) download/update NeverSink 0-SOFT foundation
rem   3) install uPOE.filter + NeverSink foundation into Path of Exile
rem
rem Safety:
rem   - refuses to overwrite local Git changes
rem   - uses git pull --ff-only (no automatic merge commits)
rem   - stops installation if GitHub sync fails
rem ============================================================================

set "PROJECT_DIR=%~dp0"
set "SOURCE=%PROJECT_DIR%uPOE.filter"
set "VENDOR_DIR=%PROJECT_DIR%vendor"
set "NS_SOURCE=%VENDOR_DIR%\NeverSink-0-SOFT.filter"
set "NS_TEMP=%VENDOR_DIR%\NeverSink-0-SOFT.filter.tmp"
set "NS_URL=https://raw.githubusercontent.com/NeverSinkDev/NeverSink-Filter/master/NeverSink%%27s%%20filter%%20-%%200-SOFT.filter"


echo.
echo ==============================================
echo uPOE - GITHUB SYNC
echo ==============================================
echo.

where git.exe >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git was not found in PATH.
    echo Install/repair Git for Windows, then run this BAT again.
    echo.
    pause
    exit /b 1
)

if not exist "%PROJECT_DIR%.git" (
    echo [ERROR] This folder is not the uPOE Git repository.
    echo Expected .git folder in:
    echo   %PROJECT_DIR%
    echo.
    pause
    exit /b 1
)

set "CURRENT_BRANCH="
for /f "usebackq delims=" %%B in (`git -C "%PROJECT_DIR%" branch --show-current 2^>nul`) do set "CURRENT_BRANCH=%%B"
if /I not "%CURRENT_BRANCH%"=="main" (
    echo [ERROR] uPOE must be on branch main before automatic update.
    echo Current branch: %CURRENT_BRANCH%
    echo.
    pause
    exit /b 1
)

rem Never destroy or hide local work. If tracked/untracked non-ignored files exist,
rem stop and let the user decide what to commit/stash/remove first.
set "DIRTY_REPO="
for /f "usebackq delims=" %%S in (`git -C "%PROJECT_DIR%" status --porcelain --untracked-files=all 2^>nul`) do set "DIRTY_REPO=1"
if defined DIRTY_REPO (
    echo [ERROR] Local Git changes were found.
    echo Automatic sync is stopped so nothing local is overwritten.
    echo.
    git -C "%PROJECT_DIR%" status --short
    echo.
    echo Commit, stash, or remove these changes and run the BAT again.
    pause
    exit /b 1
)

echo [1/3] Pulling latest uPOE from GitHub main...
git -C "%PROJECT_DIR%" pull --ff-only origin main
if errorlevel 1 (
    echo.
    echo [ERROR] GitHub sync failed.
    echo Installation was stopped so an outdated uPOE.filter is not copied to the game.
    echo Check internet/GitHub access and run this BAT again.
    echo.
    pause
    exit /b 1
)

set "GIT_HEAD="
for /f "usebackq delims=" %%H in (`git -C "%PROJECT_DIR%" rev-parse --short HEAD 2^>nul`) do set "GIT_HEAD=%%H"
echo [OK] GitHub synchronized. main @ %GIT_HEAD%
echo.

rem SOURCE is checked only AFTER git pull, so the file copied to PoE is the newest one.
if not exist "%SOURCE%" (
    echo [ERROR] uPOE.filter was not found after GitHub sync.
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


echo ==============================================
echo uPOE - UPDATING NEVER SINK FOUNDATION
echo ==============================================
echo.
echo [2/3] Downloading NeverSink 0-SOFT...

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


echo.
echo ==============================================
echo uPOE - INSTALLING INTO PATH OF EXILE
echo ==============================================
echo.
echo [3/3] Backing up and copying filters...

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
echo uPOE FULL UPDATE COMPLETED SUCCESSFULLY
echo ==============================================
echo.
echo GitHub:
echo   main @ %GIT_HEAD%
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
echo Next time you only need to double-click this BAT.
echo It will sync GitHub first and install the newest filter automatically.
echo.
pause

endlocal
