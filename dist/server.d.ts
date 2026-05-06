import type { SaveMyTokensConfig } from './config/schema.js';
import type { CodebaseIndex, RepositoryContext } from './indexer/types.js';
import { type Logger } from './utils/logger.js';
import { type LocalAiClient } from './local-ai/client.js';
export interface RuntimeContext {
    config: SaveMyTokensConfig;
    repository: RepositoryContext;
    index: CodebaseIndex;
    localAi: LocalAiClient | null;
    logger: Logger;
    cacheId: string;
}
export declare function createRuntimeContext(config: SaveMyTokensConfig): Promise<RuntimeContext>;
export declare function createMcpServer(context: RuntimeContext): Promise<import("@modelcontextprotocol/sdk/server/mcp.js").McpServer>;
export declare function startStdioServer(config: SaveMyTokensConfig): Promise<void>;
