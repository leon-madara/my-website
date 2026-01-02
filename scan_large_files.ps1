$limit = 25MB
Get-ChildItem -Path . -Recurse -Force -ErrorAction SilentlyContinue | Where-Object { 
    !$_.PSIsContainer -and $_.Length -gt $limit 
} | Select-Object FullName, @{Name="Size(MB)";Expression={"{0:N2}" -f ($_.Length / 1MB)}}
