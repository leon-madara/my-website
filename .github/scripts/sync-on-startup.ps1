#!/usr/bin/env pwsh
# Startup sync script - Add this to your PowerShell profile for automatic sync on terminal start
# To add to profile: Add-Content $PROFILE "`n# MAIN-FUSION Auto-Sync`n& 'C:\path\to\repo\.github\scripts\sync-on-startup.ps1'"

$REPO_PATH = Split-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) -Parent
$SYNC_SCRIPT = Join-Path $PSScriptRoot "local-sync-main-fusion.ps1"

# Only run if we're in the repository directory
$currentPath = Get-Location
if ($currentPath.Path -like "*$REPO_PATH*" -or $currentPath.Path -eq $REPO_PATH) {
    Write-Host "`n🔄 Checking for MAIN-FUSION updates..." -ForegroundColor Cyan
    
    # Run sync silently
    & $SYNC_SCRIPT -Once 2>&1 | Out-Null
    
    # Check if updates were pulled
    $logFile = Join-Path (Split-Path $PSScriptRoot -Parent) "logs\sync.log"
    if (Test-Path $logFile) {
        $recentLog = Get-Content $logFile -Tail 5 | Select-String "Successfully pulled"
        if ($recentLog) {
            Write-Host "✓ MAIN-FUSION updated!" -ForegroundColor Green
        } else {
            Write-Host "✓ Already up to date" -ForegroundColor Green
        }
    }
}
