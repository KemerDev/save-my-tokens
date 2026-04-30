import type { SaveMyTokensConfig } from '../config/schema.js';
import type { DependencyImportance } from '../indexer/types.js';
import { estimateTokens } from '../utils/text.js';
export interface TokenBudget { requestedMaxTokens: number; remainingTokens: number; consumedTokens: number; truncated: boolean }
export interface BudgetReservation { accepted: boolean; estimatedTokens: number; reason?: string }
export function createTokenBudget(maxTokens: number, defaults?: SaveMyTokensConfig): TokenBudget { const requested = maxTokens || defaults?.defaultMaxTokens || 4000; return { requestedMaxTokens: requested, remainingTokens: requested, consumedTokens: 0, truncated: false }; }
function reserve(b: TokenBudget, text: string, required: boolean, priority?: DependencyImportance): BudgetReservation { const estimatedTokens = estimateTokens(text); const slack = priority === 'high' ? 0 : priority === 'medium' ? 20 : 80; if (estimatedTokens + slack <= b.remainingTokens || (required && estimatedTokens <= b.requestedMaxTokens)) { b.remainingTokens -= estimatedTokens; b.consumedTokens += estimatedTokens; return { accepted: true, estimatedTokens }; } b.truncated = true; return { accepted: false, estimatedTokens, reason: 'token budget exceeded' }; }
export const reservePrimaryContext = (b: TokenBudget, text: string) => reserve(b, text, true, 'high');
export const tryAddOptionalContext = (b: TokenBudget, text: string, priority: DependencyImportance = 'medium') => reserve(b, text, false, priority);
export function budgetReport(b: TokenBudget) { return { requested_max_tokens: b.requestedMaxTokens, estimated_returned_tokens: b.consumedTokens, truncated: b.truncated }; }
