import { describe, it, expect } from 'vitest';
import { getUsageContext } from '../../../src/mcp/tools/getUsageContext.js';
import { defaultConfig } from '../../../src/config/schema.js';
import type { RuntimeContext } from '../../../src/server.js';
import type { SymbolRecord, DependencyRecord } from '../../../src/indexer/types.js';

// location render = 'src/callers.ts:NN' → ~17 chars → 5 tokens
// medium slack = 20, so needs 25 remaining per item.
// Budget trace with max_tokens:50: 50→45→40→35→30→25 (5 accepted), item 6 needs 25 but only 20 left → rejected.
const TARGET_SYMBOL: SymbolRecord = {
  id: 'sym-myFunc',
  name: 'myFunc',
  qualifiedName: 'myFunc',
  kind: 'function',
  path: 'src/target.ts',
  range: { startLine: 10, endLine: 20, startColumn: 1, endColumn: null },
  signature: 'export function myFunc(): void',
  container: null,
  exportStatus: 'exported',
  language: 'typescript',
} as SymbolRecord;

function makeUsageDep(i: number): DependencyRecord {
  return {
    fromSymbolId: `caller-sym-${i}`,
    toSymbolId: 'sym-myFunc',
    reference: 'myFunc',
    relationship: 'calls',
    location: { path: 'src/callers.ts', line: 10 + i, column: null },
    importance: 'medium',
    resolution: 'resolved',
  } as DependencyRecord;
}

function makeContext(depCount: number): RuntimeContext {
  return {
    config: defaultConfig,
    repository: { roots: [], primaryRoot: '', configPath: null },
    index: {
      files: [],
      symbols: [TARGET_SYMBOL],
      imports: [],
      exports: [],
      dependencies: Array.from({ length: depCount }, (_, i) => makeUsageDep(i)),
      summaries: [],
      metadata: { createdAt: '', rootHashes: [], parserVersions: {}, toolVersion: '' },
    },
    localAi: null,
    logger: { info: () => {}, debug: () => {}, warn: () => {}, error: () => {} } as any,
    cacheId: 'test',
  } as unknown as RuntimeContext;
}

describe('getUsageContext fitList', () => {
  it('truncates usages to fit max_tokens and reports omitted count', async () => {
    const ctx = makeContext(20);
    const result = await getUsageContext(ctx, {
      symbol: 'myFunc',
      file_hint: 'src/target.ts',
      include_snippets: false,
      max_results: 20,
      max_tokens: 50,
    });
    const data = (result as any).structuredContent;
    expect(data.usages.length).toBeLessThan(20);
    expect(data.omitted_usage_count).toBeGreaterThan(0);
    expect(data.usages.length + data.omitted_usage_count).toBe(20);
  });

  it('returns all usages when budget is sufficient and reports 0 omitted', async () => {
    const ctx = makeContext(3);
    const result = await getUsageContext(ctx, {
      symbol: 'myFunc',
      file_hint: 'src/target.ts',
      include_snippets: false,
      max_results: 20,
      max_tokens: 5000,
    });
    const data = (result as any).structuredContent;
    expect(data.usages.length).toBe(3);
    expect(data.omitted_usage_count).toBe(0);
  });
});
