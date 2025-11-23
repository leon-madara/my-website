#!/usr/bin/env pwsh
# Setup script for MAIN-FUSION local synchronization
# This script configures Windows Task Scheduler for automatic background sync

param(
    [switch]$Install,
    [switch]$Uninstall,
    [switch]$Test
)

$SCRIPT_PATH = Join-Path $PSScriptRoot "local-sync-main-fusion.ps1"
$TASK_NAME = "MAIN-FUSION-Auto-Sync"
$REPO_PATH = (Get-Location).Path

# Colors
$GREEN = "`e[32m"
$YELLOW = "`e[33m"
$CYAN = "`e[36m"
$RED = "`e[31m"
$RESET = "`e[0m"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = $CYAN)
    Write-Host "${Color}${Message}${RESET}"
}

function Install-TaskScheduler {
    Write-ColorOutput "`n═══════════════════════════════════════════════════" $CYAN
    Write-ColorOutput "  Installing MAIN-FUSION Auto-Sync Task" $CYAN
    Write-ColorOutput "═══════════════════════════════════════════════════`n" $CYAN
    
    # Check if task already exists
    $existingTask = Get-ScheduledTask -TaskName $TASK_NAME -ErrorAction SilentlyContinue
    if ($existingTask) {
        Write-ColorOutput "⚠ Task already exists. Removing old task..." $YELLOW
        Unregister-ScheduledTask -TaskName $TASK_NAME -Confirm:$false
    }
    
    # Create task action
    $action = New-ScheduledTaskAction `
        -Execute "pwsh.exe" `
        -Argument "-NoProfile -WindowStyle Hidden -File `"$SCRIPT_PATH`" -Once" `
        -WorkingDirectory $REPO_PATH
    
    # Create trigger (every 30 minutes)
    $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 30)
    
    # Create settings
    $settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable `
        -RunOnlyIfNetworkAvailable `
        -ExecutionTimeLimit (New-TimeSpan -Minutes 5)
    
    # Register task
    try {
        Register-ScheduledTask `
            -TaskName $TASK_NAME `
            -Action $action `
            -Trigger $trigger `
            -Settings $settings `
            -Description "Automatically syncs MAIN-FUSION branch every 30 minutes" `
            -Force | Out-Null
        
        Write-ColorOutput "✓ Task Scheduler configured successfully!" $GREEN
        Write-ColorOutput "`nTask Details:" $CYAN
        Write-ColorOutput "  Name: $TASK_NAME" $CYAN
        Write-ColorOutput "  Frequency: Every 30 minutes" $CYAN
        Write-ColorOutput "  Script: $SCRIPT_PATH" $CYAN
        Write-ColorOutput "  Repository: $REPO_PATH" $CYAN
        
        Write-ColorOutput "`n✓ Background sync is now active!" $GREEN
        Write-ColorOutput "  The task will run every 30 minutes automatically." $CYAN
        
    } catch {
        Write-ColorOutput "✗ Failed to create scheduled task: $_" $RED
        Write-ColorOutput "`nFallback: Use daemon mode instead:" $YELLOW
        Write-ColorOutput "  .\\.github\\scripts\\local-sync-main-fusion.ps1 -Daemon" $CYAN
    }
}

function Uninstall-TaskScheduler {
    Write-ColorOutput "`n═══════════════════════════════════════════════════" $CYAN
    Write-ColorOutput "  Uninstalling MAIN-FUSION Auto-Sync Task" $CYAN
    Write-ColorOutput "═══════════════════════════════════════════════════`n" $CYAN
    
    $existingTask = Get-ScheduledTask -TaskName $TASK_NAME -ErrorAction SilentlyContinue
    if ($existingTask) {
        Unregister-ScheduledTask -TaskName $TASK_NAME -Confirm:$false
        Write-ColorOutput "✓ Task removed successfully!" $GREEN
    } else {
        Write-ColorOutput "⚠ Task not found" $YELLOW
    }
}

function Test-Setup {
    Write-ColorOutput "`n═══════════════════════════════════════════════════" $CYAN
    Write-ColorOutput "  Testing MAIN-FUSION Sync Setup" $CYAN
    Write-ColorOutput "═══════════════════════════════════════════════════`n" $CYAN
    
    # Check if script exists
    if (Test-Path $SCRIPT_PATH) {
        Write-ColorOutput "✓ Sync script found: $SCRIPT_PATH" $GREEN
    } else {
        Write-ColorOutput "✗ Sync script not found!" $RED
        return
    }
    
    # Check if in git repo
    if (Test-Path ".git") {
        Write-ColorOutput "✓ Git repository detected" $GREEN
    } else {
        Write-ColorOutput "✗ Not in a git repository!" $RED
        return
    }
    
    # Check Task Scheduler
    $existingTask = Get-ScheduledTask -TaskName $TASK_NAME -ErrorAction SilentlyContinue
    if ($existingTask) {
        Write-ColorOutput "✓ Task Scheduler configured" $GREEN
        Write-ColorOutput "  Status: $($existingTask.State)" $CYAN
    } else {
        Write-ColorOutput "⚠ Task Scheduler not configured" $YELLOW
        Write-ColorOutput "  Run: .\\.github\\scripts\\setup-local-sync.ps1 -Install" $CYAN
    }
    
    # Test sync script
    Write-ColorOutput "`nRunning test sync..." $CYAN
    & $SCRIPT_PATH -Once
    
    Write-ColorOutput "`n✓ Test complete!" $GREEN
}

function Show-Help {
    Write-ColorOutput "`n═══════════════════════════════════════════════════" $CYAN
    Write-ColorOutput "  MAIN-FUSION Local Sync Setup" $CYAN
    Write-ColorOutput "═══════════════════════════════════════════════════`n" $CYAN
    
    Write-Host "This script configures automatic background synchronization"
    Write-Host "for the MAIN-FUSION branch using Windows Task Scheduler.`n"
    
    Write-Host "Usage:"
    Write-Host "  ${GREEN}-Install${RESET}     Install Task Scheduler (runs every 30 mins)"
    Write-Host "  ${GREEN}-Uninstall${RESET}   Remove Task Scheduler"
    Write-Host "  ${GREEN}-Test${RESET}        Test the sync setup`n"
    
    Write-Host "Examples:"
    Write-Host "  $CYAN" -NoNewline; Write-Host ".\.github\scripts\setup-local-sync.ps1 -Install$RESET"
    Write-Host "  $CYAN" -NoNewline; Write-Host ".\.github\scripts\setup-local-sync.ps1 -Test$RESET"
    Write-Host "  $CYAN" -NoNewline; Write-Host ".\.github\scripts\setup-local-sync.ps1 -Uninstall$RESET`n"
    
    Write-Host "Manual sync options:"
    Write-Host "  $CYAN" -NoNewline; Write-Host ".\.github\scripts\local-sync-main-fusion.ps1 -Once$RESET     (run once)"
    Write-Host "  $CYAN" -NoNewline; Write-Host ".\.github\scripts\local-sync-main-fusion.ps1 -Daemon$RESET   (background)"
    Write-Host "  $CYAN" -NoNewline; Write-Host ".\.github\scripts\local-sync-main-fusion.ps1 -Status$RESET   (check status)"
    Write-Host ""
}

# Main execution
if ($Install) {
    Install-TaskScheduler
} elseif ($Uninstall) {
    Uninstall-TaskScheduler
} elseif ($Test) {
    Test-Setup
} else {
    Show-Help
}
