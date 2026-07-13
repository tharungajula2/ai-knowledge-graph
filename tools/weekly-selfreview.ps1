# VIZIER Weekly Self-Review Trigger Script
$ErrorActionPreference = "Stop"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   VIZIER — WEEKLY KNOWLEDGE SELF-REVIEW" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if virtual environment exists
$venvPath = "backend/.venv"
if (-not (Test-Path $venvPath)) {
    throw "Error: Virtual environment not found at $venvPath"
}

# Run the review parser via Python
Write-Host "Executing review pipeline..." -ForegroundColor Yellow
cd backend
& ".\.venv\Scripts\python.exe" app/brain_review.py

Write-Host "`n=============================================" -ForegroundColor Green
Write-Host " Review completed successfully!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
