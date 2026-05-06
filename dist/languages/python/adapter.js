const CLASS_RE = /^(\s*)class\s+(\w+)/;
const DEF_RE = /^(\s*)(?:async\s+)?def\s+(\w+)\s*\(/;
const IMPORT_RE = /^import\s+(\S+)/;
const FROM_IMPORT_RE = /^from\s+(\S+)\s+import\s+(.+)/;
export function createPythonAdapter() {
    return {
        supports: (p) => p.endsWith('.py'),
        parse(source) {
            const lines = source.text.split(/\r?\n/);
            const symbols = [];
            const imports = [];
            const stack = [];
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const lineNum = i + 1;
                const stripped = line.trimStart();
                // Skip blank lines, comments, and decorator lines
                if (!stripped || stripped.startsWith('#') || stripped.startsWith('@'))
                    continue;
                const importMatch = stripped.match(IMPORT_RE);
                if (importMatch) {
                    const mod = importMatch[1];
                    imports.push({ path: source.path, statement: stripped, line: lineNum, importedName: mod, localName: mod.split('.')[0], source: mod, resolvedPath: null });
                    continue;
                }
                const fromMatch = stripped.match(FROM_IMPORT_RE);
                if (fromMatch) {
                    const mod = fromMatch[1];
                    const rawNames = fromMatch[2].replace(/^\(/, '').replace(/\)$/, '');
                    for (const part of rawNames.split(',')) {
                        const seg = part.trim();
                        if (!seg || seg === '*')
                            continue;
                        const [importedRaw, localRaw] = seg.split(/\s+as\s+/);
                        const importedName = importedRaw.trim();
                        const localName = localRaw ? localRaw.trim() : importedName;
                        imports.push({ path: source.path, statement: stripped, line: lineNum, importedName, localName, source: mod, resolvedPath: null });
                    }
                    continue;
                }
                const indent = line.length - stripped.length;
                const classMatch = stripped.match(CLASS_RE);
                if (classMatch) {
                    while (stack.length && stack[stack.length - 1].indent >= indent)
                        stack.pop();
                    const name = classMatch[2];
                    const container = stack.at(-1)?.qualifiedName ?? null;
                    const qualifiedName = container ? `${container}.${name}` : name;
                    symbols.push({
                        id: `${source.path}#${qualifiedName}@${lineNum}`,
                        name,
                        qualifiedName,
                        kind: 'class',
                        path: source.path,
                        range: { startLine: lineNum, endLine: lineNum, startColumn: indent + 1, endColumn: null },
                        signature: stripped.slice(0, 240),
                        container,
                        exportStatus: name.startsWith('_') ? 'local' : 'exported',
                        language: 'python',
                        docstring: extractDocstring(lines, i + 1),
                    });
                    stack.push({ qualifiedName, indent, kind: 'class' });
                    continue;
                }
                const defMatch = stripped.match(DEF_RE);
                if (defMatch) {
                    while (stack.length && stack[stack.length - 1].indent >= indent)
                        stack.pop();
                    const name = defMatch[2];
                    const container = stack.at(-1)?.qualifiedName ?? null;
                    const qualifiedName = container ? `${container}.${name}` : name;
                    const isMethod = container !== null && stack.at(-1)?.kind === 'class';
                    symbols.push({
                        id: `${source.path}#${qualifiedName}@${lineNum}`,
                        name,
                        qualifiedName,
                        kind: isMethod ? 'method' : 'function',
                        path: source.path,
                        range: { startLine: lineNum, endLine: lineNum, startColumn: indent + 1, endColumn: null },
                        signature: stripped.slice(0, 240),
                        container,
                        exportStatus: name.startsWith('_') ? 'local' : 'exported',
                        language: 'python',
                        docstring: extractDocstring(lines, i + 1),
                    });
                    stack.push({ qualifiedName, indent, kind: 'function' });
                    continue;
                }
            }
            return { symbols, imports, exports: [], dependencies: [] };
        },
    };
}
function extractDocstring(lines, bodyStartIdx) {
    const bodyLine = lines[bodyStartIdx];
    if (!bodyLine)
        return null;
    const trimmed = bodyLine.trimStart();
    const q = trimmed.startsWith('"""') ? '"""' : trimmed.startsWith("'''") ? "'''" : null;
    if (!q)
        return null;
    const inner = trimmed.slice(3);
    const closeIdx = inner.indexOf(q);
    if (closeIdx !== -1)
        return inner.slice(0, closeIdx).trim() || null;
    // Multi-line: scan forward
    const parts = [inner];
    for (let j = bodyStartIdx + 1; j < Math.min(bodyStartIdx + 10, lines.length); j++) {
        const l = lines[j];
        const end = l.indexOf(q);
        if (end !== -1) {
            parts.push(l.slice(0, end));
            break;
        }
        parts.push(l.trim());
    }
    return parts.join(' ').trim() || null;
}
//# sourceMappingURL=adapter.js.map