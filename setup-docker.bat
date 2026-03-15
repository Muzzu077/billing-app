@echo off
echo ==========================================
echo STARTING DOCKER POSTGRES FOR BILLING APP
echo ==========================================
echo.

docker compose up -d --build


if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Failed to start Docker. 
    echo Please make sure Docker Desktop is INSTALLED and RUNNING!
    echo.
) else (
    echo.
    echo ✅ Docker Postgres container started successfully!
    echo.
)

pause
