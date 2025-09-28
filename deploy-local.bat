@echo off
echo Starting Billing App Deployment Process...

echo.
echo [1/4] Installing dependencies...
call npm run install-all

echo.
echo [2/4] Building frontend...
call npm run build

echo.
echo [3/4] Setting up environment...
if not exist backend\.env (
    echo Creating .env file...
    echo MONGODB_URI=mongodb://localhost:27017/billing-app > backend\.env
    echo PORT=5000 >> backend\.env
    echo NODE_ENV=production >> backend\.env
    echo JWT_SECRET=please_change_this_secret_key_for_production >> backend\.env
    echo Please update backend\.env with your MongoDB connection string!
)

echo.
echo [4/4] Starting production server...
echo Your app will be available at: http://localhost:5000
echo.
cd backend
set NODE_ENV=production
npm start