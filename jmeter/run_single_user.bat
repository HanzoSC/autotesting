@echo off
echo ============================================
echo JMeter Load Test - Single User (1 thread)
echo ============================================
echo.

REM Set JMeter home directory - CHANGE THIS TO YOUR JMETER PATH
set JMETER_HOME=C:\Program Files\Java\apache-jmeter-5.6.3
set TEST_PLAN=calculator_full_test.jmx
set RESULTS_DIR=results\single_user

REM Check if JMeter exists
if not exist "%JMETER_HOME%\bin\jmeter.bat" (
    echo ERROR: JMeter not found at %JMETER_HOME%
    echo Please edit this script and set JMETER_HOME to your JMeter installation path
    pause
    exit /b 1
)

REM Create results directory
if not exist "%RESULTS_DIR%" mkdir "%RESULTS_DIR%"

REM Remove existing HTML report directory if it exists
if exist "%RESULTS_DIR%\html_report" (
    echo Removing existing HTML report directory...
    rmdir /s /q "%RESULTS_DIR%\html_report"
)

REM Backup original JMX file
if not exist "%TEST_PLAN%.backup" (
    copy "%TEST_PLAN%" "%TEST_PLAN%.backup" >nul
)

REM Update JMX file with 1 user configuration using PowerShell
echo Configuring test for 1 user...
powershell -Command "$content = Get-Content '%TEST_PLAN%' -Raw; $content = $content -replace '<stringProp name=\"ThreadGroup.num_threads\">\d+</stringProp>', '<stringProp name=\"ThreadGroup.num_threads\">1</stringProp>'; $content = $content -replace '<stringProp name=\"ThreadGroup.ramp_time\">\d+</stringProp>', '<stringProp name=\"ThreadGroup.ramp_time\">1</stringProp>'; $content = $content -replace '<stringProp name=\"LoopController.loops\">\d+</stringProp>', '<stringProp name=\"LoopController.loops\">10</stringProp>'; Set-Content '%TEST_PLAN%' -Value $content"

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to configure JMX file
    pause
    exit /b 1
)

echo Running test...
echo.

"%JMETER_HOME%\bin\jmeter.bat" -n -t "%TEST_PLAN%" ^
    -l "%RESULTS_DIR%\results.jtl" ^
    -e -o "%RESULTS_DIR%\html_report"

REM Restore original JMX file
if exist "%TEST_PLAN%.backup" (
    copy "%TEST_PLAN%.backup" "%TEST_PLAN%" >nul
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo Test completed successfully!
    echo Results saved to: %RESULTS_DIR%
    echo HTML report: %RESULTS_DIR%\html_report\index.html
    echo ============================================
) else (
    echo.
    echo ============================================
    echo ERROR: Test failed!
    echo Check the error messages above.
    echo ============================================
)

echo.
pause
