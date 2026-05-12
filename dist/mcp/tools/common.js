import { findSymbols } from '../../indexer/symbolIndex.js';
import { toolError, UserFacingError } from '../../utils/errors.js';
import { createTokenBudget, budgetReport, reservePrimaryContext, tryAddOptionalContext } from '../../guardrails/tokenBudget.js';
import { recommendResolve, recommendSymbolContext } from '../../retrieval/recommendations.js';
function terseSummary(data) {
    if (typeof data === 'string')
        return data;
    if (Array.isArray(data))
        return `OK: ${data.length} items`;
    if (data && typeof data === 'object') {
        const keys = Object.keys(data);
        return keys.length ? `OK: ${keys.join(', ')}` : 'OK';
    }
    return 'OK';
}
export function okText(data) { return { content: [{ type: 'text', text: terseSummary(data) }], structuredContent: data }; }
export function errText(code, message, details = {}, suggested = []) { const data = toolError(code, message, details, suggested); return { content: [{ type: 'text', text: JSON.stringify(data) }], structuredContent: data, isError: true }; }
export function catchTool(fn) { return Promise.resolve().then(fn).then((result) => (result && typeof result === 'object' && 'content' in result ? result : okText(result))).catch((e) => { if (e instanceof UserFacingError)
    return errText(e.code, e.message, e.details); return errText('INTERNAL_ERROR', e instanceof Error ? e.message : String(e)); }); }
export function resolveOne(context, symbol, fileHint) { const matches = findSymbols(context.index, { symbol, fileHint, maxResults: 5 }); if (matches.length === 0)
    return { error: toolError('SYMBOL_NOT_FOUND', `No symbol found for ${symbol}`, { symbol }, [recommendResolve(symbol)]) }; const top = matches[0]; const same = matches.filter(m => Math.abs(m.confidence - top.confidence) < .05); if (same.length > 1 && !fileHint)
    return { error: toolError('AMBIGUOUS_SYMBOL', `Multiple symbols match ${symbol}`, { matches: same.map(m => ({ symbol: m.qualifiedName, path: m.path })) }, same.slice(0, 5).map(s => recommendSymbolContext(s))) }; return top; }
export function meta(maxTokens, textParts, truncated = false) { const b = createTokenBudget(maxTokens); for (const p of textParts)
    reservePrimaryContext(b, p); if (truncated)
    b.truncated = true; return budgetReport(b); }
export function common(maxTokens, parts, calls = [], confidence = 'medium', reason) { return { token_budget: meta(maxTokens, parts), next_recommended_calls: calls, confidence, ...(reason ? { confidence_reason: reason } : {}) }; }
export function fitList(items, maxTokens, render) { const b = createTokenBudget(maxTokens); const accepted = []; const omitted = []; for (const item of items) {
    const r = tryAddOptionalContext(b, render(item), 'medium');
    (r.accepted ? accepted : omitted).push(item);
} return { accepted, omitted, report: budgetReport(b) }; }
export function staticSymbolSummary(s) { return `${s.kind} ${s.qualifiedName} at ${s.path}:${s.range.startLine}-${s.range.endLine}`; }
//# sourceMappingURL=common.js.map