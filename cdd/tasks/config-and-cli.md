# Task: Config and CLI

## Objective

Implement CLI parsing and configuration loading with deterministic precedence.

## Context

Read these plan sections:

- `cdd/plan/architecture-contracts.md` Config and Config loading
- `cdd/plan/product-scope.md` Target Runtime and Distribution

## Files to create or modify

- `src/cli.ts`
- `src/config/schema.ts`
- `src/config/loadConfig.ts`
- `src/utils/errors.ts`
- `tests/unit/config.test.ts`
- `tests/unit/cli.test.ts`

## Required CLI flags

- `--root <path>`
- `--config <path>`
- `--max-tokens <number>`
- `--dependency-depth <number>`
- `--local-ai-provider <name>`
- `--local-ai-base-url <url>`
- `--local-ai-model <name>`
- `--disable-local-ai`
- `--log-level <level>`
- `--watch`
- `--no-watch`
- `--stdio`

## Required config sources

Precedence from lowest to highest:

1. Built-in defaults.
2. `.save-my-tokens.json` or explicit config file.
3. Environment variables with `SAVE_MY_TOKENS_` prefix.
4. CLI flags.

## Required environment variables

- `SAVE_MY_TOKENS_ROOT`
- `SAVE_MY_TOKENS_CONFIG`
- `SAVE_MY_TOKENS_DEFAULT_MAX_TOKENS`
- `SAVE_MY_TOKENS_DEFAULT_DEPENDENCY_DEPTH`
- `SAVE_MY_TOKENS_LOCAL_AI_ENABLED`
- `SAVE_MY_TOKENS_LOCAL_AI_PROVIDER`
- `SAVE_MY_TOKENS_LOCAL_AI_BASE_URL`
- `SAVE_MY_TOKENS_LOCAL_AI_MODEL`
- `SAVE_MY_TOKENS_LOG_LEVEL`

## Implementation requirements

- Use zod for config validation.
- Normalize config keys to the TypeScript interface names in `architecture-contracts.md`.
- Validate that at least one root is configured.
- Convert root paths to absolute paths during runtime context creation, not during schema parsing.
- Keep MCP stdio mode quiet on stdout.

## Tests

- Defaults are applied.
- Config file values override defaults.
- Environment variables override config file values.
- CLI values override environment variables.
- Invalid numeric values fail with clear errors.
- Missing root fails before server startup.

## Acceptance criteria

- `save-my-tokens --help` lists all required flags.
- Invalid config produces a user-readable error.
- Unit tests cover precedence and validation.
