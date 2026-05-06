#!/usr/bin/env node
import { Command } from 'commander';
import { loadConfig } from './config/loadConfig.js';
import { startStdioServer } from './server.js';
import { toErrorMessage, UserFacingError } from './utils/errors.js';
export function createProgram() { const program = new Command(); program.name('save-my-tokens').description('Symbol-first MCP server that returns compact code context.').option('--root <path>', 'repository root', (v, p = []) => [...p, v], []).option('--config <path>', 'config file path').option('--max-tokens <number>', 'default max token budget', (v) => Number(v)).option('--dependency-depth <number>', 'default dependency depth', (v) => Number(v)).option('--local-ai-provider <name>', 'local AI provider').option('--local-ai-base-url <url>', 'OpenAI-compatible local AI base URL').option('--local-ai-model <name>', 'local AI model').option('--disable-local-ai', 'disable optional local AI').option('--log-level <level>', 'error|warn|info|debug').option('--watch', 'watch and rebuild index').option('--no-watch', 'disable watch mode').option('--stdio', 'start MCP stdio transport').action(async (opts) => { try {
    const config = loadConfig(opts);
    if (opts.stdio)
        await startStdioServer(config);
    else
        program.outputHelp();
}
catch (error) {
    const prefix = error instanceof UserFacingError ? `${error.code}: ` : '';
    console.error(`${prefix}${toErrorMessage(error)}`);
    process.exitCode = 1;
} }); return program; }
if (import.meta.url === `file://${process.argv[1]}`)
    await createProgram().parseAsync(process.argv);
//# sourceMappingURL=cli.js.map