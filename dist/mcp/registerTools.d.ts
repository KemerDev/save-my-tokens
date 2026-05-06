import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { RuntimeContext } from '../server.js';
export declare function registerTools(server: McpServer, context: RuntimeContext | Promise<RuntimeContext>): void;
export declare function registeredToolNames(): string[];
