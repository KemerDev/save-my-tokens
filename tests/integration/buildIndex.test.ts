import { describe, expect, it } from 'vitest';
import { buildIndex } from '../../src/indexer/buildIndex.js';
import { defaultConfig } from '../../src/config/schema.js';
const root = `${process.cwd()}/tests/fixtures/basic`;
describe('buildIndex', () => { it('extracts fixture symbols and dependencies', async () => { const config = { ...defaultConfig, roots: [root] }; const index = await buildIndex({ roots: [root], primaryRoot: root, configPath: null }, config); expect(index.symbols.some(s => s.qualifiedName.includes('LoginService.login'))).toBe(true); expect(index.dependencies.some(d => d.reference.includes('this.repo'))).toBe(true); }); });
