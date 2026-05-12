import { describe, it, expect } from 'vitest';
import { recommendedCallSchema } from '../../src/mcp/schemas.js';

describe('recommendedCallSchema', () => {
  it('accepts a call without reason', () => {
    const result = recommendedCallSchema.safeParse({
      tool: 'resolve_symbol',
      args: { symbol: 'loadConfig', max_results: 5 },
    });
    expect(result.success).toBe(true);
  });

  it('accepts a call with reason', () => {
    const result = recommendedCallSchema.safeParse({
      tool: 'resolve_symbol',
      args: { symbol: 'loadConfig' },
      reason: 'resolve before inspecting',
    });
    expect(result.success).toBe(true);
  });
});
