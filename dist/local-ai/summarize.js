import { firstSentence } from '../utils/text.js';
export function staticSummary(path, text) { return `${path}: ${firstSentence(text, 220)}`; }
//# sourceMappingURL=summarize.js.map