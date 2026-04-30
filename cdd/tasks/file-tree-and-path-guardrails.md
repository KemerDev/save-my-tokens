# Task: File Tree and Path Guardrails

## Objective

Implement repository file discovery, safe source reading, path boundaries, excludes, and secret-like file protections.

## Context

Read these plan files:

- `cdd/plan/indexing-and-retrieval-contracts.md`
- `cdd/plan/guardrails-local-ai-and-release.md`

## Files to create or modify

- `src/indexer/fileTree.ts`
- `src/indexer/types.ts`
- `src/guardrails/pathSafety.ts`
- `src/guardrails/secretRedaction.ts`
- `src/utils/text.ts`
- `tests/unit/pathSafety.test.ts`
- `tests/unit/fileTree.test.ts`
- `tests/unit/secretRedaction.test.ts`
- `tests/fixtures/basic/` fixture files

## Implementation requirements

- Discover files under configured roots using `fast-glob` and `ignore`.
- Respect configured excludes and `.gitignore` where practical.
- Exclude default folders: `node_modules`, `dist`, `build`, `.next`, `coverage`, `.git`, `vendor`.
- Exclude default secret-like files: `.env`, `.env.*`, `*.pem`, `*.key`, `*.crt`.
- Reject path traversal and absolute paths outside roots.
- Provide internal `readSafeSource` for later tools.
- Track path, absolute path, language, line count, content hash, ignored state, and ignore reason.

## Tests

- Outside-root paths are rejected.
- Path traversal is rejected.
- Secret-like paths are rejected.
- Default excluded directories are skipped.
- Fixture TypeScript files are discovered.
- Content hash changes when fixture content changes.

## Acceptance criteria

- Indexing tasks can consume discovered `IndexedFile` records.
- No MCP tool can safely bypass `assertSafeRepoPath` once wired.
