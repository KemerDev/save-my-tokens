import type { LogLevel } from '../config/schema.js';
export interface Logger {
    error(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    info(...args: unknown[]): void;
    debug(...args: unknown[]): void;
}
export declare function createLogger(level: LogLevel, _quietStdout?: boolean): Logger;
