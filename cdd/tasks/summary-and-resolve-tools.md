# Task: File Summary and Symbol Resolution Tools

## Objective

Implement `get_file_summary` and `resolve_symbol` using the codebase index.

## Context

Read these plan sections:

- `cdd/plan/mcp-tool-contracts.md` Tool: `resolve_symbol`
- `cdd/plan/mcp-tool-contracts.md` Tool: `get_file_summary`
- `cdd/plan/indexing-and-retrieval-contracts.md` Symbol Lookup Contract

## Files to create or modify

- `src/indexer/symbolIndex.ts`
- `src/retrieval/recommendations.ts`
- `src/mcp/tools/resolveSymbol.ts`
- `src/mcp/tools/getFileSummary.ts`
- `tests/integration/resolveSymbol.test.ts`
- `tests/integration/getFileSummary.test.ts`

## Implementation requirements

- `resolve_symbol` returns matches without source bodies.
- Match exact qualified names before unqualified names.
- Apply file hint, scope, and kind filters.
- Return confidence scores.
- Return next recommended `get_symbol_context` call for best matches.
- `get_file_summary` returns summary, imports, exports, symbols, token budget, confidence, and next calls.
- File summary must not return full file content.
- Static summary can be concise and deterministic when local AI is unavailable.

## Tests

- Qualified symbol resolves to one high-confidence match.
- Unqualified duplicate symbol returns multiple matches.
- File hint raises confidence for matching file.
- File summary lists imports, exports, and symbols.
- File summary recommends symbol context for important exported symbols.

## Acceptance criteria

- Agents can locate a symbol and inspect a file overview without raw file reads.
