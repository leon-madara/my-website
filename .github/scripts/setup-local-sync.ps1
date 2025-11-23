#!/usr/bin/env pwsh
# Setup script for MAIN-FUSION local synchronization

param(
    [switch]$Install,
    [switch]$Uninstall,
    [switch]$Test
)

$SCRIPT_PATH = Join-Path $PSScriptRoot "local-sync-main-fusion.ps1"
$TASK_NAME = "MAIN-FUSION-Auto-Sync"
$REPO_PATH = (Get-Location).Path

function Install-TaskScheduler {
    Write-Host "`n================================================" -ForegroundColor Cyan
    Write-Host "  Installing MAIN-FUSION Auto-Sync Task" -ForegroundColor Cyan
    Write-Host "================================================`n" -ForegroundColor Cyan
    
    $existingTask = Get-ScheduledTask -TaskName $TASK_NAME -ErrorAction SilentlyContinue
    if ($existingTask) {
        Write-Host "Task already exists. Removing old task..." -ForegroundColor Yellow
        Unregister-ScheduledTask -TaskName $TASK_NAME -Confirm:$false
    }
    
    $action = New-ScheduledTaskAction `
        -Execute "pwsh.exe" `
        -Argument "-NoProfile -WindowStyle Hidden -File `"$SCRIPT_PATH`" -Once" `
        -WorkingDirectory $REPO_PATH
    
    $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 30)
    
    $settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable `
        -RunOnlyIfNetworkAvailable `
        -ExecutionTimeLimit (New-TimeSpan -Minutes 5)
    
    try {
        Register-ScheduledTask `
            -TaskName $TASK_NAME `
            -Action $action `
            -Trigger $trigger `
            -Settings $settings `
            -Description "Automatically syncs MAIN-FUSION branch every 30 minutes" `
            -Force | Out-Null
        
        Write-Host "Task Scheduler configured successfully!" -ForegroundColor Green
        Write-Host "`nTask Details:" -ForegroundColor Cyan
        Write-Host "  Name: $TASK_NAME"
        Write-Host "  Frequency: Every 30 minutes"
        Write-Host "  Script: $SCRIPT_PATH"
        Write-Host "`nBackground sync is now active!" -ForegroundColor Green
        
    } catch {
        Write-Host "Failed to create scheduled task: $_" -ForegroundColor Red
    }
}

function Uninstall-TaskScheduler {
    Write-Host "`n================================================" -ForegroundColor Cyan
    Write-Host "  Uninstalling MAIN-FUSION Auto-Sync Task" -ForegroundColor Cyan
    Write-Host "================================================`n" -ForegroundColor Cyan
    
    $existingTask = Get-ScheduledTask -TaskName $TASK_NAME -ErrorAction SilentlyContinue
    if ($existingTask) {
        Unregister-ScheduledTask -TaskName $TASK_NAME -Confirm:$false
        Write-Host "Task removed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Task not found" -ForegroundColor Yellow
    }
}

function Test-Setup {
    Write-Host "`n================================================" -ForegroundColor Cyan
    Write-Host "  Testing MAIN-FUSION Sync Setup" -ForegroundColor Cyan
    Write-Host "================================================`n" -ForegroundColor Cyan
    
    if (Test-Path $SCRIPT_PATH) {
        Write-Host "Sync script found: $SCRIPT_PATH" -ForegroundColor Green
    } else {
        Write-Host "Sync script not found!" -ForegroundColor Red
        return
    }
    
    if (Test-Path ".git") {
        Write-Host "Git repository detected" -ForegroundColor Green
    } else {
        Write-Host "Not in a git repository!" -ForegroundColor Red
        return
    }
    
    $existingTask = Get-ScheduledTask -TaskName $TASK_NAME -ErrorAction SilentlyContinue
    if ($existingTask) {
        Write-Host "Task Scheduler configured" -ForegroundColor Green
        Write-Host "  Status: $($existingTask.State)"
    } else {
        Write-Host "Task Scheduler not configured" -ForegroundColor Yellow
    }
    
    Write-Host "`nRunning test sync..." -ForegroundColor Cyan
    & $SCRIPT_PATH -Once
    
    Write-Host "`nTest complete!" -ForegroundColor Green
}

function Show-Help {
    Write-Host "`n================================================" -ForegroundColor Cyan
    Write-Host "  MAIN-FUSION Local Sync Setup" -ForegroundColor Cyan
    Write-Host "================================================`n" -ForegroundColor Cyan
    
    Write-Host "Usage:"
    Write-Host "  -Install     Install Task Scheduler" -ForegroundColor Green
    Write-Host "  -Uninstall   Remove Task Scheduler" -ForegroundColor Green
    Write-Host "  -Test        Test the sync setup" -ForegroundColor Green
    Write-Host ""
}

if ($Install) {
    Install-TaskScheduler
} elseif ($Uninstall) {
    Uninstall-TaskScheduler
} elseif ($Test) {
    Test-Setup
} else {
    Show-Help
}
