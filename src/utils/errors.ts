export type ToolErrorCode = 'SYMBOL_NOT_FOUND'|'AMBIGUOUS_SYMBOL'|'FILE_NOT_FOUND'|'PATH_OUTSIDE_ROOT'|'TOKEN_BUDGET_TOO_SMALL'|'DEPENDENCY_DEPTH_TOO_HIGH'|'FULL_FILE_READ_REJECTED'|'UNSUPPORTED_LANGUAGE'|'INDEX_NOT_READY'|'LOCAL_AI_UNAVAILABLE'|'INTERNAL_ERROR';
export class UserFacingError extends Error { constructor(public code: ToolErrorCode | 'CONFIG_ERROR', message: string, public details: Record<string, unknown> = {}) { super(message); } }
export function toolError(code: ToolErrorCode, message: string, details: Record<string, unknown> = {}, suggested_next_calls: unknown[] = []) { return { error: { code, message, details, suggested_next_calls } }; }
export function toErrorMessage(error: unknown): string { return error instanceof Error ? error.message : String(error); }
