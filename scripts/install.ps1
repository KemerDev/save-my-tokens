$scriptsDir = $PSScriptRoot

Write-Host "=== [1/3] Build & install module ==="
& "$scriptsDir\install_module.ps1"
if (-not $?) { Write-Host "Build failed — aborting."; exit 1 }

Write-Host ""
Write-Host "=== [2/3] Set up Claude Code ==="
& "$scriptsDir\setup_claude_code.ps1"

Write-Host ""
Write-Host "=== [3/3] Set up Codex (WSL) ==="
& "$scriptsDir\setup_codex_wsl.ps1"

Write-Host ""
Write-Host "=== Installation complete ==="
