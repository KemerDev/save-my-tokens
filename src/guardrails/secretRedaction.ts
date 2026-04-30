export interface RedactionRecord { kind: 'env' | 'private-key' | 'token' | 'credential' | 'unknown'; line: number | null; reason: string }
export interface RedactionResult { text: string; redactions: RedactionRecord[] }
const patterns: Array<[RegExp, RedactionRecord['kind'], string]> = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, 'private-key', 'private key block'],
  [/(api[_-]?key|token|secret|password|credential)\s*[:=]\s*['"]?[^'"\s]+/gi, 'credential', 'credential-like assignment'],
  [/^[A-Z0-9_]*(TOKEN|SECRET|PASSWORD|KEY)=.+$/gim, 'env', 'environment secret']
];
export function redactSecrets(text: string): RedactionResult {
  const redactions: RedactionRecord[] = []; let out = text;
  for (const [re, kind, reason] of patterns) out = out.replace(re, (m) => { const line = text.slice(0, text.indexOf(m)).split(/\r?\n/).length; redactions.push({ kind, line, reason }); return `[REDACTED:${kind}]`; });
  return { text: out, redactions };
}
