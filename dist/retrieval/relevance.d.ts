import type { IndexedFile, SymbolRecord } from "../indexer/types.js";
import type { RuntimeContext } from "../server.js";
export declare function rankSymbols(context: RuntimeContext, query: string, limit?: number, scope?: string | null): {
    symbol: SymbolRecord;
    score: number;
}[];
export declare function rankFiles(context: RuntimeContext, query: string, limit?: number, scope?: string | null): {
    file: IndexedFile;
    score: number;
}[];
