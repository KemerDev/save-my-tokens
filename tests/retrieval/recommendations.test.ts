import { describe, it, expect } from 'vitest';
import {
  recommendSymbolContext,
  recommendSnippet,
  recommendResolve,
} from '../../src/retrieval/recommendations.js';
import type { SymbolRecord } from '../../src/indexer/types.js';

const fakeSymbol = {
  qualifiedName: 'loadConfig',
  path: 'src/config/loadConfig.ts',
  kind: 'function',
  range: { startLine: 10, endLine: 44, startColumn: 1, endColumn: 2 },
} as unknown as SymbolRecord;

describe('recommendSymbolContext', () => {
  it('recommends max_tokens <= 1200', () => {
    const rec = recommendSymbolContext(fakeSymbol);
    expect(rec.args.max_tokens).toBeLessThanOrEqual(1200);
  });
});

describe('recommendSnippet', () => {
  it('recommends max_tokens <= 800', () => {
    const rec = recommendSnippet('src/foo.ts', 10, 40);
    expect(rec.args.max_tokens).toBeLessThanOrEqual(800);
  });
});

describe('recommendResolve', () => {
  it('recommends max_results <= 5', () => {
    const rec = recommendResolve('loadConfig');
    expect(rec.args.max_results).toBeLessThanOrEqual(5);
  });
});
