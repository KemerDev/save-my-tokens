# Task: README and Agent Instructions

## Objective

Create production-ready documentation and coding-agent instruction files.

## Context

Read these plan sections:

- `cdd/plan/product-scope.md`
- `cdd/plan/guardrails-local-ai-and-release.md` Documentation Deliverables
- `specifications.md` sections about AGENTS.md and CLAUDE.md templates

## Files to create or modify

- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `.save-my-tokens.example.json`

## README requirements

- Product summary.
- Why symbol-first context saves tokens.
- Installation with `npx`.
- Global npm install.
- Local checkout development.
- MCP client config examples.
- CLI flags.
- Config file example.
- Environment variables.
- Tool list with short usage guidance.
- Recommended cloud-agent workflow.
- Local AI setup.
- Full-file escape hatch warning.
- Development commands.

## Agent instruction requirements

Both `AGENTS.md` and `CLAUDE.md` must include the core rule:

```text
Never read a full file when the task probably needs a symbol.
```

They must also instruct agents to prefer:

1. `ask_codebase`
2. `resolve_symbol`
3. `get_symbol_context`
4. `get_relevant_context`
5. `get_usage_context`
6. `get_exact_snippet`
7. `read_full_file_escape_hatch` only when necessary

## Tests

- Validate JSON examples in README and `.save-my-tokens.example.json` where practical.
- Confirm README mentions all nine MCP tools.
- Confirm agent instruction files mention exact snippets and escape hatch.

## Acceptance criteria

- A new user can install, configure, run, and understand the intended workflow from README alone.
