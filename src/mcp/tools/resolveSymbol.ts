import type { RuntimeContext } from '../../server.js';
import { findSymbols } from '../../indexer/symbolIndex.js';
import { resolveSymbolInputSchema } from '../schemas.js';
import { catchTool } from './common.js';
import { recommendSymbolContext } from '../../retrieval/recommendations.js';
export function resolveSymbol(context: RuntimeContext, raw: unknown) { return catchTool(() => { const input = resolveSymbolInputSchema.parse(raw); const matches = findSymbols(context.index, { symbol: input.symbol, fileHint: input.file_hint, scope: input.scope, kind: input.kind, maxResults: input.max_results }); return { matches: matches.map(m => ({ symbol: m.qualifiedName, kind: m.kind, path: m.path, range: m.range, signature: m.signature, container: m.container, confidence: m.confidence })), next_recommended_calls: matches[0] ? [recommendSymbolContext(matches[0])] : [] }; }); }
