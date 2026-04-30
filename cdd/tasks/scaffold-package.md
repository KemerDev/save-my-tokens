# Task: Scaffold TypeScript Package

## Objective

Create the initial Node.js 20+ TypeScript package structure for `save-my-tokens`.

## Context

Read these plan files first:

- `cdd/plan/product-scope.md`
- `cdd/plan/architecture-contracts.md`
- `cdd/plan/implementation-roadmap.md`

## Files to create

- `package.json`
- `tsconfig.json`
- `.gitignore`
- `.npmignore` or package `files` field
- `src/cli.ts`
- `src/server.ts`
- `src/utils/logger.ts`
- `tests/fixtures/basic/`
- `tests/unit/`
- `tests/integration/`

## Implementation requirements

- Package name: `save-my-tokens` unless unavailable during publishing.
- ESM package.
- Node.js engine: `>=20`.
- Binary: `save-my-tokens` pointing to `dist/cli.js`.
- Scripts: `build`, `dev`, `start`, `test`, `typecheck`, `lint`.
- Runtime dependencies: `@modelcontextprotocol/sdk`, `commander`, `fast-glob`, `ignore`, `typescript`, `zod`.
- Dev dependencies: `@types/node`, `eslint`, `tsx`, `vitest`.
- Initial `src/cli.ts` should expose CLI entrypoint shape but may delegate to placeholder server startup until later tasks fill behavior.
- Initial `src/server.ts` should export the server lifecycle signatures from the architecture contract.

## Tests

- Add a minimal smoke test proving the test runner is configured.
- Add TypeScript compile coverage for initial exports.

## Acceptance criteria

- `npm install` succeeds.
- `npm run build` succeeds.
- `npm run typecheck` succeeds.
- `npm run test` succeeds.
- `node dist/cli.js --help` prints CLI help after `config-and-cli.md` is complete.
