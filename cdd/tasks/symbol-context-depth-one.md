# Task: Symbol Context Depth Zero and One

## Objective

Implement the core `get_symbol_context` tool with depth `0` and depth `1` behavior.

## Context

Read these plan sections:

- `cdd/plan/mcp-tool-contracts.md` Tool: `get_symbol_context`
- `cdd/plan/indexing-and-retrieval-contracts.md` Context Planning Contract

## Files to create or modify

- `src/retrieval/contextPlanner.ts`
- `src/retrieval/recommendations.ts`
- `src/mcp/tools/getSymbolContext.ts`
- `tests/integration/getSymbolContext.test.ts`

## Implementation requirements

- Resolve the requested symbol through `findSymbols`.
- Return `SYMBOL_NOT_FOUND` or `AMBIGUOUS_SYMBOL` with suggested calls when appropriate.
- Depth `0` returns primary symbol location, signature, optional code, summary, imports, token budget, confidence, and next calls.
- Depth `1` adds direct `this.*` references, constructor assignments, same-class helpers, direct local calls, external dependency summaries, omitted dependencies, and next calls.
- Include exact code for primary symbol when requested and budget permits.
- Include exact code for small high-importance same-class helpers when budget permits.
- Never silently drop important dependencies; list them as omitted or external.
- Respect include options.
- Enforce max dependency depth from config.

## Tests

- Depth `0` returns only primary symbol and metadata.
- Depth `1` includes constructor assignment for `this.repo` in fixture.
- Same-class helper is included or recommended depending on budget.
- External dependency omitted due to budget appears in omitted dependencies with next call.
- Low token budget returns structured `TOKEN_BUDGET_TOO_SMALL` when primary symbol cannot fit.

## Acceptance criteria

- `get_symbol_context` is the strongest and most reliable tool in the first production slice.
