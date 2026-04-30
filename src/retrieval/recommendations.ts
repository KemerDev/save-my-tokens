import type { SymbolRecord } from '../indexer/types.js';
import type { RecommendedCall } from '../mcp/schemas.js';
export function recommendSymbolContext(symbol: SymbolRecord, reason = 'Inspect symbol context next'): RecommendedCall { return { tool: 'get_symbol_context', args: { symbol: symbol.qualifiedName, file_hint: symbol.path, dependency_depth: 1, max_tokens: 3000 }, reason }; }
export function recommendSnippet(path: string, start_line: number, end_line: number, reason = 'Retrieve exact edit range'): RecommendedCall { return { tool: 'get_exact_snippet', args: { path, start_line, end_line, max_tokens: 2000 }, reason }; }
export function recommendResolve(symbol: string, reason = 'Resolve symbol before requesting context'): RecommendedCall { return { tool: 'resolve_symbol', args: { symbol, max_results: 10 }, reason }; }
