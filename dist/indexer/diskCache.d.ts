import type { IndexCache } from './cache.js';
import type { RepositoryContext } from './types.js';
export declare function makeCacheId(repository: RepositoryContext): string;
export declare function createDiskCache(): IndexCache;
