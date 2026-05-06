import type { SaveMyTokensConfig } from '../config/schema.js';
import type { CodebaseIndex, RepositoryContext } from './types.js';
export declare function buildIndex(repository: RepositoryContext, config: SaveMyTokensConfig): Promise<CodebaseIndex>;
