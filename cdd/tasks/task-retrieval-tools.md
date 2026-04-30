# Task: Task Retrieval and Codebase Question Tools

## Objective

Implement `get_relevant_context` and `ask_codebase` for broad and task-specific codebase questions.

## Context

Read these plan sections:

- `cdd/plan/mcp-tool-contracts.md` Tool: `get_relevant_context`
- `cdd/plan/mcp-tool-contracts.md` Tool: `ask_codebase`
- `cdd/plan/indexing-and-retrieval-contracts.md` Relevance Retrieval Contract

## Files to create or modify

- `src/retrieval/relevance.ts`
- `src/mcp/tools/getRelevantContext.ts`
- `src/mcp/tools/askCodebase.ts`
- `tests/integration/getRelevantContext.test.ts`
- `tests/integration/askCodebase.test.ts`

## Implementation requirements

- Use indexed file paths, symbol names, signatures, summaries, imports, and dependency records for lexical relevance.
- Respect `scope`, `mode`, `include_code`, and `max_tokens`.
- `get_relevant_context` in edit mode returns edit targets and recommends `get_symbol_context` or `get_exact_snippet` next.
- `ask_codebase` returns concise answer, relevant symbols, relevant files, omitted context, token budget, next calls, and confidence.
- Prefer summaries over code unless `include_code` is true.
- Mark confidence low when retrieval relies primarily on lexical fallback.

## Tests

- Task query identifies fixture login or service symbols by words in task.
- Edit mode returns edit targets.
- Overview mode returns answer without exact code by default.
- Token budget truncates lower-priority context and reports omitted context.
- Recommended calls are specific and valid.

## Acceptance criteria

- Agents can start with a task or question instead of manually listing and reading files.
