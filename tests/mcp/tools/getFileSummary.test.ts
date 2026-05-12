import { describe, it, expect, vi } from 'vitest';
import { getFileSummary } from '../../../src/mcp/tools/getFileSummary.js';
import { defaultConfig } from '../../../src/config/schema.js';
import type { RuntimeContext } from '../../../src/server.js';
import type { SymbolRecord } from '../../../src/indexer/types.js';

vi.mock('../../../src/indexer/fileTree.js', () => ({
  readSafeSource: vi.fn().mockResolvedValue({ path: 'src/target.ts', lineCount: 100 }),
}));

// 72 chars → 18 tokens each. With max_tokens:100 and slack:20, needs 38 remaining per item.
// Budget trace: 100→82→64→46→28 (4 accepted), item 5 needs 38 but only 28 left → rejected.
function makeSymbol(i: number): SymbolRecord {
  return {
    id: `sym-${i}`,
    name: `processItem${i}`,
    qualifiedName: `processItem${i}`,
    kind: 'function',
    path: 'src/target.ts',
    range: { startLine: i * 10, endLine: i * 10 + 8, startColumn: 1, endColumn: null },
    signature: `export async function processItem${i}(data: Record<string, unknown>): Promise<void>`,
    container: null,
    exportStatus: 'exported',
    language: 'typescript',
  } as SymbolRecord;
}

function makeContext(symbolCount: number): RuntimeContext {
  return {
    config: defaultConfig,
    repository: { roots: [], primaryRoot: '', configPath: null },
    index: {
      files: [],
      symbols: Array.from({ length: symbolCount }, (_, i) => makeSymbol(i)),
      imports: [],
      exports: [],
      dependencies: [],
      summaries: [],
      metadata: { createdAt: '', rootHashes: [], parserVersions: {}, toolVersion: '' },
    },
    localAi: null,
    logger: { info: () => {}, debug: () => {}, warn: () => {}, error: () => {} } as any,
    cacheId: 'test',
  } as unknown as RuntimeContext;
}

describe('getFileSummary fitList', () => {
  it('truncates symbols to fit max_tokens and reports omitted count', async () => {
    const ctx = makeContext(20);
    const result = await getFileSummary(ctx, { path: 'src/target.ts', max_tokens: 100 });
    const data = (result as any).structuredContent;
    expect(data.symbols.length).toBeLessThan(20);
    expect(data.omitted_symbols_count).toBeGreaterThan(0);
    expect(data.omitted_symbols_count + data.symbols.length).toBe(20);
  });

  it('returns all symbols when budget is sufficient and reports 0 omitted', async () => {
    const ctx = makeContext(3);
    const result = await getFileSummary(ctx, { path: 'src/target.ts', max_tokens: 5000 });
    const data = (result as any).structuredContent;
    expect(data.symbols.length).toBe(3);
    expect(data.omitted_symbols_count).toBe(0);
  });
});
