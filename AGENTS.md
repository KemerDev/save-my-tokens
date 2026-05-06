# save-my-tokens — MANDATORY routing rules

save-my-tokens MCP tools available. Rules protect context window from source flooding. One unrouted file read dumps thousands of tokens into context.

## Think in Code — MANDATORY

Retrieve only the slice of source that answers the question. Never pull a whole file when a symbol, summary, or snippet will do.

- Broad question, no name known → `ask_codebase`
- Symbol name known → `resolve_symbol` → `get_symbol_context`
- Task-specific discovery → `get_relevant_context(mode: “edit”)`
- Edit-critical lines only → `get_exact_snippet`
- Whole file truly required → `read_full_file_escape_hatch` with written justification

## BLOCKED — do NOT use

### native search — FORBIDDEN

`search` / `grep` / `ripgrep` / `find` / list-files on source code. Use `ask_codebase`, `get_relevant_context`, or `resolve_symbol` instead.

### native file reads — FORBIDDEN

`read` / `read_file` / `open_file` / `cat` / `sed` on source files for analysis. Use `get_file_summary`, `get_symbol_context`, or `get_exact_snippet` instead.

### automatic validation — FORBIDDEN

Running lint, build, typecheck, test, or format checks without explicit user request. Summarize the edit and offer manual commands instead.

## REDIRECTED — use MCP tools

### Shell search (any kind)
→ `ask_codebase` (broad), `get_relevant_context` (task-specific), `resolve_symbol` (named symbol), `get_usage_context` (callers / impact)

### File reading (for analysis)
→ `get_file_summary` (file overview), `get_symbol_context` (symbol body + deps), `get_exact_snippet` (edit-critical lines)

### Full-file read
→ `read_full_file_escape_hatch` with non-empty justification. State why symbols and snippets were insufficient. On rejection, follow suggested alternatives — do not fall back to native reading.

## Tool selection

Stop at the first tool that answers the question.

| Step | Tool | When |
|------|------|------|
| 1 | `ask_codebase` | Broad question, no symbol name known |
| 2 | `resolve_symbol` | Symbol name known, need location + signature |
| 3 | `get_symbol_context` | Symbol located, need body / deps |
| 4 | `get_relevant_context` | Task-specific symbol + file discovery |
| 5 | `get_usage_context` | Callers, impact analysis, refactoring surface |
| 6 | `get_file_summary` | File path known, need overview without full content |
| 7 | `get_exact_snippet` | Confirmed edit target, need exact bounded lines |
| 8 | `read_full_file_escape_hatch` | Everything above was insufficient — rare |

Native search/read tools and validation commands are not part of this workflow.

## Parallel I/O batches

Run independent MCP lookups in the same turn:

- `resolve_symbol` + `get_relevant_context` when a named symbol and task context are both needed
- Multiple `get_symbol_context` calls when inspecting sibling symbols
- Multiple `get_exact_snippet` calls when editing separate ranges

## Output

Terse. Artifacts to files, never inline. Return: file path + one-line description.  
After edits: state what changed, state validation was not run, offer optional manual commands.

## Token budget

Pass `max_tokens` on every call sized to your remaining context budget.  
If response contains `”truncated”: true`, follow `next_recommended_calls` — do **not** fall back to native reads.

## Guardrails

| Signal | Meaning | Recovery |
|--------|---------|----------|
| `PATH_OUTSIDE_ROOT` | Path is outside configured repo roots | Use a valid in-repo path |
| `DEPENDENCY_DEPTH_TOO_HIGH` | `depth` exceeds configured max | Reduce the `depth` parameter |
| `FULL_FILE_READ_REJECTED` | File too large or secret-like | Use symbol / snippet tools |

On any rejection, follow the suggested MCP alternatives — do not fall back to native tools.