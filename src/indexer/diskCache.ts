import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import type { IndexCache } from './cache.js';
import type { CodebaseIndex, RepositoryContext } from './types.js';
import type { SaveMyTokensConfig } from '../config/schema.js';

const CACHE_VERSION = 1;

interface CacheEnvelope {
  version: number;
  cacheId: string;
  gitHead: string;
  configHash: string;
  index: CodebaseIndex;
}

function sha12(s: string): string {
  return createHash('sha256').update(s).digest('hex').slice(0, 12);
}

function gitExec(cmd: string, cwd: string, fallback: string): string {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return fallback;
  }
}

export function makeCacheId(repository: RepositoryContext): string {
  const rootHash = sha12(repository.primaryRoot);
  const branch = gitExec('git rev-parse --abbrev-ref HEAD', repository.primaryRoot, 'no-branch')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${rootHash}-${branch}`;
}

function currentGitHead(root: string): string | null {
  const result = gitExec('git rev-parse HEAD', root, '');
  return result.length > 0 ? result : null;
}

function hashConfig(config: SaveMyTokensConfig): string {
  return sha12(JSON.stringify({ roots: config.roots, excludeDirs: config.excludeDirs, excludeFiles: config.excludeFiles }));
}

function cacheDir(): string {
  return join(homedir(), '.cache', 'save-my-tokens');
}

export function createDiskCache(): IndexCache {
  return {
    async read(repository: RepositoryContext, config: SaveMyTokensConfig): Promise<CodebaseIndex | null> {
      const id = makeCacheId(repository);
      const file = join(cacheDir(), `${id}.json`);
      if (!existsSync(file)) return null;
      try {
        const envelope: CacheEnvelope = JSON.parse(readFileSync(file, 'utf8'));
        if (envelope.version !== CACHE_VERSION) return null;
        const head = currentGitHead(repository.primaryRoot);
        if (head === null || envelope.gitHead !== head) return null;
        if (envelope.configHash !== hashConfig(config)) return null;
        return envelope.index;
      } catch {
        return null;
      }
    },

    async write(repository: RepositoryContext, config: SaveMyTokensConfig, index: CodebaseIndex): Promise<void> {
      const head = currentGitHead(repository.primaryRoot);
      if (head === null) return;
      const id = makeCacheId(repository);
      const dir = cacheDir();
      mkdirSync(dir, { recursive: true });
      const envelope: CacheEnvelope = {
        version: CACHE_VERSION,
        cacheId: id,
        gitHead: head,
        configHash: hashConfig(config),
        index,
      };
      writeFileSync(join(dir, `${id}.json`), JSON.stringify(envelope), 'utf8');
    },

    async invalidate(_paths: string[]): Promise<void> {
      // Invalidation is driven by git HEAD changes, not individual paths
    },
  };
}
