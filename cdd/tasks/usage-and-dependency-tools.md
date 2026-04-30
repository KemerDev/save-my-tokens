# Task: Usage and Dependency Explanation Tools

## Objective

Implement `get_usage_context` and `explain_symbol_dependencies` using indexed symbols and dependency records.

## Context

Read these plan sections:

- `cdd/plan/mcp-tool-contracts.md` Tool: `get_usage_context`
- `cdd/plan/mcp-tool-contracts.md` Tool: `explain_symbol_dependencies`
- `cdd/plan/indexing-and-retrieval-contracts.md` Dependency Expansion Policy

## Files to create or modify

- `src/mcp/tools/getUsageContext.ts`
- `src/mcp/tools/explainSymbolDependencies.ts`
- `src/retrieval/relevance.ts`
- `src/retrieval/recommendations.ts`
- `tests/integration/getUsageContext.test.ts`
- `tests/integration/explainSymbolDependencies.test.ts`

## Implementation requirements

- `get_usage_context` finds usage records from dependency graph and safe text fallback.
- Return definition location when symbol resolves.
- Return usage kind, path, line, enclosing symbol, and optional snippets.
- Bound usage count by `max_results` and token budget.
- `explain_symbol_dependencies` returns summary and dependency list without code snippets.
- Rank dependency importance from static signals first.
- Include recommended calls for high-importance dependencies.

## Tests

- Usage context finds method callers in fixtures.
- Usage context finds `this.repo` reads and calls.
- Snippets are omitted when `include_snippets` is false.
- Dependency explanation includes relationship and importance.
- Dependency explanation does not include exact source code.

## Acceptance criteria

- Impact analysis and call-flow understanding work without broad grep or full-file reads.
