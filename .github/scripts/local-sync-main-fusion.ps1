#!/usr/bin/env pwsh
# Local MAIN-FUSION Synchronization Script
# Automatically pulls changes from remote MAIN-FUSION branch with safety checks

param(
    [switch]$Daemon,      # Run in background mode (every 30 mins)
    [switch]$Once,        # Run once and exit
    [switch]$Status,      # Check sync status only
    [switch]$Stop         # Stop background daemon
)

# Configuration
$MAIN_FUSION_BRANCH = "MAIN-FUSION"
$POLL_INTERVAL = 1800  # 30 minutes in seconds
$LOCK_FILE = ".git/main-fusion-sync.lock"
$LOG_FILE = ".github/logs/sync.log"
$PID_FILE = ".git/main-fusion-sync.pid"

# Colors for output
$RED = "`e[31m"
$GREEN = "`e[32m"
$YELLOW = "`e[33m"
$BLUE = "`e[34m"
$MAGENTA = "`e[35m"
$CYAN = "`e[36m"
$RESET = "`e[0m"

# Ensure log directory exists
$logDir = Split-Path $LOG_FILE -Parent
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# Logging function
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    Add-Content -Path $LOG_FILE -Value $logMessage
    
    switch ($Level) {
        "ERROR"   { Write-Host "${RED}✗ $Message${RESET}" }
        "SUCCESS" { Write-Host "${GREEN}✓ $Message${RESET}" }
        "WARNING" { Write-Host "${YELLOW}⚠ $Message${RESET}" }
        "INFO"    { Write-Host "${CYAN}ℹ $Message${RESET}" }
        default   { Write-Host $Message }
    }
}

# Desktop notification function
function Send-Notification {
    param(
        [string]$Title,
        [string]$Message,
        [string]$Type = "Info"  # Info, Warning, Error
    )
    
    Write-Log $Message $Type
    
    # Windows Toast Notification
    try {
        $null = [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime]
        $null = [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime]
        
        $template = @"
<toast>
    <visual>
        <binding template="ToastText02">
            <text id="1">$Title</text>
            <text id="2">$Message</text>
        </binding>
    </visual>
</toast>
"@
        
        $xml = New-Object Windows.Data.Xml.Dom.XmlDocument
        $xml.LoadXml($template)
        $toast = [Windows.UI.Notifications.ToastNotification]::new($xml)
        $notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier("MAIN-FUSION Sync")
        $notifier.Show($toast)
    } catch {
        # Fallback to simple notification
        Write-Host "`n${MAGENTA}═══════════════════════════════════════${RESET}"
        Write-Host "${MAGENTA}  🔔 $Title${RESET}"
        Write-Host "${MAGENTA}  $Message${RESET}"
        Write-Host "${MAGENTA}═══════════════════════════════════════${RESET}`n"
    }
}

# Check if we're in a git repository
function Test-GitRepository {
    if (-not (Test-Path ".git")) {
        Write-Log "Not in a git repository!" "ERROR"
        return $false
    }
    return $true
}

# Check if daemon is running
function Test-DaemonRunning {
    if (Test-Path $PID_FILE) {
        $pid = Get-Content $PID_FILE
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($process) {
            return $true
        } else {
            # Stale PID file
            Remove-Item $PID_FILE -Force
            return $false
        }
    }
    return $false
}

# Stop daemon
function Stop-Daemon {
    if (Test-Path $PID_FILE) {
        $pid = Get-Content $PID_FILE
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($process) {
            Stop-Process -Id $pid -Force
            Write-Log "Stopped background sync daemon (PID: $pid)" "SUCCESS"
        }
        Remove-Item $PID_FILE -Force
    } else {
        Write-Log "No daemon running" "WARNING"
    }
}

# Get current branch
function Get-CurrentBranch {
    return (git rev-parse --abbrev-ref HEAD 2>$null)
}

# Check for uncommitted changes
function Test-UncommittedChanges {
    $status = git status --porcelain 2>$null
    return ($status.Length -gt 0)
}

