import { estimateTokens } from '../utils/text.js';
export function createTokenBudget(maxTokens, defaults) { const requested = maxTokens || defaults?.defaultMaxTokens || 4000; return { requestedMaxTokens: requested, remainingTokens: requested, consumedTokens: 0, truncated: false }; }
function reserve(b, text, required, priority) { const estimatedTokens = estimateTokens(text); const slack = priority === 'high' ? 0 : priority === 'medium' ? 20 : 80; if (estimatedTokens + slack <= b.remainingTokens) {
    b.remainingTokens -= estimatedTokens;
    b.consumedTokens += estimatedTokens;
    return { accepted: true, estimatedTokens };
} if (required && estimatedTokens <= b.requestedMaxTokens) {
    b.remainingTokens -= estimatedTokens;
    b.consumedTokens += estimatedTokens;
    b.truncated = true;
    return { accepted: true, estimatedTokens };
} b.truncated = true; return { accepted: false, estimatedTokens, reason: 'token budget exceeded' }; }
export const reservePrimaryContext = (b, text) => reserve(b, text, true, 'high');
export const tryAddOptionalContext = (b, text, priority = 'medium') => reserve(b, text, false, priority);
export function budgetReport(b) { return { requested_max_tokens: b.requestedMaxTokens, estimated_returned_tokens: b.consumedTokens, truncated: b.truncated }; }
//# sourceMappingURL=tokenBudget.js.map