$repoRoot = Split-Path $PSScriptRoot -Parent
$pkg = Get-Content (Join-Path $repoRoot "package.json") | ConvertFrom-Json
$tgz = "$($pkg.name)-$($pkg.version).tgz"

Push-Location $repoRoot
try {
    Write-Host "==> npm run build"
    npm run build
    if (-not $?) { exit 1 }

    Write-Host "==> npm pack"
    npm pack
    if (-not $?) { exit 1 }

    Write-Host "==> npm uninstall -g $($pkg.name)"
    npm uninstall -g $pkg.name

    Write-Host "==> npm install -g ./$tgz"
    npm install -g "./$tgz"
} finally {
    Pop-Location
}