# Generate backup branch name
function New-BackupBranchName {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $currentBranch = Get-CurrentBranch
    
    # Try to get a meaningful description from recent changes
    $recentFiles = git diff --name-only HEAD 2>$null | Select-Object -First 3
    if ($recentFiles) {
        $fileNames = $recentFiles | ForEach-Object { 
            (Split-Path $_ -Leaf) -replace '\.[^.]+$', '' 
        }
        $description = ($fileNames -join "-") -replace '[^a-zA-Z0-9-]', '-'
        $description = $description.Substring(0, [Math]::Min(30, $description.Length))
        return "backup/$currentBranch-$description-$timestamp"
    }
    
    return "backup/$currentBranch-$timestamp"
}

# Create backup branch
function New-BackupBranch {
    $backupName = New-BackupBranchName
    
    try {
        git branch $backupName 2>$null
        Write-Log "Created backup branch: $backupName" "SUCCESS"
        Send-Notification "Backup Created" "Your work saved to: $backupName" "Info"
        return $backupName
    } catch {
        Write-Log "Failed to create backup branch: $_" "ERROR"
        return $null
    }
}

# Check for remote updates
function Test-RemoteUpdates {
    try {
        # Fetch latest from remote
        git fetch origin $MAIN_FUSION_BRANCH 2>$null | Out-Null
        
        # Compare local and remote
        $localCommit = git rev-parse $MAIN_FUSION_BRANCH 2>$null
        $remoteCommit = git rev-parse "origin/$MAIN_FUSION_BRANCH" 2>$null
        
        if ($localCommit -ne $remoteCommit) {
            return $true
        }
        return $false
    } catch {
        Write-Log "Error checking remote updates: $_" "ERROR"
        return $false
    }
}

# Perform sync operation
function Sync-MainFusion {
    Write-Log "Starting MAIN-FUSION sync check..." "INFO"
    
    # Verify git repository
    if (-not (Test-GitRepository)) {
        return $false
    }
    
    # Check if already syncing
    if (Test-Path $LOCK_FILE) {
        Write-Log "Sync already in progress (lock file exists)" "WARNING"
        return $false
    }
    
    try {
        # Create lock file
        New-Item -ItemType File -Path $LOCK_FILE -Force | Out-Null
        
        # Get current branch
        $currentBranch = Get-CurrentBranch
        
        # Ensure we're on MAIN-FUSION
        if ($currentBranch -ne $MAIN_FUSION_BRANCH) {
            Write-Log "Not on $MAIN_FUSION_BRANCH branch (currently on: $currentBranch)" "WARNING"
            Write-Log "Switching to $MAIN_FUSION_BRANCH..." "INFO"
            
            # Check for uncommitted changes before switching
            if (Test-UncommittedChanges) {
                Write-Log "You have uncommitted changes!" "WARNING"
                $backup = New-BackupBranch
                if (-not $backup) {
                    Write-Log "Cannot proceed without backup" "ERROR"
                    return $false
                }
            }
            
            git checkout $MAIN_FUSION_BRANCH 2>$null
            if ($LASTEXITCODE -ne 0) {
                Write-Log "Failed to switch to $MAIN_FUSION_BRANCH" "ERROR"
                return $false
            }
        }
        
        # Check for uncommitted changes
        if (Test-UncommittedChanges) {
            Write-Log "Uncommitted changes detected!" "WARNING"
            $backup = New-BackupBranch
            if (-not $backup) {
                Write-Log "Cannot proceed without backup" "ERROR"
                return $false
            }
            
            # Stash changes
            git stash push -m "Auto-stash before MAIN-FUSION sync $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" 2>$null
            Write-Log "Changes stashed for safety" "INFO"
        }
        
        # Check for remote updates
        if (-not (Test-RemoteUpdates)) {
            Write-Log "No updates available from remote" "INFO"
            return $true
        }
        
        Write-Log "Updates found! Pulling changes..." "INFO"
        
        # Pull changes
        $pullOutput = git pull origin $MAIN_FUSION_BRANCH 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            # Get commit details
            $latestCommit = git log -1 --pretty=format:"%h - %s" 2>$null
            Write-Log "Successfully pulled changes from $MAIN_FUSION_BRANCH" "SUCCESS"
            Write-Log "Latest commit: $latestCommit" "INFO"
            
            Send-Notification "MAIN-FUSION Updated!" "Latest: $latestCommit" "Success"
            return $true
        } else {
            Write-Log "Failed to pull changes: $pullOutput" "ERROR"
            Send-Notification "Sync Failed" "Could not pull MAIN-FUSION changes" "Error"
            return $false
        }
        
    } finally {
        # Remove lock file
        if (Test-Path $LOCK_FILE) {
            Remove-Item $LOCK_FILE -Force
        }
    }
}

