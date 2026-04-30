import type { LogLevel } from '../config/schema.js';
const order: Record<LogLevel, number> = { error: 0, warn: 1, info: 2, debug: 3 };
export interface Logger { error(...args: unknown[]): void; warn(...args: unknown[]): void; info(...args: unknown[]): void; debug(...args: unknown[]): void }
export function createLogger(level: LogLevel, _quietStdout = true): Logger {
  const emit = (name: LogLevel, args: unknown[]) => { if (order[name] <= order[level]) console.error(`[save-my-tokens:${name}]`, ...args); };
  return { error: (...a) => emit('error', a), warn: (...a) => emit('warn', a), info: (...a) => emit('info', a), debug: (...a) => emit('debug', a) };
}
