# save-my-tokens

`save-my-tokens` is a local TypeScript MCP server that gives cloud coding agents compact, symbol-first code context instead of broad raw file reads.

Core rule: **Never read a full file when the task probably needs a symbol.**

## Install and run

```bash
npx save-my-tokens --root /path/to/repo --stdio
npm install -g save-my-tokens
save-my-tokens --root /path/to/repo --stdio
```

Local checkout:

```bash
npm install
npm run build
node dist/cli.js --root tests/fixtures/basic --stdio
```

## MCP client config

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
