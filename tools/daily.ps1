# VIZIER Daily Shipping Script
$ErrorActionPreference = "Stop"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   VIZIER — DAILY SHIPPING REPEAT SYSTEM" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Scan local graph
Write-Host "`n[1/5] Scanning private brain graph..." -ForegroundColor Yellow
node brain/scan.js
if ($LASTEXITCODE -ne 0) { throw "Scan failed." }

# 2. Sanitize and Export
Write-Host "`n[2/5] Sanitizing and exporting public index..." -ForegroundColor Yellow
node brain/export-public.js
if ($LASTEXITCODE -ne 0) { throw "Export sanitization failed." }

# 3. Build HTML pages and templates
Write-Host "`n[3/5] Rebuilding static site pages..." -ForegroundColor Yellow
node tools/site-build/build.js
if ($LASTEXITCODE -ne 0) { throw "Static site build failed." }

# 4. Verify Gate 2 security check and link validation
Write-Host "`n[4/5] Running automated Gate 2 verifications..." -ForegroundColor Yellow
node tools/site-build/verify.js
if ($LASTEXITCODE -ne 0) { throw "Verification failed. Aborting shipping." }

# 5. Push today's lesson card to Telegram
Write-Host "`n[5/5] Pushing daily micro-lesson to Telegram..." -ForegroundColor Yellow
node brain/push-micro-lesson.js
if ($LASTEXITCODE -ne 0) { Write-Warning "Telegram push failed, but continuing git commit." }

# 6. Commit and Push to Private Remote
Write-Host "`n[Shipping] Committing changes and pushing to private repository..." -ForegroundColor Yellow

# Read Day number from config.json
$configPath = "site/config.json"
$dayNum = "N"
if (Test-Path $configPath) {
    $config = Get-Content $configPath | ConvertFrom-Json
    $start = [DateTime]$config.start_date
    $today = [DateTime]::Today
    $diff = $today - $start
    $dayNum = [Math]::Floor($diff.TotalDays) + 1
}

git add site/ brain/feynman/ brain/knowledge/ PROGRESS.md VIZIER_BUILD_JOURNAL.md
git commit -m "Shipped Day $dayNum to VIZIER Live Brain"
git push vizier-private master

Write-Host "`n=============================================" -ForegroundColor Green
Write-Host " SUCCESS: Day $dayNum Shipped!" -ForegroundColor Green
Write-Host " Live at: (See Vercel URL)" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
