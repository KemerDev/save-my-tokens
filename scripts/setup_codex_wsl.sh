#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CODEX_DIR="$HOME/.codex"
AGENTS_DST="$CODEX_DIR/AGENTS.md"
CONFIG_PATH="$CODEX_DIR/config.toml"
AGENTS_SRC="$REPO_ROOT/configs/AGENTS.md"

if [ ! -d "$CODEX_DIR" ]; then
    echo "Codex config directory not found: $CODEX_DIR — skipping."
    exit 0
fi

# --- AGENTS.md ---
FIRST_LINE=$(grep -m1 '.' "$AGENTS_SRC")

if [ -f "$AGENTS_DST" ]; then
    if grep -qF "$FIRST_LINE" "$AGENTS_DST"; then
        echo "==> AGENTS.md already contains save-my-tokens content, skipping."
    else
        echo "" >> "$AGENTS_DST"
        cat "$AGENTS_SRC" >> "$AGENTS_DST"
        echo "==> Appended AGENTS.md."
    fi
else
    cp "$AGENTS_SRC" "$AGENTS_DST"
    echo "==> Created AGENTS.md."
fi

# --- config.toml ---
NODE_PATH="$HOME/.nvm/versions/node/v25.9.0/lib/node_modules/save-my-tokens/dist/cli.js"
MCP_BLOCK=$(cat <<EOF

[mcp_servers.save_my_tokens]
command = "node"
args = ["${NODE_PATH}", "--root", ".", "--watch", "--stdio"]
enabled = true
startup_timeout_sec = 5
EOF
)

if [ -f "$CONFIG_PATH" ]; then
    if grep -q '\[mcp_servers\.save_my_tokens\]' "$CONFIG_PATH"; then
        echo "==> MCP server already present in config.toml, skipping."
    else
        printf '%s\n' "$MCP_BLOCK" >> "$CONFIG_PATH"
        echo "==> Added MCP server to config.toml."
    fi
else
    printf '%s\n' "$MCP_BLOCK" | tail -n +2 > "$CONFIG_PATH"
    echo "==> Created config.toml with MCP server config."
fi
