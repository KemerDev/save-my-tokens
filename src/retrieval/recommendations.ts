import type { SymbolRecord } from "../indexer/types.js";
import type { RecommendedCall } from "../mcp/schemas.js";
export function recommendSymbolContext(
  symbol: SymbolRecord,
  reason = "Inspect symbol context next",
): RecommendedCall {
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
export function recommendSnippet(
  path: string,
  start_line: number,
  end_line: number,
  reason = "Retrieve exact edit range",
  maxLines = 80,
): RecommendedCall {
  const cappedEndLine = Math.min(end_line, start_line + maxLines - 1);
  const cappedReason =
    cappedEndLine < end_line
      ? `${reason} (first ${maxLines} lines; narrow further if needed)`
      : reason;
  return {
    tool: "get_exact_snippet",
    args: { path, start_line, end_line: cappedEndLine, max_tokens: 2000 },
    reason: cappedReason,
  };
}
export function recommendResolve(
  symbol: string,
  reason = "Resolve symbol before requesting context",
): RecommendedCall {
  return { tool: "resolve_symbol", args: { symbol, max_results: 10 }, reason };
}
