@echo off
echo ==================================================
echo   Billing App - Vercel Deployment Setup
echo ==================================================
echo.

echo [Step 1] Installing Vercel CLI globally...
npm install -g vercel

echo.
echo [Step 2] Building the application...
cd frontend
npm install
npm run build
cd ..

echo.
echo [Step 3] Testing API structure...
if not exist "api\index.js" (
    echo ERROR: API entry point not found!
    pause
    exit /b 1
)

echo.
echo [Step 4] Ready for Vercel deployment!
echo.
echo Next steps:
echo 1. Push your code to GitHub
echo 2. Go to vercel.com and import your project
echo 3. Set environment variables:
echo    - MONGODB_URI (MongoDB Atlas connection string)
echo    - JWT_SECRET (secure random string)
echo    - NODE_ENV=production
echo 4. Deploy!
echo.
echo Or deploy directly with: vercel --prod
echo.
pause