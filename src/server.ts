import type { SaveMyTokensConfig } from './config/schema.js';
import { createRepositoryContext } from './config/loadConfig.js';
import { buildIndex } from './indexer/buildIndex.js';
import type { CodebaseIndex, RepositoryContext } from './indexer/types.js';
import { createLogger, type Logger } from './utils/logger.js';
import { createLocalAiClient, type LocalAiClient } from './local-ai/client.js';
export interface RuntimeContext { config: SaveMyTokensConfig; repository: RepositoryContext; index: CodebaseIndex; localAi: LocalAiClient | null; logger: Logger }
export async function createRuntimeContext(config: SaveMyTokensConfig): Promise<RuntimeContext> { const repository = createRepositoryContext(config); const logger = createLogger(config.logLevel, true); const index = await buildIndex(repository, config); const localAi = config.localAi.enabled ? createLocalAiClient(config.localAi) : null; return { config, repository, index, localAi, logger }; }
export async function createMcpServer(context: RuntimeContext) { const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js'); const { registerTools } = await import('./mcp/registerTools.js'); const server = new McpServer({ name: 'save-my-tokens', version: '0.1.0' }); registerTools(server, context); return server; }
export async function startStdioServer(config: SaveMyTokensConfig): Promise<void> { const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js'); const context = await createRuntimeContext(config); const server = await createMcpServer(context); await server.connect(new StdioServerTransport()); }
