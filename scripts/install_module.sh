#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

name=$(node -p "require('$REPO_ROOT/package.json').name")
version=$(node -p "require('$REPO_ROOT/package.json').version")
tgz="${name}-${version}.tgz"

cd "$REPO_ROOT"

echo "==> npm run build"
npm run build

echo "==> npm pack"
npm pack

echo "==> npm uninstall -g ${name}"
npm uninstall -g "${name}"

echo "==> npm install -g ./${tgz}"
npm install -g "./${tgz}"
