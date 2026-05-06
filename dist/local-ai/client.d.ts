import type { LocalAiConfig } from '../config/schema.js';
import type { Confidence, DependencyImportance, DependencyRelationship } from '../indexer/types.js';
export interface SummarizeInput {
    targetType: 'file' | 'symbol' | 'dependency' | 'question';
    text: string;
    maxTokens: number;
    mode?: string;
}
export interface SummarizeOutput {
    summary: string;
    confidence: Confidence;
    model: string;
}
export interface DependencyCandidate {
    symbol: string;
    relationship: DependencyRelationship;
    staticSignals: string[];
    summary?: string | null;
}
export interface RankDependenciesInput {
    primarySymbol: string;
    dependencies: DependencyCandidate[];
    taskHint?: string | null;
}
export interface DependencyRanking {
    symbol: string;
    importance: DependencyImportance;
    reason: string;
}
export interface RankDependenciesOutput {
    rankings: DependencyRanking[];
    model: string;
}
export interface LocalAiHealth {
    available: boolean;
    provider: string;
    model: string;
    reason?: string;
}
export interface LocalAiClient {
    summarize(input: SummarizeInput): Promise<SummarizeOutput>;
    rankDependencies(input: RankDependenciesInput): Promise<RankDependenciesOutput>;
    health(): Promise<LocalAiHealth>;
}
export declare function createDisabledLocalAiClient(config: LocalAiConfig): LocalAiClient;
export declare function createLocalAiClient(config: LocalAiConfig): LocalAiClient;
