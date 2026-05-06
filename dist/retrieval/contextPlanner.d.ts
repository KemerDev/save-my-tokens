import type { RuntimeContext } from '../server.js';
import type { SourceRange } from '../indexer/types.js';
export declare function getSourceRange(source: {
    path: string;
    text: string;
}, range: SourceRange): {
    path: string;
    range: SourceRange;
    code: string;
    estimatedTokens: number;
};
export declare function snippetForRange(context: RuntimeContext, path: string, range: SourceRange): Promise<{
    path: string;
    range: SourceRange;
    code: string;
    estimatedTokens: number;
}>;
