@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   Universal Starter Kit - Building Android Release APK
echo ========================================================

if "%ANDROID_HOME%"=="" (
    set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
)

:: Ensure Android project is ejected/generated if not present
if not exist "android" (
    echo [INFO] Generating native Android project with Expo Prebuild...
    call npx expo prebuild --platform android --clean --no-install
)

:: Bypass Windows 260-character path limit with virtual drive
subst X: /d 2>nul
subst X: "%CD%"
if errorlevel 1 (
    set "WORK_DIR=%CD%"
) else (
    set "WORK_DIR=X:"
)

echo sdk.dir=%ANDROID_HOME:\=\\%> "%WORK_DIR%\android\local.properties"

pushd "%WORK_DIR%\android"
call gradlew.bat assembleRelease --no-daemon -x lint -x test
set BUILD_ERR=%ERRORLEVEL%
popd

if "%WORK_DIR%"=="X:" (
    subst X: /d 2>nul
)

if %BUILD_ERR% NEQ 0 (
    echo [ERROR] Build failed! Check the Gradle errors above.
    exit /b %BUILD_ERR%
)

mkdir build-output 2>nul
copy "android\app\build\outputs\apk\release\app-release.apk" "build-output\UniversalApp-release.apk" >nul
copy "android\app\build\outputs\apk\release\app-release.apk" "UniversalApp.apk" >nul
echo [SUCCESS] APK Built Successfully: %CD%\UniversalApp.apk
pause
