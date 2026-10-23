# One-click script to build Android APK using EAS with EXPO_TOKEN from .env

$ErrorActionPreference = "Stop"

# Load .env file
$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $parts = $line.Split("=", 2)
            if ($parts.Length -eq 2) {
                $k = $parts[0].Trim()
                $v = $parts[1].Trim().Trim('"').Trim("'")
                if ($k -and $v) {
                    [System.Environment]::SetEnvironmentVariable($k, $v, "Process")
                }
            }
        }
    }
}

if (-not $env:EXPO_TOKEN -or $env:EXPO_TOKEN -eq "paste_your_expo_access_token_here") {
    Write-Host "[!] EXPO_TOKEN is empty in your .env file." -ForegroundColor Yellow
    Write-Host "    Open .env and paste your token from: https://expo.dev/settings/access-tokens" -ForegroundColor Yellow
} else {
    Write-Host "[✓] Loaded EXPO_TOKEN safely from .env" -ForegroundColor Green
}

Write-Host "[*] Submitting EAS Android APK build..." -ForegroundColor Cyan
npx.cmd eas-cli build --platform android --profile preview
