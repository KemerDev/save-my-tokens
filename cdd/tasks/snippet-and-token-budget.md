# Task: Exact Snippets and Token Budgets

## Objective

Implement exact bounded source snippets and shared token budget utilities.

## Context

Read these plan sections:

- `cdd/plan/mcp-tool-contracts.md` Tool: `get_exact_snippet`
- `cdd/plan/guardrails-local-ai-and-release.md` Token Budget Contract

## Files to create or modify

- `src/guardrails/tokenBudget.ts`
- `src/mcp/tools/getExactSnippet.ts`
- `src/retrieval/contextPlanner.ts`
- `tests/unit/tokenBudget.test.ts`
- `tests/integration/getExactSnippet.test.ts`

## Implementation requirements

- Implement deterministic token estimation suitable for budget enforcement.
- Return `requested_max_tokens`, `estimated_returned_tokens`, and `truncated`.
- Implement safe line-range extraction with one-based inclusive lines.
- Reject invalid ranges.
- Reject ranges outside file line count.
- Reject secret-like paths and outside-root paths through existing guardrails.
- Reject ranges that effectively request a large full-file read unless they fit configured limits.
- Use exact source text for snippets.

## Tests

- Valid range returns exact source lines.
- Invalid line ranges fail with structured error.
- Outside-root path fails.
- Secret-like path fails.
- Excessive range fails with guardrail error.
- Token budget metadata is correct enough for deterministic tests.

## Acceptance criteria

- `get_exact_snippet` is fully functional and schema-valid.
- Later tools can reuse snippet and budget utilities.