# Show sync status
function Show-Status {
    Write-Host "`n${CYAN}═══════════════════════════════════════════════════${RESET}"
    Write-Host "${CYAN}  MAIN-FUSION Sync Status${RESET}"
    Write-Host "${CYAN}═══════════════════════════════════════════════════${RESET}`n"
    
    if (-not (Test-GitRepository)) {
        Write-Host "${RED}✗ Not in a git repository${RESET}`n"
        return
    }
    
    $currentBranch = Get-CurrentBranch
    Write-Host "Current Branch: ${YELLOW}$currentBranch${RESET}"
    
    if ($currentBranch -eq $MAIN_FUSION_BRANCH) {
        Write-Host "${GREEN}✓ On MAIN-FUSION branch${RESET}"
    } else {
        Write-Host "${YELLOW}⚠ Not on MAIN-FUSION branch${RESET}"
    }
    
    if (Test-UncommittedChanges) {
        Write-Host "${YELLOW}⚠ Uncommitted changes present${RESET}"
    } else {
        Write-Host "${GREEN}✓ Working directory clean${RESET}"
    }
    
    if (Test-DaemonRunning) {
        $pid = Get-Content $PID_FILE
        Write-Host "${GREEN}✓ Background sync running (PID: $pid)${RESET}"
    } else {
        Write-Host "${YELLOW}⚠ Background sync not running${RESET}"
    }
    
    # Check for updates
    Write-Host "`nChecking for remote updates..."
    if (Test-RemoteUpdates) {
        Write-Host "$YELLOW⚠ Updates available from remote!$RESET"
        Write-Host "  Run: .\.github\scripts\local-sync-main-fusion.ps1 -Once" -ForegroundColor Cyan
    } else {
        Write-Host "$GREEN✓ Up to date with remote$RESET"
    }
    
    Write-Host "`n${CYAN}═══════════════════════════════════════════════════${RESET}`n"
}

# Daemon mode
function Start-Daemon {
    if (Test-DaemonRunning) {
        Write-Log "Daemon already running!" "WARNING"
        return
    }
    
    Write-Log "Starting background sync daemon (polling every 30 minutes)..." "INFO"
    
    # Save PID
    $PID | Out-File -FilePath $PID_FILE -Force
    
    Send-Notification "Sync Started" "Background sync running every 30 minutes" "Info"
    
    while ($true) {
        Sync-MainFusion | Out-Null
        Start-Sleep -Seconds $POLL_INTERVAL
    }
}

# Main execution
function Main {
    if ($Stop) {
        Stop-Daemon
        return
    }
    
    if ($Status) {
        Show-Status
        return
    }
    
    if ($Daemon) {
        Start-Daemon
        return
    }
    
    if ($Once) {
        Sync-MainFusion
        return
    }
    
    # Default: show help
    Write-Host "`n${CYAN}═══════════════════════════════════════════════════${RESET}"
    Write-Host "${CYAN}  MAIN-FUSION Local Sync Tool${RESET}"
    Write-Host "${CYAN}═══════════════════════════════════════════════════${RESET}`n"
    Write-Host "Usage:"
    Write-Host "  ${GREEN}-Once${RESET}      Run sync once and exit"
    Write-Host "  ${GREEN}-Daemon${RESET}    Run in background (every 30 mins)"
    Write-Host "  ${GREEN}-Status${RESET}    Check current sync status"
    Write-Host "  ${GREEN}-Stop${RESET}      Stop background daemon"
    Write-Host "`nExamples:"
    Write-Host "  ${CYAN}.\\.github\\scripts\\local-sync-main-fusion.ps1 -Once${RESET}"
    Write-Host "  ${CYAN}.\\.github\\scripts\\local-sync-main-fusion.ps1 -Daemon${RESET}"
    Write-Host "  ${CYAN}.\\.github\\scripts\\local-sync-main-fusion.ps1 -Status${RESET}"
    Write-Host "  ${CYAN}.\\.github\\scripts\\local-sync-main-fusion.ps1 -Stop${RESET}`n"
}

# Run main
Main
