@echo off
setlocal EnableExtensions

rem ============================================================================
rem uPOE - install/update local loot filter for Path of Exile 1
rem Source: uPOE.filter from this project folder
rem Target: Documents\My Games\Path of Exile\uPOE.filter
rem ============================================================================

set "SOURCE=%~dp0uPOE.filter"

if not exist "%SOURCE%" (
    echo [ERROR] uPOE.filter was not found next to this BAT file.
    echo Expected: "%SOURCE%"
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
set "BACKUP=%DEST_DIR%\uPOE.filter.bak"

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

rem Keep one backup of the previously installed filter.
if exist "%DEST%" copy /Y "%DEST%" "%BACKUP%" >nul

copy /Y "%SOURCE%" "%DEST%" >nul
if errorlevel 1 (
    echo [ERROR] Could not copy the filter.
    echo Source: "%SOURCE%"
    echo Target: "%DEST%"
    echo.
    pause
    exit /b 1
)

rem Basic verification: source and destination must have the same file size.
for %%A in ("%SOURCE%") do set "SOURCE_SIZE=%%~zA"
for %%A in ("%DEST%") do set "DEST_SIZE=%%~zA"

if not "%SOURCE_SIZE%"=="%DEST_SIZE%" (
    echo [ERROR] Copy verification failed: file sizes differ.
    echo.
    pause
    exit /b 1
)

echo.
echo ==============================================
echo uPOE FILTER UPDATED SUCCESSFULLY
echo ==============================================
echo Source:
echo   %SOURCE%
echo.
echo Installed to:
echo   %DEST%
echo.
if exist "%BACKUP%" (
    echo Previous version backup:
    echo   %BACKUP%
    echo.
)
echo In Path of Exile select item filter: uPOE
echo If the game is already running, reload the item filter in Options.
echo.
pause

endlocal
