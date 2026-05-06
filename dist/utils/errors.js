export class UserFacingError extends Error {
    code;
    details;
    constructor(code, message, details = {}) {
        super(message);
        this.code = code;
        this.details = details;
    }
}
export function toolError(code, message, details = {}, suggested_next_calls = []) { return { error: { code, message, details, suggested_next_calls } }; }
export function toErrorMessage(error) { return error instanceof Error ? error.message : String(error); }
//# sourceMappingURL=errors.js.map