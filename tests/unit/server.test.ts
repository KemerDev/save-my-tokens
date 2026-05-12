import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/indexer/buildIndex.js', () => ({
  buildIndex: vi.fn().mockResolvedValue({ files: [], symbols: [], symbolIndex: {} }),
}));
vi.mock('../../src/config/loadConfig.js', () => ({
  createRepositoryContext: vi.fn().mockReturnValue({
    roots: ['/fake'], primaryRoot: '/fake', configPath: null,
  }),
}));
vi.mock('../../src/utils/logger.js', () => ({
  createLogger: vi.fn().mockReturnValue({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  }),
}));
vi.mock('../../src/local-ai/client.js', () => ({
  createLocalAiClient: vi.fn().mockReturnValue(null),
}));
vi.mock('../../src/indexer/diskCache.js', () => ({
  makeCacheId: vi.fn().mockReturnValue('test-cache-id'),
  createDiskCache: vi.fn().mockReturnValue({
    read: vi.fn().mockResolvedValue(null),
    write: vi.fn().mockRejectedValue(new Error('ENOSPC: no space left on device')),
    invalidate: vi.fn().mockResolvedValue(undefined),
  }),
}));

import { defaultConfig } from '../../src/config/schema.js';
import { createRuntimeContext } from '../../src/server.js';

describe('createRuntimeContext', () => {
  it('resolves successfully even when cache.write throws a filesystem error', async () => {
    await expect(createRuntimeContext(defaultConfig)).resolves.toBeDefined();
  });
});
