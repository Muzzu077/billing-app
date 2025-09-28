@echo off
cls
echo ===============================================
echo      BILLING APP - FULL STACK DEPLOYMENT
echo ===============================================
echo.

echo [INFO] Checking prerequisites...
echo.

echo [1/6] Testing frontend build...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b 1
)
echo [SUCCESS] Frontend build completed!
echo.

cd ..

echo [2/6] Verifying API configuration...
if not exist "api\index.js" (
    echo [ERROR] API serverless function not found!
    pause
    exit /b 1
)
echo [SUCCESS] API configuration verified!
echo.

echo [3/6] Checking deployment configurations...
if not exist "vercel.json" (
    echo [ERROR] Vercel configuration missing!
    pause
    exit /b 1
)
echo [SUCCESS] Deployment configurations ready!
echo.

echo [4/6] Preparing Git repository...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - Full-stack billing app"
) else (
    echo [INFO] Git repository already exists
    git add .
    git commit -m "Ready for full-stack deployment" 2>nul
)
echo [SUCCESS] Git repository prepared!
echo.

echo [5/6] Deployment options available:
echo.
echo   1. VERCEL (Recommended - Free tier)
echo      - Serverless functions for backend
echo      - CDN for frontend
echo      - Automatic deployments
echo.
echo   2. RAILWAY (Full-stack hosting)
echo      - Traditional server hosting
echo      - Database included
echo.
echo   3. RENDER (Free tier available)
echo      - Full-stack hosting
echo      - Auto-deploy from Git
echo.
echo   4. DOCKER (Self-hosting)
echo      - Complete containerization
echo      - Run anywhere
echo.

echo [6/6] Next steps:
echo.
echo ✅ Your app is ready for deployment!
echo.
echo FOR VERCEL DEPLOYMENT:
echo 1. Push to GitHub: git remote add origin YOUR_REPO_URL
echo 2. Push code: git push -u origin main
echo 3. Go to vercel.com and import your repository
echo 4. Set environment variables:
echo    - MONGODB_URI (MongoDB Atlas connection)
echo    - JWT_SECRET (secure random string)
echo    - NODE_ENV=production
echo 5. Deploy!
echo.
echo FOR QUICK VERCEL CLI DEPLOYMENT:
echo 1. Install CLI: npm install -g vercel
echo 2. Run: vercel --prod
echo.
echo 📋 Complete guide: See FULLSTACK_DEPLOY.md
echo 📋 Vercel specific: See VERCEL_DEPLOYMENT.md
echo.
echo ===============================================
echo        DEPLOYMENT READY! 🚀
echo ===============================================
pause