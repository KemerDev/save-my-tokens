$repoRoot  = Split-Path $PSScriptRoot -Parent
$wslUser   = (wsl -- whoami 2>$null).Trim()
if (-not $wslUser) {
    Write-Host "Could not detect WSL user — is WSL installed and running?"
    exit 1
}

$codexDir   = "\\wsl.localhost\Ubuntu\home\$wslUser\.codex"
$agentsDst  = "$codexDir\AGENTS.md"
$configPath = "$codexDir\config.toml"
$agentsSrc  = Join-Path $repoRoot "configs\AGENTS.md"

if (-not (Test-Path $codexDir)) {
    Write-Host "WSL Ubuntu codex directory not found: $codexDir — skipping."
    exit 0
}

# --- AGENTS.md ---
$srcContent = Get-Content $agentsSrc -Raw
$firstLine  = ($srcContent -split "`n" | Where-Object { $_ -match '\S' } | Select-Object -First 1).Trim()

if (Test-Path $agentsDst) {
    $dstContent = Get-Content $agentsDst -Raw
    if ($dstContent -match [regex]::Escape($firstLine)) {
        Write-Host "==> AGENTS.md already contains save-my-tokens content, skipping."
    } else {
        Add-Content -Path $agentsDst -Value "`n$srcContent"
        Write-Host "==> Appended AGENTS.md."
    }
} else {
    Set-Content -Path $agentsDst -Value $srcContent -Encoding utf8
    Write-Host "==> Created AGENTS.md."
}

# --- config.toml ---
$mcpBlock = @"

[mcp_servers.save_my_tokens]
command = "node"
args = ["/home/$wslUser/.nvm/versions/node/v25.9.0/lib/node_modules/save-my-tokens/dist/cli.js", "--root", ".", "--watch", "--stdio"]
enabled = true
startup_timeout_sec = 5
"@

if (Test-Path $configPath) {
    $cfg = Get-Content $configPath -Raw
    if ($cfg -match '\[mcp_servers\.save_my_tokens\]') {
        Write-Host "==> MCP server already present in config.toml, skipping."
    } else {
        Add-Content -Path $configPath -Value $mcpBlock
        Write-Host "==> Added MCP server to config.toml."
    }
} else {
    Set-Content -Path $configPath -Value $mcpBlock.TrimStart() -Encoding utf8
    Write-Host "==> Created config.toml with MCP server config."
}
