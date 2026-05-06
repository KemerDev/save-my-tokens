import type { SaveMyTokensConfig } from '../config/schema.js';
import type { RepositoryContext, RepoRelativePath, AbsolutePath } from '../indexer/types.js';
export declare function isPathInsideRoots(path: AbsolutePath, repository: RepositoryContext): boolean;
export declare function normalizeRepoPath(inputPath: string, repository: RepositoryContext): RepoRelativePath;
export declare function absoluteFromRepoPath(path: RepoRelativePath, repository: RepositoryContext): AbsolutePath;
export declare function isSecretLikePath(path: RepoRelativePath, config: SaveMyTokensConfig): boolean;
export declare function isExcludedPath(path: RepoRelativePath, config: SaveMyTokensConfig): boolean;
export declare function assertSafeRepoPath(path: string, repository: RepositoryContext, config: SaveMyTokensConfig): RepoRelativePath;
export declare function assertExistingFile(path: RepoRelativePath, repository: RepositoryContext): AbsolutePath;
