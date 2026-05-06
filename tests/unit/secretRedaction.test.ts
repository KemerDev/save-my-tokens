import { describe, expect, it } from 'vitest';
import { redactSecrets } from '../../src/guardrails/secretRedaction.js';

describe('secretRedaction', () => {
  it('redacts private key blocks', () => {
    const text = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0\n-----END PRIVATE KEY-----\n';
    const { text: out, redactions } = redactSecrets(text);
    expect(out).toContain('[REDACTED:private-key]');
    expect(redactions.length).toBeGreaterThan(0);
    expect(redactions[0]!.kind).toBe('private-key');
  });

  it('redacts credential-like assignments', () => {
    const text = 'const api_key = "sk-abc123";';
    const { text: out, redactions } = redactSecrets(text);
    expect(out).toContain('[REDACTED:credential]');
    expect(redactions.length).toBeGreaterThan(0);
  });

  it('redacts environment secret lines', () => {
    const text = 'DATABASE_PASSWORD=supersecret123';
    const { text: out, redactions } = redactSecrets(text);
    expect(out).toContain('[REDACTED:');
    expect(redactions.length).toBeGreaterThan(0);
  });

  it('passes through clean text unchanged', () => {
    const text = 'export function add(a: number, b: number) { return a + b; }';
    const { text: out, redactions } = redactSecrets(text);
    expect(out).toBe(text);
    expect(redactions.length).toBe(0);
  });
});
