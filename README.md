# save-my-tokens

`save-my-tokens` is a local TypeScript MCP server that gives coding agents compact, symbol-first code context instead of broad raw file reads.

Core rule: **Never read a full file when the task probably needs a symbol.**

---

## Installation

### Prerequisites

- Node.js ≥ 20
- npm

### 1. Clone the repo

```bash
git clone <repo-url>
cd save-my-tokens
```

### 2. Run the install script

The install script builds the package, installs it globally, and configures Claude Code and Codex automatically.

**Windows (PowerShell):**

```powershell
.\scripts\install.ps1
```

**WSL / Linux / macOS:**

```bash
chmod +x scripts/install.sh
./scripts/install.sh
```

### What the installer does

| Step | Description |
|------|-------------|
| Build & pack | Compiles TypeScript and creates a local `.tgz` |
| Global install | Runs `npm install -g` with the packed file |
| Claude Code | Copies `configs/CLAUDE.md` to `~/.claude/CLAUDE.md` and registers the MCP server in `~/.claude.json` |
| Codex (WSL) | Appends `configs/AGENTS.md` to `~/.codex/AGENTS.md` and registers the MCP server in `~/.codex/config.toml` |

> Codex setup is skipped automatically if `~/.codex` is not found.  
> All steps are idempotent — safe to run multiple times.

### Re-installing after changes

Use the same scripts to rebuild and reinstall at any time. They detect existing config and skip unchanged entries.

---

## MCP client config

Manual config if you prefer not to use the install scripts:

```json
{
  "mcpServers": {
    "save-my-tokens": {
      "command": "npx",
      "args": ["save-my-tokens", "--root", "/path/to/repo", "--stdio"]
    }
  }
}
```

## CLI flags

`--root`, `--config`, `--max-tokens`, `--dependency-depth`, `--local-ai-provider`, `--local-ai-base-url`, `--local-ai-model`, `--disable-local-ai`, `--log-level`, `--watch`, `--no-watch`, `--stdio`.

## Environment variables

`SAVE_MY_TOKENS_ROOT`, `SAVE_MY_TOKENS_CONFIG`, `SAVE_MY_TOKENS_DEFAULT_MAX_TOKENS`, `SAVE_MY_TOKENS_DEFAULT_DEPENDENCY_DEPTH`, `SAVE_MY_TOKENS_LOCAL_AI_ENABLED`, `SAVE_MY_TOKENS_LOCAL_AI_PROVIDER`, `SAVE_MY_TOKENS_LOCAL_AI_BASE_URL`, `SAVE_MY_TOKENS_LOCAL_AI_MODEL`, `SAVE_MY_TOKENS_LOG_LEVEL`.

## Tools and workflow

Prefer this order: `ask_codebase`, `resolve_symbol`, `get_symbol_context`, `get_relevant_context`, `get_usage_context`, `get_exact_snippet`, and `read_full_file_escape_hatch` only when necessary.

All tools: `ask_codebase`, `resolve_symbol`, `get_symbol_context`, `explain_symbol_dependencies`, `get_usage_context`, `get_relevant_context`, `get_exact_snippet`, `get_file_summary`, `read_full_file_escape_hatch`.

Use exact snippets for edits. Use the full-file escape hatch only with justification for small safe files; secret-like paths and large files are rejected with safer alternatives.

## Local AI

Local AI is disabled by default. When enabled, it may summarize or rank dependencies through an OpenAI-compatible local endpoint, but deterministic static analysis remains authoritative for paths, line ranges, signatures, imports, exports, and exact code.

## Development

```bash
npm run build
npm run typecheck
npm run lint
npm run test
```
