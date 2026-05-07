#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== [1/2] Build & install module ==="
bash "$SCRIPT_DIR/install_module.sh"

echo ""
echo "=== [2/2] Set up Codex ==="
bash "$SCRIPT_DIR/setup_codex_wsl.sh"

echo ""
echo "=== Installation complete ==="
