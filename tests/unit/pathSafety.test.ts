import { describe, expect, it } from 'vitest';
import { defaultConfig } from '../../src/config/schema.js';
import { assertSafeRepoPath } from '../../src/guardrails/pathSafety.js';
const repo = { roots: [process.cwd()], primaryRoot: process.cwd(), configPath: null };
describe('path safety', () => { it('rejects traversal', () => { expect(() => assertSafeRepoPath('../x', repo, defaultConfig)).toThrow(); }); it('rejects secrets', () => { expect(() => assertSafeRepoPath('.env', repo, defaultConfig)).toThrow(); }); });
