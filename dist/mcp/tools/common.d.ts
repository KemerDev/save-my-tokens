import type { RuntimeContext } from '../../server.js';
import type { SymbolRecord } from '../../indexer/types.js';
import { type ToolErrorCode } from '../../utils/errors.js';
export declare function okText(data: unknown): {
    content: {
        type: "text";
        text: string;
    }[];
    structuredContent: unknown;
};
export declare function errText(code: ToolErrorCode, message: string, details?: Record<string, unknown>, suggested?: unknown[]): {
    content: {
        type: "text";
        text: string;
    }[];
    structuredContent: {
        error: {
            code: ToolErrorCode;
            message: string;
            details: Record<string, unknown>;
            suggested_next_calls: unknown[];
        };
    };
    isError: boolean;
};
export declare function catchTool(fn: () => Promise<unknown> | unknown): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
    structuredContent: {
        error: {
            code: ToolErrorCode;
            message: string;
            details: Record<string, unknown>;
            suggested_next_calls: unknown[];
        };
    };
    isError: boolean;
} | (object & Record<"content", unknown>)>;
export declare function resolveOne(context: RuntimeContext, symbol: string, fileHint?: string | null): SymbolRecord | {
    error: unknown;
};
export declare function meta(maxTokens: number, textParts: string[], truncated?: boolean): {
    requested_max_tokens: number;
    estimated_returned_tokens: number;
    truncated: boolean;
};
export declare function common(maxTokens: number, parts: string[], calls?: unknown[], confidence?: 'high' | 'medium' | 'low', reason?: string): {
    confidence_reason?: string | undefined;
    token_budget: {
        requested_max_tokens: number;
        estimated_returned_tokens: number;
        truncated: boolean;
    };
    next_recommended_calls: unknown[];
    confidence: "high" | "medium" | "low";
};
export declare function fitList<T>(items: T[], maxTokens: number, render: (item: T) => string): {
    accepted: T[];
    omitted: T[];
    report: {
        requested_max_tokens: number;
        estimated_returned_tokens: number;
        truncated: boolean;
    };
};
export declare function staticSymbolSummary(s: SymbolRecord): string;
