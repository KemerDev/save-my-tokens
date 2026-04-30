import { describe, expect, it } from 'vitest';
import { defaultConfig } from '../../src/config/schema.js';
import { createRuntimeContext } from '../../src/server.js';
import { resolveSymbol } from '../../src/mcp/tools/resolveSymbol.js';
import { getExactSnippet } from '../../src/mcp/tools/getExactSnippet.js';
import { readFullFileEscapeHatch } from '../../src/mcp/tools/readFullFileEscapeHatch.js';
const root = `${process.cwd()}/tests/fixtures/basic`;
async function ctx() { return createRuntimeContext({ ...defaultConfig, roots: [root], fullFileReadLimitLines: 100 }); }
describe('tools', () => { it('resolves symbol', async () => { const out: any = await resolveSymbol(await ctx(), { symbol: 'LoginService', max_results: 5 }); expect(out.structuredContent.matches.length).toBeGreaterThan(0); }); it('gets exact snippet', async () => { const out: any = await getExactSnippet(await ctx(), { path: 'src/service.ts', start_line: 1, end_line: 3, max_tokens: 100 }); expect(out.structuredContent.snippet.code).toContain('UserRepository'); }); it('rejects large full-file escape hatch', async () => { const out: any = await readFullFileEscapeHatch(await ctx(), { path: 'src/large.ts', justification: 'debug generated list', max_tokens: 10000 }); expect(out.isError).toBe(true); }); });
