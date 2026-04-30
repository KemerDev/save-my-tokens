# Task: Full-File Escape Hatch

## Objective

Implement `read_full_file_escape_hatch` as a guarded, discouraged fallback that returns safer alternatives when rejected.

## Context

Read these plan sections:

- `cdd/plan/mcp-tool-contracts.md` Tool: `read_full_file_escape_hatch`
- `cdd/plan/guardrails-local-ai-and-release.md` Full-file guardrail

## Files to create or modify

- `src/guardrails/depth.ts`
- `src/mcp/tools/readFullFileEscapeHatch.ts`
- `tests/integration/readFullFileEscapeHatch.test.ts`

## Implementation requirements

- Require non-empty justification.
- Reject outside-root and secret-like paths.
- Reject files above `fullFileReadLimitLines` unless a later explicit override feature is added.
- Reject responses that would exceed `max_tokens`.
- On rejection, return file summary, available symbols, and suggested next calls.
- On allowed response, include warning and token budget metadata.
- Do not make this tool attractive as a primary workflow in descriptions or README.

## Tests

- Missing justification fails.
- Small safe file can be returned.
- Large file is rejected with alternatives.
- Secret-like path is rejected.
- Rejected response includes symbol alternatives when indexed.

## Acceptance criteria

- Full-file reads are possible only when justified, safe, and small enough.
