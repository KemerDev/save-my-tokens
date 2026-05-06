import { describe, expect, it } from 'vitest';
import { createDisabledLocalAiClient } from '../../src/local-ai/client.js';
import { defaultConfig } from '../../src/config/schema.js';

const disabledCfg = defaultConfig.localAi;

describe('localAi disabled client', () => {
  it('health returns available: false', async () => {
    const client = createDisabledLocalAiClient(disabledCfg);
    const h = await client.health();
    expect(h.available).toBe(false);
    expect(h.reason).toBe('disabled');
  });

  it('summarize returns low confidence without throwing', async () => {
    const client = createDisabledLocalAiClient(disabledCfg);
    const out = await client.summarize({ targetType: 'file', text: 'some code', maxTokens: 200 });
    expect(out.confidence).toBe('low');
    expect(typeof out.summary).toBe('string');
    expect(out.summary.length).toBeGreaterThan(0);
  });

  it('rankDependencies returns static rankings for all inputs', async () => {
    const client = createDisabledLocalAiClient(disabledCfg);
    const out = await client.rankDependencies({
      primarySymbol: 'LoginService',
      dependencies: [
        { symbol: 'UserRepository', relationship: 'calls', staticSignals: ['persist'] },
        { symbol: 'normalizeEmail', relationship: 'calls', staticSignals: [] }
      ]
    });
    expect(out.rankings.length).toBe(2);
    expect(['high', 'medium', 'low']).toContain(out.rankings[0]!.importance);
  });
});
