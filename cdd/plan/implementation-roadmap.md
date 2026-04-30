# Implementation Roadmap

## Execution Model

Tasks in `cdd/tasks` are designed for unattended execution. `cdd/tasks/order.json` defines the only execution order. Filenames intentionally have no numeric prefixes.

## Milestones

### Milestone: Foundation

Outcome: installable TypeScript package with config, CLI, logging, and test framework.

Tasks:

- `scaffold-package.md`
- `config-and-cli.md`

Validation:

- Build and typecheck pass.
- CLI help works.
- Config precedence tests pass.

### Milestone: Safe indexing foundation

Outcome: repository files can be discovered, safely read internally, indexed, and summarized without exposing raw full files as default output.

Tasks:

- `mcp-server-and-shared-schemas.md`
- `file-tree-and-path-guardrails.md`
- `typescript-symbol-index.md`

Validation:

- Fixture repository indexes files and symbols.
- Unsafe paths and excluded paths are rejected.
- Tool schemas are registered.

### Milestone: Symbol-first tools

Outcome: agents can locate symbols, inspect summaries, and retrieve exact snippets without full-file reads.

Tasks:

- `snippet-and-token-budget.md`
- `summary-and-resolve-tools.md`
- `symbol-context-depth-one.md`

Validation:

- `resolve_symbol` finds classes/functions/methods.
- `get_file_summary` returns symbols and next calls.
- `get_exact_snippet` returns bounded exact code.
- `get_symbol_context` returns depth `0` and depth `1` responses.

### Milestone: Dependency-aware and task-aware tools

Outcome: agents can ask for usage, dependency explanations, task-specific context, and broad answers.

Tasks:

- `usage-and-dependency-tools.md`
- `local-ai-adapter.md`
- `task-retrieval-tools.md`

Validation:

- `get_usage_context` identifies usages and enclosing symbols.
- `explain_symbol_dependencies` returns ranked summaries.
- `get_relevant_context` returns edit targets.
- `ask_codebase` returns a concise answer with citations and recommended calls.

### Milestone: Production hardening

Outcome: all tools are guarded, documented, tested, and ready for package release.

Tasks:

- `full-file-escape-hatch.md`
- `readme-agent-instructions.md`
- `integration-hardening-release.md`

Validation:

- Escape hatch rejects large files with alternatives.
- README, AGENTS.md, and CLAUDE.md exist.
- Release checks pass.

## Cross-Task Interface Stability

Tasks must not rename these externally visible tools after the MCP schema task lands:

- `ask_codebase`
- `resolve_symbol`
- `get_symbol_context`
- `explain_symbol_dependencies`
- `get_usage_context`
- `get_relevant_context`
- `get_exact_snippet`
- `get_file_summary`
- `read_full_file_escape_hatch`

Tasks must preserve these externally visible concepts:

- `max_tokens`
- `dependency_depth`
- `include_code`
- `token_budget`
- `next_recommended_calls`
- `confidence`
- Standard error codes from `mcp-tool-contracts.md`

## Production Risks

| Risk | Mitigation |
|---|---|
| MCP SDK API changes | Keep SDK interaction isolated and verify current API during implementation |
| Over-promising static analysis | Mark confidence accurately and use graceful fallbacks |
| Token estimates differ from client model tokenizer | Report estimates, not exact model token counts |
| Local AI leaks sensitive context | Keep local AI optional, path-guarded, and redacted |
| Full-file escape hatch defeats product goal | Reject large files and require justification |
| Complex monorepo import resolution | Ship useful relative import resolution first and document limitations |

## Final Completion Checklist

- Architecture contracts implemented or consciously deferred with documented gaps.
- Tool contracts implemented with schema validation.
- Guardrails applied to every path-accepting tool.
- Fixture tests cover symbol-first workflow.
- Documentation teaches users how to install and use the MCP server.
- Release command sequence passes.
