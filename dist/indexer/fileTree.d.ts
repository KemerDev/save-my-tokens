import type { SaveMyTokensConfig } from '../config/schema.js';
import type { IndexedFile, RepositoryContext, SourceFileText } from './types.js';
export declare function discoverFiles(repository: RepositoryContext, config: SaveMyTokensConfig): Promise<IndexedFile[]>;
export declare function readSafeSource(path: string, repository: RepositoryContext, config: SaveMyTokensConfig): Promise<SourceFileText>;
export declare function repoRelativeFromAbsolute(abs: string, repository: RepositoryContext): string;
