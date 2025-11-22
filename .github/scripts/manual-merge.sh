#!/bin/bash

# Manual merge script - Fallback option
# Run this script to manually trigger a merge if GitHub Actions fails

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  MAIN-FUSION Manual Merge Tool            ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# If no argument provided, use current branch
if [ -z "$1" ]; then
    if [[ "$CURRENT_BRANCH" =~ ^claude/ ]]; then
        CLAUDE_BRANCH="$CURRENT_BRANCH"
        echo -e "${GREEN}Using current branch: $CLAUDE_BRANCH${NC}"
    else
        echo -e "${YELLOW}Usage: $0 [claude-branch-name]${NC}"
        echo ""
        echo "Available claude/* branches:"
        git branch -r | grep 'origin/claude/' | sed 's/origin\///' | sed 's/^[ \t]*/  - /'
        echo ""
        read -p "Enter branch name (or press Enter to cancel): " CLAUDE_BRANCH
        if [ -z "$CLAUDE_BRANCH" ]; then
            echo "Cancelled"
            exit 0
        fi
    fi
else
    CLAUDE_BRANCH="$1"
fi

# Validate branch name
if [[ ! "$CLAUDE_BRANCH" =~ ^claude/ ]]; then
    echo -e "${RED}Error: Branch must start with 'claude/'${NC}"
    exit 1
fi

# Check if branch exists
if ! git rev-parse --verify "origin/$CLAUDE_BRANCH" >/dev/null 2>&1; then
    echo -e "${RED}Error: Branch 'origin/$CLAUDE_BRANCH' does not exist${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Configuration:${NC}"
echo "  Source: $CLAUDE_BRANCH"
echo "  Target: MAIN-FUSION"
echo ""
read -p "Continue with merge? (y/N): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Cancelled"
    exit 0
fi

echo ""
echo -e "${GREEN}Starting merge process...${NC}"

# Get repository info
REPO_OWNER=$(git remote get-url origin | sed -n 's#.*/\([^/]*\)/\([^/]*\)\.git#\1#p')
REPO_NAME=$(git remote get-url origin | sed -n 's#.*/\([^/]*\)/\([^/]*\)\.git#\2#p')

if [ -z "$REPO_OWNER" ] || [ -z "$REPO_NAME" ]; then
    echo -e "${YELLOW}Warning: Could not extract repo info from remote URL${NC}"
    REPO_OWNER="unknown"
    REPO_NAME="unknown"
fi

# Call the main merge script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/merge-to-main-fusion.sh" "$CLAUDE_BRANCH" "$REPO_OWNER" "$REPO_NAME"

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✓ Merge completed successfully!          ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}Next steps:${NC}"
    echo "  1. Review changes in MAIN-FUSION"
    echo "  2. When ready, merge MAIN-FUSION → main"
    echo ""
    echo -e "${BLUE}To merge to main:${NC}"
    echo "  git checkout main"
    echo "  git pull origin main"
    echo "  git merge MAIN-FUSION"
    echo "  git push origin main"
else
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ✗ Merge failed - see details above       ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Manual resolution required${NC}"
fi

exit $EXIT_CODE
