import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';

// vi.hoisted ensures mockExecSync is initialised before vi.mock factories run
const mockExecSync = vi.hoisted(() => vi.fn());

vi.mock('node:child_process', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:child_process')>();
  return { ...actual, execSync: mockExecSync };
});

import { createDiskCache } from '../../src/indexer/diskCache.js';
import { defaultConfig } from '../../src/config/schema.js';

function sha12(s: string): string {
  return createHash('sha256').update(s).digest('hex').slice(0, 12);
}

const CACHE_DIR = join(homedir(), '.cache', 'save-my-tokens');

describe('diskCache - no-git fallback', () => {
  let cacheFile = '';

  beforeEach(() => {
    mkdirSync(CACHE_DIR, { recursive: true });
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (cacheFile && existsSync(cacheFile)) rmSync(cacheFile);
    cacheFile = '';
  });

  it('returns null when git HEAD cannot be resolved, refusing to serve a stale cache', async () => {
    const fakeRoot = '/test-no-git-root';
    const repository = { roots: [fakeRoot], primaryRoot: fakeRoot, configPath: null };
    const config = { ...defaultConfig, roots: [fakeRoot] };

    // Simulate a non-git environment — execSync always throws
    mockExecSync.mockImplementation(() => { throw new Error('fatal: not a git repository'); });

    // Reproduce the exact cacheId that makeCacheId produces when execSync throws:
    // gitExec returns fallback 'no-branch', branch.replace() keeps it as 'no-branch'
    const cacheId = `${sha12(fakeRoot)}-no-branch`;
    cacheFile = join(CACHE_DIR, `${cacheId}.json`);

    // Replicate hashConfig so the configHash check passes
    const configHash = sha12(JSON.stringify({
      roots: config.roots,
      excludeDirs: config.excludeDirs,
      excludeFiles: config.excludeFiles,
    }));

    // Place a stale cache file as it would have been written with the old 'no-git' fallback
    const staleEnvelope = {
      version: 1,
      cacheId,
      gitHead: 'no-git',
      configHash,
      index: { files: [{ path: 'stale.ts' }], symbols: [], symbolIndex: {} },
    };
    writeFileSync(cacheFile, JSON.stringify(staleEnvelope));

    const cache = createDiskCache();
    const result = await cache.read(repository as any, config);

    // Before fix: 'no-git' === 'no-git' → stale index is served (test fails)
    // After fix:  currentGitHead returns null → cache miss (test passes)
    expect(result).toBeNull();
  });
});
