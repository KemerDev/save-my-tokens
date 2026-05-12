import { describe, it, expect } from 'vitest';
import { getSymbolContext } from '../../../src/mcp/tools/getSymbolContext.js';
import { defaultConfig } from '../../../src/config/schema.js';
import type { RuntimeContext } from '../../../src/server.js';
import type { SymbolRecord, DependencyRecord } from '../../../src/indexer/types.js';

// reference = 'someHelperFunc${i}' → 15 chars → 4 tokens
// medium slack = 20, so needs 24 remaining per item.
// Budget trace with max_tokens:50: 50→46→42→38→34→30→26→22 (7 accepted), item 8 needs 24 but only 22 left → rejected.
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

function makeSelfRefDep(i: number): DependencyRecord {
  return {
    fromSymbolId: 'sym-myFunc',
    toSymbolId: null,
    reference: `someHelperFunc${i}`,
    relationship: 'calls',
    location: { path: 'src/target.ts', line: 12 + i, column: null },
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
      dependencies: Array.from({ length: depCount }, (_, i) => makeSelfRefDep(i)),
      summaries: [],
      metadata: { createdAt: '', rootHashes: [], parserVersions: {}, toolVersion: '' },
    },
    localAi: null,
    logger: { info: () => {}, debug: () => {}, warn: () => {}, error: () => {} } as any,
    cacheId: 'test',
  } as unknown as RuntimeContext;
}

describe('getSymbolContext fitList on self_references', () => {
  it('truncates self_references to fit max_tokens and reports omitted count', async () => {
    const ctx = makeContext(20);
    const result = await getSymbolContext(ctx, {
      symbol: 'myFunc',
      file_hint: 'src/target.ts',
      include: { body: false },
      dependency_depth: 0,
      max_tokens: 50,
    });
    const data = (result as any).structuredContent;
    expect(data.self_references.length).toBeLessThan(20);
    expect(data.omitted_self_references_count).toBeGreaterThan(0);
    expect(data.self_references.length + data.omitted_self_references_count).toBe(20);
  });

  it('returns all self_references when budget is sufficient', async () => {
    const ctx = makeContext(3);
    const result = await getSymbolContext(ctx, {
      symbol: 'myFunc',
      file_hint: 'src/target.ts',
      include: { body: false },
      dependency_depth: 0,
      max_tokens: 5000,
    });
    const data = (result as any).structuredContent;
    expect(data.self_references.length).toBe(3);
    expect(data.omitted_self_references_count).toBe(0);
  });
});
