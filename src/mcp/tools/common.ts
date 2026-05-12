import type { RuntimeContext } from '../../server.js';
import type { SymbolRecord } from '../../indexer/types.js';
import { findSymbols } from '../../indexer/symbolIndex.js';
import { toolError, UserFacingError, type ToolErrorCode } from '../../utils/errors.js';
import { createTokenBudget, budgetReport, reservePrimaryContext, tryAddOptionalContext } from '../../guardrails/tokenBudget.js';
import { recommendResolve, recommendSymbolContext } from '../../retrieval/recommendations.js';
function terseSummary(data: unknown): string {
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return `OK: ${data.length} items`;
  if (data && typeof data === 'object') {
    const keys = Object.keys(data as Record<string, unknown>);
    return keys.length ? `OK: ${keys.join(', ')}` : 'OK';
  }
  return 'OK';
}
export function okText(data: unknown) { return { content: [{ type: 'text' as const, text: terseSummary(data) }], structuredContent: data }; }
export function errText(code: ToolErrorCode, message: string, details: Record<string, unknown> = {}, suggested: unknown[] = []) { const data = toolError(code, message, details, suggested); return { content: [{ type: 'text' as const, text: JSON.stringify(data) }], structuredContent: data, isError: true }; }
export function catchTool(fn: () => Promise<unknown> | unknown) { return Promise.resolve().then(fn).then((result) => (result && typeof result === 'object' && 'content' in result ? result : okText(result))).catch((e) => { if (e instanceof UserFacingError) return errText(e.code as ToolErrorCode, e.message, e.details); return errText('INTERNAL_ERROR', e instanceof Error ? e.message : String(e)); }); }
export function resolveOne(context: RuntimeContext, symbol: string, fileHint?: string | null): SymbolRecord | { error: unknown } { const matches = findSymbols(context.index, { symbol, fileHint, maxResults: 5 }); if (matches.length === 0) return { error: toolError('SYMBOL_NOT_FOUND', `No symbol found for ${symbol}`, { symbol }, [recommendResolve(symbol)]) }; const top = matches[0]!; const same = matches.filter(m => Math.abs(m.confidence - top.confidence) < .05); if (same.length > 1 && !fileHint) return { error: toolError('AMBIGUOUS_SYMBOL', `Multiple symbols match ${symbol}`, { matches: same.map(m => ({ symbol: m.qualifiedName, path: m.path })) }, same.slice(0,5).map(s => recommendSymbolContext(s))) }; return top; }
export function meta(maxTokens: number, textParts: string[], truncated = false) { const b = createTokenBudget(maxTokens); for (const p of textParts) reservePrimaryContext(b, p); if (truncated) b.truncated = true; return budgetReport(b); }
export function common(maxTokens: number, parts: string[], calls: unknown[] = [], confidence: 'high'|'medium'|'low' = 'medium', reason?: string) { return { token_budget: meta(maxTokens, parts), next_recommended_calls: calls, confidence, ...(reason ? { confidence_reason: reason } : {}) }; }
export function fitList<T>(items: T[], maxTokens: number, render: (item: T) => string) { const b = createTokenBudget(maxTokens); const accepted: T[] = []; const omitted: T[] = []; for (const item of items) { const r = tryAddOptionalContext(b, render(item), 'medium'); (r.accepted ? accepted : omitted).push(item); } return { accepted, omitted, report: budgetReport(b) }; }
export function staticSymbolSummary(s: SymbolRecord) { return `${s.kind} ${s.qualifiedName} at ${s.path}:${s.range.startLine}-${s.range.endLine}`; }
