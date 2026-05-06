import type { SaveMyTokensConfig } from '../config/schema.js';
import type { DependencyImportance } from '../indexer/types.js';
export interface TokenBudget {
    requestedMaxTokens: number;
    remainingTokens: number;
    consumedTokens: number;
    truncated: boolean;
}
export interface BudgetReservation {
    accepted: boolean;
    estimatedTokens: number;
    reason?: string;
}
export declare function createTokenBudget(maxTokens: number, defaults?: SaveMyTokensConfig): TokenBudget;
export declare const reservePrimaryContext: (b: TokenBudget, text: string) => BudgetReservation;
export declare const tryAddOptionalContext: (b: TokenBudget, text: string, priority?: DependencyImportance) => BudgetReservation;
export declare function budgetReport(b: TokenBudget): {
    requested_max_tokens: number;
    estimated_returned_tokens: number;
    truncated: boolean;
};
