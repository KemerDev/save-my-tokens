export interface RedactionRecord {
    kind: 'env' | 'private-key' | 'token' | 'credential' | 'unknown';
    line: number | null;
    reason: string;
}
export interface RedactionResult {
    text: string;
    redactions: RedactionRecord[];
}
export declare function redactSecrets(text: string): RedactionResult;
