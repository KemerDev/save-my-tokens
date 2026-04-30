import { createHash } from 'node:crypto';
export function countLines(text: string): number { return text.length === 0 ? 0 : text.split(/\r?\n/).length; }
export function sha256(text: string): string { return createHash('sha256').update(text).digest('hex'); }
export function estimateTokens(text: string): number { return Math.max(1, Math.ceil(text.length / 4)); }
export function toLines(text: string): string[] { return text.split(/\r?\n/); }
export function firstSentence(text: string, max = 180): string { return text.replace(/\s+/g, ' ').trim().slice(0, max); }
export function lexicalScore(query: string, text: string): number { const q = new Set(query.toLowerCase().split(/[^a-z0-9_]+/).filter(Boolean)); if (!q.size) return 0; const hay = text.toLowerCase(); let score = 0; for (const t of q) if (hay.includes(t)) score += 1; return score / q.size; }
