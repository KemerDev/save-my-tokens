import { readFile } from 'node:fs/promises';
import fg from 'fast-glob';
import ignore from 'ignore';
import { relative } from 'node:path';
import type { SaveMyTokensConfig } from '../config/schema.js';
import type { IndexedFile, RepositoryContext, SourceFileText, SupportedLanguage } from './types.js';
import { assertExistingFile, assertSafeRepoPath, isExcludedPath, isSecretLikePath } from '../guardrails/pathSafety.js';
import { countLines, sha256 } from '../utils/text.js';
function languageFor(path: string): SupportedLanguage | 'unknown' { if (path.endsWith('.ts')) return 'typescript'; if (path.endsWith('.tsx')) return 'tsx'; if (path.endsWith('.js')) return 'javascript'; if (path.endsWith('.jsx')) return 'jsx'; if (path.endsWith('.json')) return 'json'; if (path.endsWith('.md')) return 'markdown'; if (path.endsWith('.py')) return 'python'; return 'unknown'; }
async function gitIgnore(root: string) { const ig = ignore(); try { ig.add(await readFile(`${root}/.gitignore`, 'utf8')); } catch { return ig; } return ig; }
export async function discoverFiles(repository: RepositoryContext, config: SaveMyTokensConfig): Promise<IndexedFile[]> { const out: IndexedFile[] = []; for (const root of repository.roots) { const ig = await gitIgnore(root); const entries = await fg(['**/*'], { cwd: root, onlyFiles: true, dot: true, followSymbolicLinks: false, ignore: config.excludeDirs.map(d => `**/${d}/**`) }); for (const relRaw of entries.sort()) { const rel = relRaw.split('\\').join('/'); const ignored = isExcludedPath(rel, config) || isSecretLikePath(rel, config) || ig.ignores(rel); if (ignored) continue; const abs = `${root}/${rel}`; let text: string; try { text = await readFile(abs, 'utf8'); } catch { continue; } out.push({ path: rel, absolutePath: abs, language: languageFor(rel), lineCount: countLines(text), contentHash: sha256(text), ignored: false, ignoreReason: null }); } } return out; }
export async function readSafeSource(path: string, repository: RepositoryContext, config: SaveMyTokensConfig): Promise<SourceFileText> { const rel = assertSafeRepoPath(path, repository, config); const abs = assertExistingFile(rel, repository); const text = await readFile(abs, 'utf8'); return { path: rel, text, lineCount: countLines(text), contentHash: sha256(text) }; }
export function repoRelativeFromAbsolute(abs: string, repository: RepositoryContext) { return relative(repository.primaryRoot, abs).split('\\').join('/'); }
