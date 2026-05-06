import type { CodebaseIndex, SymbolMatch, SymbolQuery } from './types.js';
export declare function findSymbols(index: CodebaseIndex, query: SymbolQuery): SymbolMatch[];
export declare function resolveDependencyTargets(index: CodebaseIndex): CodebaseIndex;
