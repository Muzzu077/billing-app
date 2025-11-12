# Environment Setup Script for PowerShell

Write-Host "Setting up .env file with your Supabase credentials..." -ForegroundColor Green

# Create .env file with Supabase credentials
$envContent = @"
# Supabase Configuration
SUPABASE_URL=https://jqmfzcvbjgmjyjgptydv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxbWZ6Y3ZiamdtanlqZ3B0eWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNTQyMDUsImV4cCI6MjA3NjkzMDIwNX0.75WDmjz6DBALdshXtWlbLwyJof3DQeGTPlu2Kz5ks_8

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development 

# Optional: JWT secret (set in production)
JWT_SECRET=dev_secret

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
