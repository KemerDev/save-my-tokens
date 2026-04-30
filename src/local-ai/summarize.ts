import { firstSentence } from '../utils/text.js';
export function staticSummary(path: string, text: string): string { return `${path}: ${firstSentence(text, 220)}`; }
