const order = { error: 0, warn: 1, info: 2, debug: 3 };
export function createLogger(level, _quietStdout = true) {
    const emit = (name, args) => { if (order[name] <= order[level])
        console.error(`[save-my-tokens:${name}]`, ...args); };
    return { error: (...a) => emit('error', a), warn: (...a) => emit('warn', a), info: (...a) => emit('info', a), debug: (...a) => emit('debug', a) };
}
//# sourceMappingURL=logger.js.map