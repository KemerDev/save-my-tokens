import type { SourceFileText, SymbolRecord, ImportRecord, ExportRecord, DependencyRecord } from '../indexer/types.js';
export interface ParsedFileFacts { symbols: SymbolRecord[]; imports: ImportRecord[]; exports: ExportRecord[]; dependencies: DependencyRecord[] }
export interface LanguageAdapter { supports(path: string): boolean; parse(source: SourceFileText): ParsedFileFacts }
