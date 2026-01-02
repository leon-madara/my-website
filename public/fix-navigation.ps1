# Fix navigation links across all HTML pages

# Read index.html and fix About button
$indexContent = Get-Content "index.html" -Raw -Encoding UTF8

# Replace the escaped About link with a proper button
$aboutButton = '<button class="nav-icon" data-section="about" data-label="About" aria-label="About" type="button" onclick="window.location.href=' + "'" + 'about.html' + "'" + '">
                <svg class="nav-icon-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z" />
                </svg>
            </button>'

$indexContent = $indexContent -replace '\\u003ca href="about\.html" class="nav-icon-link"[^>]*>[\s\S]*?\\u003c/a\\u003e', $aboutButton

# Make Home button active on index.html
$indexContent = $indexContent -replace '<button class="nav-icon" data-section="home"', '<button class="nav-icon active" data-section="home" aria-current="page"'

# Save index.html
$indexContent | Set-Content "index.html" -Encoding UTF8 -NoNewline

Write-Host "Fixed index.html navigation" -ForegroundColor Green

Write-Host "Navigation fix complete!" -ForegroundColor Green
