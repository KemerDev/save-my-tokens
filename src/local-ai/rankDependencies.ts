import type { DependencyImportance } from '../indexer/types.js';
export function staticImportance(reference: string): DependencyImportance { return /auth|valid|repo|db|save|delete|send|fetch|request/i.test(reference) ? 'high' : /log|metric|format/i.test(reference) ? 'low' : 'medium'; }
