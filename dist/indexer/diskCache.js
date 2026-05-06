import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
const CACHE_VERSION = 1;
function sha12(s) {
    return createHash('sha256').update(s).digest('hex').slice(0, 12);
}
function gitExec(cmd, cwd, fallback) {
    try {
        return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    }
    catch {
        return fallback;
    }
}
export function makeCacheId(repository) {
    const rootHash = sha12(repository.primaryRoot);
    const branch = gitExec('git rev-parse --abbrev-ref HEAD', repository.primaryRoot, 'no-branch')
        .replace(/[^a-zA-Z0-9_-]/g, '_');
    return `${rootHash}-${branch}`;
}
function currentGitHead(root) {
    return gitExec('git rev-parse HEAD', root, 'no-git');
}
function hashConfig(config) {
    return sha12(JSON.stringify({ roots: config.roots, excludeDirs: config.excludeDirs, excludeFiles: config.excludeFiles }));
}
function cacheDir() {
    return join(homedir(), '.cache', 'save-my-tokens');
}
export function createDiskCache() {
    return {
        async read(repository, config) {
            const id = makeCacheId(repository);
            const file = join(cacheDir(), `${id}.json`);
            if (!existsSync(file))
                return null;
            try {
                const envelope = JSON.parse(readFileSync(file, 'utf8'));
                if (envelope.version !== CACHE_VERSION)
                    return null;
                if (envelope.gitHead !== currentGitHead(repository.primaryRoot))
                    return null;
                if (envelope.configHash !== hashConfig(config))
                    return null;
                return envelope.index;
            }
            catch {
                return null;
            }
        },
        async write(repository, config, index) {
            const id = makeCacheId(repository);
            const dir = cacheDir();
            mkdirSync(dir, { recursive: true });
            const envelope = {
                version: CACHE_VERSION,
                cacheId: id,
                gitHead: currentGitHead(repository.primaryRoot),
                configHash: hashConfig(config),
                index,
            };
            writeFileSync(join(dir, `${id}.json`), JSON.stringify(envelope), 'utf8');
        },
        async invalidate(_paths) {
            // Invalidation is driven by git HEAD changes, not individual paths
        },
    };
}
//# sourceMappingURL=diskCache.js.map