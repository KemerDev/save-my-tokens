import { readSafeSource } from '../indexer/fileTree.js';
import { estimateTokens, toLines } from '../utils/text.js';
export function getSourceRange(source, range) { const lines = toLines(source.text); const code = lines.slice(range.startLine - 1, range.endLine).join('\n'); return { path: source.path, range, code, estimatedTokens: estimateTokens(code) }; }
export async function snippetForRange(context, path, range) { return getSourceRange(await readSafeSource(path, context.repository, context.config), range); }
//# sourceMappingURL=contextPlanner.js.map