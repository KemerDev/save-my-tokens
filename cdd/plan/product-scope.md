# Product Scope and Delivery Plan

## Goal

Build `save-my-tokens` as a production-ready TypeScript MCP server that gives cloud AI agents compact, structured, dependency-aware code context instead of broad raw file reads.

The default context hierarchy is:

```text
symbol > range > summary > file
```

## Non-Negotiable Product Rules

- Never return a full file when the agent probably needs a symbol.
- Every context-returning tool accepts an explicit `max_tokens` budget.
- Exact source remains available for edit-critical ranges.
- Local AI is optional and never authoritative for exact code facts.
- Full-file access is an escape hatch with justification, limits, and safer alternatives.
- Generated, dependency, build, VCS, and secret-like paths are excluded by default.

## Target Runtime and Distribution

| Area | Decision |
|---|---|
| Language | TypeScript |
| Runtime | Node.js 20+ |
| Module format | ESM |
| Package manager | npm-compatible; implementation may use npm, pnpm, or bun locally |
| CLI binary | `save-my-tokens` |
| MCP transport | stdio by default |
| Primary package | `save-my-tokens` if available; scoped package fallback if not |

## Recommended Dependency Set

### Runtime dependencies

| Package | Purpose |
|---|---|
| `@modelcontextprotocol/sdk` | MCP server and tool registration |
| `commander` | CLI argument parsing |
| `fast-glob` | Repository file discovery |
| `ignore` | `.gitignore` and configured exclude handling |
| `typescript` | TypeScript/JavaScript AST parsing and symbol extraction |
| `zod` | Runtime schema validation for config, CLI, and MCP tool inputs |

### Development dependencies

| Package | Purpose |
|---|---|
| `@types/node` | Node.js typing |
| `tsx` | Local TypeScript execution during development |
| `vitest` | Unit and integration tests |
| `eslint` | Linting |

### Deferred optional dependencies

| Package | Purpose | Adoption condition |
|---|---|---|
| `tree-sitter` | Multi-language parsing | Add after TypeScript/JavaScript baseline is stable |
| `tree-sitter-typescript` | TS/JS tree-sitter parser | Add with tree-sitter phase |
| `tree-sitter-python` | Python tree-sitter parser | Add with Python support phase |
| Embedding provider/client | Semantic retrieval | Add after deterministic indexes and summaries pass tests |

## First Production Slice

The first production slice should support one repository root and TypeScript/JavaScript analysis well enough to expose the full MCP tool set with graceful degradation for unsupported languages.

### Included in first production slice

- CLI and config loading.
- MCP stdio server.
- File discovery with safe root boundaries and excludes.
- Symbol index for TypeScript and JavaScript using the TypeScript compiler API.
- Import/export metadata for TypeScript and JavaScript.
- Exact snippet retrieval by safe path and bounded line range.
- Token budget estimation and response shaping.
- `resolve_symbol`.
- `get_file_summary`.
- `get_exact_snippet`.
- `get_symbol_context` with depth `0` and meaningful depth `1` for direct local dependencies.
- `get_usage_context` for indexed symbols and exact textual usage fallback.
- `explain_symbol_dependencies` using static metadata and summaries.
- `get_relevant_context` using lexical scoring over indexed symbols, summaries, and file paths.
- `ask_codebase` using the same deterministic retrieval plus optional local-AI summarization when configured.
- `read_full_file_escape_hatch` with strict rejection behavior for large files and unsafe paths.
- Tests, README, AGENTS.md, CLAUDE.md, and package metadata.

### Explicitly deferred

- Deep semantic embeddings.
- Multi-root workspace merging beyond config acceptance.
- Full type-checker project graph precision across complex monorepos.
- Python and other languages beyond file summary, exact snippet, and basic symbol fallback.
- Watch-mode incremental updates beyond simple re-index-on-change support.
- Remote AI provider support; only local/OpenAI-compatible HTTP adapter shape is planned.

## Definition of Done

- `npm run build` passes.
- `npm run typecheck` passes.
- `npm run test` passes.
- MCP server starts over stdio from the built CLI.
- All nine tools are registered and validated with zod schemas.
- Tool responses use documented structured output and error shapes.
- Guardrail tests prove unsafe paths, secret-like paths, excessive depth, and large full-file reads are rejected.
- Fixture integration tests prove the symbol-first workflow can locate, summarize, retrieve, and expand context for a TypeScript service class.
- README includes install, MCP client config, local development, local AI, and escape-hatch guidance.
