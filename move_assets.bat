@echo off
mkdir public 2>nul
robocopy . public /MOVE /E ^
 /XD .git .github .vscode .agent .claude .cursor .kiro .local .git_disabled node_modules functions public tests validation ^
 /XF .gitignore package.json package-lock.json wrangler.jsonc .wranglerignore scan_large_files.ps1 move_assets.bat LICENSE README.md *.log *.tmp

if %ERRORLEVEL% LEQ 8 exit 0
exit %ERRORLEVEL%
