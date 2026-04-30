# Task: TypeScript Symbol Index

## Objective

Implement deterministic TypeScript/JavaScript symbol, import, export, and direct dependency extraction.

## Context

Read these plan files:

- `cdd/plan/architecture-contracts.md`
- `cdd/plan/indexing-and-retrieval-contracts.md`

## Files to create or modify

- `src/indexer/buildIndex.ts`
- `src/indexer/symbolIndex.ts`
- `src/indexer/importGraph.ts`
- `src/indexer/dependencyGraph.ts`
- `src/languages/languageAdapter.ts`
- `src/languages/typescript/adapter.ts`
- `src/languages/typescript/symbols.ts`
- `src/languages/typescript/dependencies.ts`
- `tests/fixtures/basic/src/*.ts`
- `tests/unit/typescriptSymbols.test.ts`
- `tests/unit/typescriptDependencies.test.ts`
- `tests/integration/buildIndex.test.ts`

## Implementation requirements

- Use the TypeScript compiler API for TypeScript, TSX, JavaScript, and JSX parsing.
- Extract classes, methods, functions, exported variables, type aliases, and interfaces.
- Extract signatures where available from source text.
- Extract line ranges with one-based line numbers.
- Extract imports and exports.
- Resolve local relative imports to repo-relative paths when possible.
- Detect direct function calls inside symbol ranges.
- Detect `this.*` references and constructor assignments for classes.
- Record unresolved dependencies rather than discarding them.
- Mark confidence accurately when a dependency is inferred or unresolved.

## Tests

- Fixture service class produces class and method symbols.
- Constructor-injected `this.repo` assignment is detected.
- Same-class helper call is detected.
- Imported function call is detected with import metadata.
- Duplicate local names in different files can be distinguished by path and qualified name.

## Acceptance criteria

- `buildIndex` returns a complete `CodebaseIndex` for fixture repository.
- Symbol records include stable IDs, qualified names, kinds, paths, line ranges, and signatures.
- Dependency records include relationship, reference, location, importance, and resolution.
