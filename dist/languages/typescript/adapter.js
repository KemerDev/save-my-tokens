import ts from 'typescript';
function pos(sf, n) { const a = sf.getLineAndCharacterOfPosition(n.getStart(sf)); const b = sf.getLineAndCharacterOfPosition(n.getEnd()); return { startLine: a.line + 1, endLine: b.line + 1, startColumn: a.character + 1, endColumn: b.character + 1 }; }
function nameOf(n) { const any = n; return any.name && ts.isIdentifier(any.name) ? any.name.text : any.name?.getText?.() ?? null; }
function kindOf(n) { if (ts.isClassDeclaration(n))
    return 'class'; if (ts.isMethodDeclaration(n) || ts.isConstructorDeclaration(n) || ts.isGetAccessor(n) || ts.isSetAccessor(n))
    return 'method'; if (ts.isFunctionDeclaration(n))
    return 'function'; if (ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n) || ts.isEnumDeclaration(n))
    return 'type'; if (ts.isVariableStatement(n) || ts.isVariableDeclaration(n) || ts.isPropertyDeclaration(n))
    return 'variable'; return 'unknown'; }
function exported(n) { const mods = ts.canHaveModifiers(n) ? ts.getModifiers(n) : undefined; if (mods?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword))
    return 'default-exported'; if (mods?.some(m => m.kind === ts.SyntaxKind.ExportKeyword))
    return 'exported'; return 'local'; }
function signature(sf, n) { const text = n.getText(sf).split(/\r?\n/)[0]?.trim() ?? ''; return text.length > 240 ? text.slice(0, 240) : text; }
function importance(ref, rel) { if (/auth|valid|save|delete|update|create|send|request|fetch|repo|db/i.test(ref))
    return 'high'; if (rel === 'calls' || rel === 'constructs')
    return 'medium'; return 'low'; }
function resolveImport(path, source) { if (!source.startsWith('.'))
    return null; const tsSource = source.replace(/\.js$/, '.ts').replace(/\.jsx$/, '.tsx'); const base = path.split('/').slice(0, -1).join('/'); const raw = `${base}/${tsSource}`.replace(/(^|\/)\.\//g, '$1'); const parts = []; for (const p of raw.split('/')) {
    if (p === '..')
        parts.pop();
    else if (p && p !== '.')
        parts.push(p);
} const joined = parts.join('/'); return /\.[tj]sx?$/.test(joined) ? joined : `${joined}.ts`; }
export function createTypeScriptAdapter() {
    return { supports: p => /\.[cm]?[tj]sx?$/.test(p), parse(source) {
            const sf = ts.createSourceFile(source.path, source.text, ts.ScriptTarget.Latest, true, source.path.endsWith('.tsx') || source.path.endsWith('.jsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
            const symbols = [], imports = [], exports = [], deps = [];
            const stack = [];
            const addSym = (n, fallback) => { const nm = nameOf(n) ?? fallback; if (!nm)
                return null; const container = stack.at(-1)?.qualifiedName ?? null; const qualifiedName = container ? `${container}.${nm}` : nm; const rec = { id: `${source.path}#${qualifiedName}@${pos(sf, n).startLine}`, name: nm, qualifiedName, kind: kindOf(n), path: source.path, range: pos(sf, n), signature: signature(sf, n), container, exportStatus: exported(n), language: source.path.endsWith('.tsx') ? 'tsx' : source.path.endsWith('.js') ? 'javascript' : source.path.endsWith('.jsx') ? 'jsx' : 'typescript', docstring: null }; symbols.push(rec); if (rec.exportStatus !== 'local')
                exports.push({ path: source.path, name: rec.name, kind: rec.kind, line: rec.range.startLine, symbolId: rec.id }); return rec; };
            const visit = (n) => {
                let pushed = null;
                if (ts.isClassDeclaration(n) || ts.isFunctionDeclaration(n) || ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n) || ts.isMethodDeclaration(n) || ts.isConstructorDeclaration(n) || ts.isPropertyDeclaration(n)) {
                    pushed = addSym(n, ts.isConstructorDeclaration(n) ? 'constructor' : undefined);
                    if (pushed)
                        stack.push(pushed);
                }
                if (ts.isVariableStatement(n))
                    for (const d of n.declarationList.declarations) {
                        const rec = addSym(d, d.name.getText(sf));
                        if (rec && n.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
                            rec.exportStatus = 'exported';
                            exports.push({ path: source.path, name: rec.name, kind: rec.kind, line: rec.range.startLine, symbolId: rec.id });
                        }
                    }
                if (ts.isImportDeclaration(n)) {
                    const clause = n.importClause;
                    const src = String(n.moduleSpecifier.text);
                    const line = pos(sf, n).startLine;
                    if (clause?.name)
                        imports.push({ path: source.path, statement: n.getText(sf), line, importedName: 'default', localName: clause.name.text, source: src, resolvedPath: resolveImport(source.path, src) });
                    const bindings = clause?.namedBindings;
                    if (bindings && ts.isNamedImports(bindings))
                        for (const e of bindings.elements)
                            imports.push({ path: source.path, statement: n.getText(sf), line, importedName: e.propertyName?.text ?? e.name.text, localName: e.name.text, source: src, resolvedPath: resolveImport(source.path, src) });
                }
                const current = stack.at(-1);
                if (current) {
                    const callRel = ts.isCallExpression(n) ? 'calls' : ts.isNewExpression(n) ? 'constructs' : null;
                    if (callRel) {
                        const ref = n.expression.getText(sf);
                        deps.push({ fromSymbolId: current.id, toSymbolId: null, reference: ref, relationship: callRel, location: { path: source.path, line: pos(sf, n).startLine, column: pos(sf, n).startColumn }, importance: importance(ref, callRel), resolution: 'unresolved' });
                    }
                    if (ts.isPropertyAccessExpression(n) && n.expression.kind === ts.SyntaxKind.ThisKeyword) {
                        const ref = `this.${n.name.text}`;
                        deps.push({ fromSymbolId: current.id, toSymbolId: null, reference: ref, relationship: ts.isBinaryExpression(n.parent) && n.parent.left === n ? 'writes' : 'reads', location: { path: source.path, line: pos(sf, n).startLine, column: pos(sf, n).startColumn }, importance: importance(ref, 'reads'), resolution: 'unresolved' });
                    }
                }
                ts.forEachChild(n, visit);
                if (pushed)
                    stack.pop();
            };
            visit(sf);
            return { symbols, imports, exports, dependencies: deps };
        } };
}
//# sourceMappingURL=adapter.js.map