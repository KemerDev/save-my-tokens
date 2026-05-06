export function recommendSymbolContext(symbol, reason = "Inspect symbol context next") {
    return {
        tool: "get_symbol_context",
        args: {
            symbol: symbol.qualifiedName,
            file_hint: symbol.path,
            dependency_depth: 1,
            max_tokens: 3000,
        },
        reason,
    };
}
export function recommendSnippet(path, start_line, end_line, reason = "Retrieve exact edit range", maxLines = 80) {
    const cappedEndLine = Math.min(end_line, start_line + maxLines - 1);
    const cappedReason = cappedEndLine < end_line
        ? `${reason} (first ${maxLines} lines; narrow further if needed)`
        : reason;
    return {
        tool: "get_exact_snippet",
        args: { path, start_line, end_line: cappedEndLine, max_tokens: 2000 },
        reason: cappedReason,
    };
}
export function recommendResolve(symbol, reason = "Resolve symbol before requesting context") {
    return { tool: "resolve_symbol", args: { symbol, max_results: 10 }, reason };
}
//# sourceMappingURL=recommendations.js.map