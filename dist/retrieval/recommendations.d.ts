import type { SymbolRecord } from "../indexer/types.js";
import type { RecommendedCall } from "../mcp/schemas.js";
export declare function recommendSymbolContext(symbol: SymbolRecord, reason?: string): RecommendedCall;
export declare function recommendSnippet(path: string, start_line: number, end_line: number, reason?: string, maxLines?: number): RecommendedCall;
export declare function recommendResolve(symbol: string, reason?: string): RecommendedCall;
