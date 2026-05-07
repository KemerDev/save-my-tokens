$repoRoot    = Split-Path $PSScriptRoot -Parent
$userProfile = $env:USERPROFILE
$claudeDir   = "$userProfile\.claude"
$claudeMdDst = "$claudeDir\CLAUDE.md"
$claudeMdSrc = Join-Path $repoRoot "configs\CLAUDE.md"
$claudeJson  = "$userProfile\.claude.json"
$npmPath     = "$userProfile\AppData\Roaming\npm\node_modules\save-my-tokens\dist\cli.js" -replace '\\', '/'

# --- CLAUDE.md ---
if (-not (Test-Path $claudeDir)) {
    New-Item -ItemType Directory -Path $claudeDir | Out-Null
}

$srcContent = Get-Content $claudeMdSrc -Raw
if (Test-Path $claudeMdDst) {
    $dstContent = Get-Content $claudeMdDst -Raw
    if ($srcContent -eq $dstContent) {
        Write-Host "==> CLAUDE.md already up to date, skipping."
    } else {
        Copy-Item $claudeMdSrc $claudeMdDst -Force
        Write-Host "==> Updated CLAUDE.md."
    }
} else {
    Copy-Item $claudeMdSrc $claudeMdDst
    Write-Host "==> Copied CLAUDE.md."
}

# --- .claude.json MCP config ---
$mcpEntry = [PSCustomObject]@{
    type    = "stdio"
    command = "node"
    args    = @($npmPath, "--root", ".", "--stdio")
    env     = [PSCustomObject]@{}
}

if (Test-Path $claudeJson) {
    $cfg = Get-Content $claudeJson -Raw | ConvertFrom-Json
    if (-not $cfg.mcpServers) {
        $cfg | Add-Member -NotePropertyName mcpServers -NotePropertyValue ([PSCustomObject]@{})
    }
    if ($cfg.mcpServers.PSObject.Properties['save_my_tokens']) {
        Write-Host "==> MCP server already present in .claude.json, skipping."
    } else {
        $cfg.mcpServers | Add-Member -NotePropertyName save_my_tokens -NotePropertyValue $mcpEntry
        $cfg | ConvertTo-Json -Depth 10 | Set-Content $claudeJson -Encoding utf8
        Write-Host "==> Added MCP server to .claude.json."
    }
} else {
    $cfg = [PSCustomObject]@{
        mcpServers = [PSCustomObject]@{
            save_my_tokens = $mcpEntry
        }
    }
    $cfg | ConvertTo-Json -Depth 10 | Set-Content $claudeJson -Encoding utf8
    Write-Host "==> Created .claude.json with MCP server config."
}
