# Task: Integration Hardening and Release Readiness

## Objective

Close implementation gaps, add fixture coverage, run release checks, and prepare the package for production use.

## Context

Read all files in `cdd/plan` and all preceding task files.

## Files to create or modify

- `tests/fixtures/basic/` comprehensive fixture repository
- `tests/integration/*.test.ts`
- `package.json`
- `README.md`
- Any source file with a verified gap from prior tasks

## Required fixture scenarios

- A TypeScript service class with constructor-injected `this.repo` and `this.emailSender` dependencies.
- Same-class helper method called by a public method.
- Imported utility function.
- Exported route or handler function.
- Duplicate function name in two files for ambiguous symbol tests.
- A large file for full-file rejection tests.
- Secret-like files that must be excluded.

## Hardening requirements

- Ensure all tools return schema-valid output.
- Ensure all path inputs pass path safety checks.
- Ensure `max_tokens` is enforced or errors clearly when too small.
- Ensure stdout is not polluted in stdio mode.
- Ensure confidence is never overstated for fallback behavior.
- Ensure local AI disabled mode is the default and fully functional.
- Ensure package `files` includes only necessary publish artifacts.

## Required commands

Run and fix failures for:

```bash
npm run build
npm run typecheck
npm run lint
npm run test
```

Run a local smoke command after build:

```bash
node dist/cli.js --root tests/fixtures/basic --stdio
```

The smoke command may require a scripted MCP handshake test instead of manual terminal observation.

## Acceptance criteria

- Build, typecheck, lint, and tests pass.
- All nine tools have fixture integration coverage.
- README and agent instructions are complete.
- Package is ready for npm publish dry run.
