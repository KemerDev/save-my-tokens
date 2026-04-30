import type { RuntimeContext } from '../server.js';
import type { SourceRange } from '../indexer/types.js';
import { readSafeSource } from '../indexer/fileTree.js';
import { estimateTokens, toLines } from '../utils/text.js';
export function getSourceRange(source: { path: string; text: string }, range: SourceRange) { const lines = toLines(source.text); const code = lines.slice(range.startLine - 1, range.endLine).join('\n'); return { path: source.path, range, code, estimatedTokens: estimateTokens(code) }; }
export async function snippetForRange(context: RuntimeContext, path: string, range: SourceRange) { return getSourceRange(await readSafeSource(path, context.repository, context.config), range); }
