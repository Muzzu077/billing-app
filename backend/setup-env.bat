@echo off
setlocal

echo Setting up .env file with placeholder Supabase credentials...

(
echo # Supabase Configuration
echo SUPABASE_URL=https://your-project-ref.supabase.co
echo SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
echo # Optional fallback for read-only contexts
echo SUPABASE_ANON_KEY=your-anon-key
echo.
echo # Server Port
echo PORT=5000
echo.
echo # Node Environment
echo NODE_ENV=development
echo.
echo # Optional: JWT secret (set in production)
echo JWT_SECRET=replace-with-a-secure-random-string
echo.
echo # Optional: Admin reset defaults (used by scripts/setupAdmin.js if CLI args not provided)
echo # ADMIN_USERNAME=admin
echo # ADMIN_PASSWORD=changeme
) > .env

echo ✅ .env file created successfully!
echo 📋 Next steps:
echo    1. Open backend/.env and replace placeholders with your actual Supabase values.
echo    2. Run the SQL in backend/billing-app-setup.sql inside Supabase.
echo    3. npm run dev
