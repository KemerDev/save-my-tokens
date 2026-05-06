import { existsSync, statSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { UserFacingError } from '../utils/errors.js';
function hasGlobMatch(path, pattern) { const re = '^' + pattern.split('*').map(s => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$'; return new RegExp(re).test(path); }
export function isPathInsideRoots(path, repository) { const abs = resolve(path); return repository.roots.some(root => { const rel = relative(root, abs); return rel === '' || (!rel.startsWith('..') && !rel.startsWith(sep)); }); }
export function normalizeRepoPath(inputPath, repository) { if (!inputPath || inputPath.includes('\0'))
    throw new UserFacingError('PATH_OUTSIDE_ROOT', 'Invalid empty path'); const candidate = resolve(repository.primaryRoot, inputPath); if (!isPathInsideRoots(candidate, repository))
    throw new UserFacingError('PATH_OUTSIDE_ROOT', `Path escapes configured root: ${inputPath}`, { path: inputPath }); const rel = relative(repository.primaryRoot, candidate).split(sep).join('/'); if (rel.startsWith('..') || rel === '')
    return rel || '.'; return rel; }
export function absoluteFromRepoPath(path, repository) { const abs = resolve(repository.primaryRoot, path); if (!isPathInsideRoots(abs, repository))
    throw new UserFacingError('PATH_OUTSIDE_ROOT', `Path escapes configured root: ${path}`, { path }); return abs; }
export function isSecretLikePath(path, config) { const base = path.split('/').pop() ?? path; return config.excludeFiles.some(p => hasGlobMatch(base, p) || hasGlobMatch(path, p)); }
export function isExcludedPath(path, config) { const parts = path.split('/'); return parts.some(p => config.excludeDirs.includes(p)) || isSecretLikePath(path, config); }
export function assertSafeRepoPath(path, repository, config) { const rel = normalizeRepoPath(path, repository); if (rel === '.')
    throw new UserFacingError('FILE_NOT_FOUND', 'Expected a file path, got repository root'); if (isExcludedPath(rel, config))
    throw new UserFacingError('PATH_OUTSIDE_ROOT', `Path is excluded or secret-like: ${rel}`, { path: rel }); return rel; }
export function assertExistingFile(path, repository) { const abs = absoluteFromRepoPath(path, repository); if (!existsSync(abs) || !statSync(abs).isFile())
    throw new UserFacingError('FILE_NOT_FOUND', `File not found: ${path}`, { path }); return abs; }
//# sourceMappingURL=pathSafety.js.map