import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join, sep } from 'node:path';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { discoverFiles } from '../../src/indexer/fileTree.js';
import { defaultConfig } from '../../src/config/schema.js';

const TEST_ROOT = join(tmpdir(), 'smt-fileTree-bug3-test');

describe('discoverFiles - absolutePath construction', () => {
  beforeEach(() => {
    mkdirSync(join(TEST_ROOT, 'sub'), { recursive: true });
    writeFileSync(join(TEST_ROOT, 'sub', 'example.ts'), 'export const x = 1;');
  });

  afterEach(() => {
    if (existsSync(TEST_ROOT)) rmSync(TEST_ROOT, { recursive: true, force: true });
  });

  it('uses platform-native separators in absolutePath (no mixed slashes on Windows)', async () => {
    const repository = { roots: [TEST_ROOT], primaryRoot: TEST_ROOT, configPath: null };
    const config = { ...defaultConfig, roots: [TEST_ROOT] };

    const files = await discoverFiles(repository as any, config);

    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      // join() normalises separators per platform; template literal `${root}/${rel}` does not
      const expected = join(TEST_ROOT, file.path.split('/').join(sep));
      expect(file.absolutePath).toBe(expected);
    }
  });
});
