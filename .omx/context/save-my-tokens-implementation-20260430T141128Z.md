# Context Snapshot: save-my-tokens implementation

## Task statement
Implement the save-my-tokens MCP server from the CDD plan and task files in this repository.

## Desired outcome
A production-ready TypeScript MCP server package implementing the tools and contracts described under `cdd/plan/*.md` and `cdd/tasks/*.md`, with build/typecheck/lint/test release gates passing.

## Known facts/evidence
- Plan files live in `cdd/plan/`.
- Task files live in `cdd/tasks/`.
- Execution order is defined by `cdd/tasks/order.json`.
- The repository currently contains CDD specs and OMX state only; implementation files need to be created.
- Release gate from `order.json`: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run test`.
- Required artifacts include `README.md`, `AGENTS.md`, `CLAUDE.md`, `.save-my-tokens.example.json`, and `dist/cli.js`.

## Constraints
- Follow the task dependency order in `cdd/tasks/order.json`.
- Keep implementation local-first; no external production side effects.
- Avoid unnecessary dependencies; use the recommended dependency set from `cdd/plan/product-scope.md` when needed.
- Preserve path safety, token budgets, full-file escape hatch guardrails, and secret redaction contracts.
- Workers should coordinate via OMX team state and avoid overwriting each other.

## Unknowns/open questions
- Exact package metadata/version can use reasonable defaults from project name.
- Local AI integration should be optional and gracefully disabled when unavailable.

## Likely codebase touchpoints
- `package.json`, `tsconfig.json`, lint/test config
- `src/cli.ts`, `src/server.ts`, `src/config.ts`
- `src/schemas.ts`, `src/errors.ts`, `src/tools/*`
- `src/indexing/*`, `src/files/*`, `src/token-budget.ts`, `src/local-ai.ts`
- `test/**` fixtures/unit/integration tests
- Documentation and config examples at repo root

## Suggested team lanes
- Lane A: package scaffold, config/CLI, file tree/path guardrails, TypeScript symbol index.
- Lane B: MCP server/shared schemas and symbol/snippet/summary/dependency/task retrieval tools.
- Lane C: optional local AI adapter, docs/agent instructions, fixture tests, release hardening, final verification.
