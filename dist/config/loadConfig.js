import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defaultConfig, saveMyTokensConfigSchema } from './schema.js';
import { UserFacingError } from '../utils/errors.js';
function readJson(path) { try {
    return JSON.parse(readFileSync(path, 'utf8'));
}
catch (e) {
    throw new UserFacingError('CONFIG_ERROR', `Invalid config file ${path}: ${e instanceof Error ? e.message : String(e)}`);
} }
function envConfig(env = process.env) { const out = {}; const localAi = {}; if (env.SAVE_MY_TOKENS_ROOT)
    out.roots = env.SAVE_MY_TOKENS_ROOT.split(',').map(s => s.trim()).filter(Boolean); if (env.SAVE_MY_TOKENS_DEFAULT_MAX_TOKENS)
    out.defaultMaxTokens = Number(env.SAVE_MY_TOKENS_DEFAULT_MAX_TOKENS); if (env.SAVE_MY_TOKENS_DEFAULT_DEPENDENCY_DEPTH)
    out.defaultDependencyDepth = Number(env.SAVE_MY_TOKENS_DEFAULT_DEPENDENCY_DEPTH); if (env.SAVE_MY_TOKENS_LOG_LEVEL)
    out.logLevel = env.SAVE_MY_TOKENS_LOG_LEVEL; if (env.SAVE_MY_TOKENS_LOCAL_AI_ENABLED)
    localAi.enabled = /^(1|true|yes)$/i.test(env.SAVE_MY_TOKENS_LOCAL_AI_ENABLED); if (env.SAVE_MY_TOKENS_LOCAL_AI_PROVIDER)
    localAi.provider = env.SAVE_MY_TOKENS_LOCAL_AI_PROVIDER; if (env.SAVE_MY_TOKENS_LOCAL_AI_BASE_URL)
    localAi.baseUrl = env.SAVE_MY_TOKENS_LOCAL_AI_BASE_URL; if (env.SAVE_MY_TOKENS_LOCAL_AI_MODEL)
    localAi.model = env.SAVE_MY_TOKENS_LOCAL_AI_MODEL; if (Object.keys(localAi).length)
    out.localAi = localAi; return out; }
function cliConfig(cli) { const out = {}; const localAi = {}; if (cli.root?.length)
    out.roots = cli.root; if (cli.maxTokens !== undefined)
    out.defaultMaxTokens = cli.maxTokens; if (cli.dependencyDepth !== undefined)
    out.defaultDependencyDepth = cli.dependencyDepth; if (cli.watch !== undefined)
    out.watch = cli.watch; if (cli.logLevel)
    out.logLevel = cli.logLevel; if (cli.disableLocalAi)
    localAi.enabled = false; if (cli.localAiProvider)
    localAi.provider = cli.localAiProvider; if (cli.localAiBaseUrl)
    localAi.baseUrl = cli.localAiBaseUrl; if (cli.localAiModel)
    localAi.model = cli.localAiModel; if (Object.keys(localAi).length)
    out.localAi = localAi; return out; }
function merge(a, b) { const o = { ...a }; for (const [k, v] of Object.entries(b ?? {}))
    o[k] = v && typeof v === 'object' && !Array.isArray(v) ? merge(o[k] ?? {}, v) : v; return o; }
export function loadConfig(cli = {}, env = process.env) { const configPath = cli.config || env.SAVE_MY_TOKENS_CONFIG || (existsSync('.save-my-tokens.json') ? '.save-my-tokens.json' : undefined); const fileCfg = configPath ? readJson(resolve(configPath)) : {}; const merged = merge(merge(merge(defaultConfig, fileCfg), envConfig(env)), cliConfig(cli)); const parsed = saveMyTokensConfigSchema.safeParse(merged); if (!parsed.success)
    throw new UserFacingError('CONFIG_ERROR', parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')); if (parsed.data.roots.length < 1)
    throw new UserFacingError('CONFIG_ERROR', 'At least one repository root is required. Pass --root or set SAVE_MY_TOKENS_ROOT.'); return parsed.data; }
export function createRepositoryContext(config, configPath = null) { const roots = config.roots.map(r => resolve(r)); return { roots, primaryRoot: roots[0], configPath: configPath ? resolve(configPath) : null }; }
//# sourceMappingURL=loadConfig.js.map