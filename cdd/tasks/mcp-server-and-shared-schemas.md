# Task: MCP Server and Shared Schemas

## Objective

Create the MCP server lifecycle, tool registration shell, shared zod schemas, and standard error handling.

## Context

Read these files:

- `cdd/plan/architecture-contracts.md`
- `cdd/plan/mcp-tool-contracts.md`

## Files to create or modify

- `src/server.ts`
- `src/mcp/registerTools.ts`
- `src/mcp/schemas.ts`
- `src/mcp/tools/*.ts` placeholder handlers for all nine tools
- `src/utils/errors.ts`
- `tests/unit/mcpSchemas.test.ts`
- `tests/integration/mcpRegistration.test.ts`

## Tools to register

- `ask_codebase`
- `resolve_symbol`
- `get_symbol_context`
- `explain_symbol_dependencies`
- `get_usage_context`
- `get_relevant_context`
- `get_exact_snippet`
- `get_file_summary`
- `read_full_file_escape_hatch`

## Implementation requirements

- Verify the current `@modelcontextprotocol/sdk` TypeScript API before writing server registration code.
- Isolate SDK-specific code in `src/server.ts` and `src/mcp/registerTools.ts`.
- Define shared zod schemas for confidence, token budget, source ranges, recommended calls, symbol kinds, dependency importance, dependency relationships, and standard errors.
- Placeholder tool handlers may return `INDEX_NOT_READY` until indexing tasks wire runtime behavior.
- Every handler must validate input with zod.
- Every error must use the standard error shape from `mcp-tool-contracts.md`.

## Tests

- Zod schemas parse valid examples from the specification.
- Invalid tool names in recommended calls are rejected.
- Standard error codes are enumerated.
- All nine tools are registered.

## Acceptance criteria

- MCP server can be constructed without starting a network service.
- All tools have descriptions that encourage symbol-first workflows.
- Tests prove registration coverage for all nine tools.
