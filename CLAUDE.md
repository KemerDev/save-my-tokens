# save-my-tokens Claude instructions

Use save-my-tokens first. Prefer symbols over files. Use exact snippets only for edits. Use full-file reads only as an escape hatch.

Never read a full file when the task probably needs a symbol.

Preferred tool order: ask_codebase, resolve_symbol, get_symbol_context, get_relevant_context, get_usage_context, get_exact_snippet, read_full_file_escape_hatch only when necessary.
