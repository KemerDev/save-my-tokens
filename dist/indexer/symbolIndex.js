import { lexicalScore } from '../utils/text.js';
export function findSymbols(index, query) { const q = query.symbol.toLowerCase(); const rows = index.symbols.filter(s => (!query.kind || s.kind === query.kind) && (!query.fileHint || s.path.includes(query.fileHint)) && (!query.scope || s.path.includes(query.scope) || s.qualifiedName.includes(query.scope))).map(s => { let score = 0; if (s.qualifiedName.toLowerCase() === q)
    score += 1; if (s.name.toLowerCase() === q)
    score += .8; if (s.qualifiedName.toLowerCase().endsWith(`.${q}`))
    score += .6; score += lexicalScore(q, `${s.qualifiedName} ${s.path}`) * .3; if (query.fileHint && s.path.includes(query.fileHint))
    score += .3; if (s.exportStatus !== 'local')
    score += .1; return { ...s, confidence: Math.min(1, score) }; }).filter(s => s.confidence > 0).sort((a, b) => b.confidence - a.confidence || a.path.localeCompare(b.path)); return rows.slice(0, query.maxResults); }
export function resolveDependencyTargets(index) {
    const byName = new Map();
    for (const s of index.symbols) {
        const arr = byName.get(s.name);
        if (arr)
            arr.push(s);
        else
            byName.set(s.name, [s]);
    }
    for (const d of index.dependencies) {
        const clean = d.reference.split('.').pop()?.replace(/\(.*/, '') ?? d.reference;
        const candidates = byName.get(clean);
        if (candidates?.length) {
            const hit = candidates.length === 1
                ? candidates[0]
                : (candidates.find(s => s.path === d.location.path) ?? candidates[0]);
            d.toSymbolId = hit.id;
            d.resolution = 'resolved';
        }
        else if (!d.reference.startsWith('this.')) {
            d.resolution = 'external';
        }
    }
    return index;
}
//# sourceMappingURL=symbolIndex.js.map