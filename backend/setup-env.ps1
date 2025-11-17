# Environment Setup Script for PowerShell

Write-Host "Setting up .env file with your Supabase credentials..." -ForegroundColor Green

# Create .env file with Supabase credentials
$envContent = @"
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# Optional fallback for read-only contexts
SUPABASE_ANON_KEY=your-anon-key

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development

# Optional: JWT secret (set in production)
JWT_SECRET=replace-with-a-secure-random-string

# Optional: Admin reset defaults (used by scripts/setupAdmin.js if CLI args not provided)
# ADMIN_USERNAME=admin
# ADMIN_PASSWORD=changeme
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Create database tables in Supabase" -ForegroundColor White
Write-Host "   2. Run: npm run setup-admin -- --username admin --password admin123" -ForegroundColor White
Write-Host "   3. Run: npm run dev" -ForegroundColor White
