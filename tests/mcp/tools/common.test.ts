import { describe, it, expect } from 'vitest';
import { okText, errText } from '../../../src/mcp/tools/common.js';

describe('okText', () => {
  it('text is a short summary for objects, not pretty JSON', () => {
    const result = okText({ token_budget: {}, symbols: [], confidence: 'high' });
    const text = (result.content[0] as { text: string }).text;
    expect(text).not.toContain('\n');
    expect(text).not.toContain('  ');
    expect(text).toMatch(/OK/i);
  });

  it('text lists object keys', () => {
    const result = okText({ alpha: 1, beta: 2 });
    const text = (result.content[0] as { text: string }).text;
    expect(text).toContain('alpha');
    expect(text).toContain('beta');
  });

  it('text reports array item count', () => {
    const result = okText([1, 2, 3]);
    const text = (result.content[0] as { text: string }).text;
    expect(text).toContain('3');
    expect(text).not.toContain('[');
  });

  it('passes string through unchanged', () => {
    const result = okText('already terse');
    const text = (result.content[0] as { text: string }).text;
    expect(text).toBe('already terse');
  });

  it('preserves full payload in structuredContent', () => {
    const data = { x: 1, y: [2, 3] };
    const result = okText(data);
    expect(result.structuredContent).toBe(data);
  });
});

describe('errText', () => {
  it('text is compact JSON with no indentation', () => {
    const result = errText('SYMBOL_NOT_FOUND', 'not found');
    const text = (result.content[0] as { text: string }).text;
    expect(text).not.toContain('\n');
    expect(text).not.toContain('  ');
  });

  it('isError is true', () => {
    const result = errText('INTERNAL_ERROR', 'boom');
    expect(result.isError).toBe(true);
  });
});
