import type { CodebaseIndex, RepositoryContext } from './types.js';
import type { SaveMyTokensConfig } from '../config/schema.js';
export interface IndexCache {
    read(repository: RepositoryContext, config: SaveMyTokensConfig): Promise<CodebaseIndex | null>;
    write(repository: RepositoryContext, config: SaveMyTokensConfig, index: CodebaseIndex): Promise<void>;
    invalidate(paths: string[]): Promise<void>;
}
export declare const nullIndexCache: IndexCache;
