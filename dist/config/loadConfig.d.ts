import { type SaveMyTokensConfig } from './schema.js';
export interface CliConfigInput {
    root?: string[];
    config?: string;
    maxTokens?: number;
    dependencyDepth?: number;
    localAiProvider?: string;
    localAiBaseUrl?: string;
    localAiModel?: string;
    disableLocalAi?: boolean;
    logLevel?: string;
    watch?: boolean;
    stdio?: boolean;
}
export declare function loadConfig(cli?: CliConfigInput, env?: NodeJS.ProcessEnv): SaveMyTokensConfig;
export declare function createRepositoryContext(config: SaveMyTokensConfig, configPath?: string | null): {
    roots: string[];
    primaryRoot: string;
    configPath: string | null;
};
