import { readFullFileEscapeHatchInputSchema } from '../schemas.js';
import { catchTool, common, errText } from './common.js';
import { readSafeSource } from '../../indexer/fileTree.js';
import { estimateTokens } from '../../utils/text.js';
import { recommendSnippet, recommendSymbolContext } from '../../retrieval/recommendations.js';
export function readFullFileEscapeHatch(context, raw) { return catchTool(async () => { const input = readFullFileEscapeHatchInputSchema.parse(raw); const src = await readSafeSource(input.path, context.repository, context.config); const symbols = context.index.symbols.filter(s => s.path === src.path); const alternatives = symbols.slice(0, 8).map(s => recommendSymbolContext(s, 'Prefer symbol context over full-file reads')); if (src.lineCount > context.config.fullFileReadLimitLines)
    return errText('FULL_FILE_READ_REJECTED', 'File exceeds full-file line limit', { lineCount: src.lineCount, limit: context.config.fullFileReadLimitLines, availableSymbols: symbols.map(s => s.qualifiedName) }, alternatives); const tokens = estimateTokens(src.text); if (tokens > input.max_tokens)
    return errText('TOKEN_BUDGET_TOO_SMALL', 'Full file exceeds max_tokens', { estimated: tokens }, [recommendSnippet(src.path, 1, Math.min(src.lineCount, 80)), ...alternatives]); return { ...common(input.max_tokens, [src.text], alternatives, 'high'), warning: 'Full-file reads are an escape hatch. Prefer symbols, summaries, and exact snippets.', path: src.path, code: src.text }; }); }
//# sourceMappingURL=readFullFileEscapeHatch.js.map