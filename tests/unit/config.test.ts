import { describe, expect, it } from 'vitest';
import { loadConfig } from '../../src/config/loadConfig.js';
describe('config loading', () => { it('applies env then cli precedence', () => { const cfg = loadConfig({ root: ['cli-root'], maxTokens: 123 }, { SAVE_MY_TOKENS_ROOT: 'env-root', SAVE_MY_TOKENS_DEFAULT_MAX_TOKENS: '50' }); expect(cfg.roots).toEqual(['cli-root']); expect(cfg.defaultMaxTokens).toBe(123); }); it('requires root', () => { expect(() => loadConfig({}, {})).toThrow(/At least one/); }); });
