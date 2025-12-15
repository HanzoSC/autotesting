@echo off
setlocal enabledelayedexpansion

REM Change to script directory
cd /d "%~dp0"

echo ============================================
echo JMeter Load Test - Find Maximum Users
echo ============================================
echo.

REM Set JMeter home directory - CHANGE THIS TO YOUR JMETER PATH
set JMETER_HOME=C:\Program Files\Java\apache-jmeter-5.6.3
set TEST_PLAN=calculator_full_test.jmx

REM Verify we're in the correct directory
echo Current directory: %CD%
if not exist "%TEST_PLAN%" (
    echo ERROR: Test plan file not found: %TEST_PLAN%
    echo Please make sure you run this script from the jmeter directory
    pause
    exit /b 1
)

REM Check if JMeter exists
if not exist "%JMETER_HOME%\bin\jmeter.bat" (
    echo ERROR: JMeter not found at %JMETER_HOME%
    echo Please edit this script and set JMETER_HOME to your JMeter installation path
    pause
    exit /b 1
)

REM Backup original JMX file
if not exist "%TEST_PLAN%.backup" (
    copy "%TEST_PLAN%" "%TEST_PLAN%.backup" >nul
)

REM Test different user loads
set USER_LOADS=500 1000 5000

echo Testing different user loads to find maximum...
echo This will test: %USER_LOADS%
echo Using same parameters as high_load test (ramp_time=10, loops=5)
echo WARNING: This may take several minutes to complete!
echo.
pause

for %%i in (%USER_LOADS%) do (
    echo.
    echo ============================================
    echo Testing with %%i users...
    echo ============================================
    
    set RESULTS_DIR=results\max_users\users_%%i
    
    REM Create results directory
    if not exist "results" mkdir "results"
    if not exist "results\max_users" mkdir "results\max_users"
    if not exist "!RESULTS_DIR!" mkdir "!RESULTS_DIR!"
    
    REM Remove existing HTML report directory if it exists
    if exist "!RESULTS_DIR!\html_report" (
        echo Removing existing HTML report directory...
        rmdir /s /q "!RESULTS_DIR!\html_report"
    )
    
    REM Remove existing results file if it exists
    if exist "!RESULTS_DIR!\results.jtl" (
        echo Removing existing results file...
        del /q "!RESULTS_DIR!\results.jtl"
    )
    
    REM Update JMX file with current user load using PowerShell (same as high_load)
    echo Configuring test for %%i users...
    powershell -Command "$content = Get-Content '%TEST_PLAN%' -Raw; $content = $content -replace '<stringProp name=\"ThreadGroup.num_threads\">\d+</stringProp>', '<stringProp name=\"ThreadGroup.num_threads\">%%i</stringProp>'; $content = $content -replace '<stringProp name=\"ThreadGroup.ramp_time\">\d+</stringProp>', '<stringProp name=\"ThreadGroup.ramp_time\">10</stringProp>'; $content = $content -replace '<stringProp name=\"LoopController.loops\">\d+</stringProp>', '<stringProp name=\"LoopController.loops\">5</stringProp>'; Set-Content '%TEST_PLAN%' -Value $content"
    
    if !ERRORLEVEL! NEQ 0 (
        echo ERROR: Failed to configure JMX file
        pause
        exit /b 1
    )
    
    echo Running test...
    echo WARNING: This may take several minutes to complete!
    echo Results will be saved to: !RESULTS_DIR!
    echo.
    
    call "%JMETER_HOME%\bin\jmeter.bat" -n -t "%TEST_PLAN%" ^
        -l "!RESULTS_DIR!\results.jtl" ^
        -e -o "!RESULTS_DIR!\html_report"
    
    if !ERRORLEVEL! EQU 0 (
        echo.
        echo ============================================
        echo Test with %%i users completed successfully!
        echo Results saved to: !RESULTS_DIR!
        echo HTML report: !RESULTS_DIR!\html_report\index.html
        echo ============================================
    ) else (
        echo.
        echo ============================================
        echo ERROR: Test with %%i users failed!
        echo Check the error messages above.
        echo ============================================
    )
    echo.
)

REM Restore original JMX file
if exist "%TEST_PLAN%.backup" (
    copy "%TEST_PLAN%.backup" "%TEST_PLAN%" >nul
)

echo.
echo ============================================
echo All tests completed!
echo Check results in results\max_users\users_* directories
echo ============================================
echo.
pause
