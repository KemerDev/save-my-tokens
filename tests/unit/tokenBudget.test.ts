import { describe, expect, it } from 'vitest';
import { createTokenBudget, reservePrimaryContext } from '../../src/guardrails/tokenBudget.js';
describe('token budget', () => { it('tracks consumption', () => { const b = createTokenBudget(10); expect(reservePrimaryContext(b, 'hello').accepted).toBe(true); expect(b.consumedTokens).toBeGreaterThan(0); }); });
