export type ToolErrorCode = 'SYMBOL_NOT_FOUND' | 'AMBIGUOUS_SYMBOL' | 'FILE_NOT_FOUND' | 'PATH_OUTSIDE_ROOT' | 'TOKEN_BUDGET_TOO_SMALL' | 'DEPENDENCY_DEPTH_TOO_HIGH' | 'FULL_FILE_READ_REJECTED' | 'UNSUPPORTED_LANGUAGE' | 'INDEX_NOT_READY' | 'LOCAL_AI_UNAVAILABLE' | 'INTERNAL_ERROR';
export declare class UserFacingError extends Error {
    code: ToolErrorCode | 'CONFIG_ERROR';
    details: Record<string, unknown>;
    constructor(code: ToolErrorCode | 'CONFIG_ERROR', message: string, details?: Record<string, unknown>);
}
export declare function toolError(code: ToolErrorCode, message: string, details?: Record<string, unknown>, suggested_next_calls?: unknown[]): {
    error: {
        code: ToolErrorCode;
        message: string;
        details: Record<string, unknown>;
        suggested_next_calls: unknown[];
    };
};
export declare function toErrorMessage(error: unknown): string;
