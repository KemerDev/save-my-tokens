import type { RuntimeContext } from '../../server.js';
import { getFileSummaryInputSchema } from '../schemas.js';
import { catchTool, common } from './common.js';
import { readSafeSource } from '../../indexer/fileTree.js';
import { recommendSymbolContext } from '../../retrieval/recommendations.js';
export function getFileSummary(context: RuntimeContext, raw: unknown) { return catchTool(async () => { const input = getFileSummaryInputSchema.parse(raw); const src = await readSafeSource(input.path, context.repository, context.config); const symbols = context.index.symbols.filter(s => s.path === src.path); const imports = context.index.imports.filter(i => i.path === src.path); const exports = context.index.exports.filter(e => e.path === src.path); const summary = `${src.path} has ${src.lineCount} lines, ${symbols.length} indexed symbols, ${imports.length} imports, and ${exports.length} exports.`; return { ...common(input.max_tokens, [summary], symbols.slice(0,3).map(s => recommendSymbolContext(s)), 'high'), path: src.path, summary, imports, exports, symbols: symbols.map(s => ({ symbol: s.qualifiedName, kind: s.kind, range: s.range, signature: s.signature })) }; }); }
