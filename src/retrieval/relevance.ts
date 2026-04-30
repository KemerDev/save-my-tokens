import type { RuntimeContext } from '../server.js';
import { lexicalScore } from '../utils/text.js';
export function rankSymbols(context: RuntimeContext, query: string, limit = 10) { return context.index.symbols.map(s => ({ symbol: s, score: lexicalScore(query, `${s.qualifiedName} ${s.path} ${s.signature ?? ''}`) })).filter(r => r.score > 0).sort((a,b) => b.score - a.score).slice(0, limit); }
export function rankFiles(context: RuntimeContext, query: string, limit = 10) { return context.index.files.map(f => ({ file: f, score: lexicalScore(query, `${f.path} ${f.language}`) })).filter(r => r.score > 0).sort((a,b) => b.score - a.score).slice(0, limit); }
