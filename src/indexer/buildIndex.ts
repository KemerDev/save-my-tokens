import ts from 'typescript';
import type { SaveMyTokensConfig } from '../config/schema.js';
import type { CodebaseIndex, RepositoryContext } from './types.js';
import { discoverFiles, readSafeSource } from './fileTree.js';
import { createTypeScriptAdapter } from '../languages/typescript/adapter.js';
import { createPythonAdapter } from '../languages/python/adapter.js';
import { resolveDependencyTargets } from './symbolIndex.js';
export async function buildIndex(repository: RepositoryContext, config: SaveMyTokensConfig): Promise<CodebaseIndex> { const files = await discoverFiles(repository, config); const adapters = [createTypeScriptAdapter(), createPythonAdapter()]; const index: CodebaseIndex = { files, symbols: [], imports: [], exports: [], dependencies: [], summaries: [], metadata: { createdAt: new Date().toISOString(), rootHashes: [], parserVersions: { typescript: ts.version }, toolVersion: '0.1.0' } }; for (const f of files) { const adapter = adapters.find(a => a.supports(f.path)); if (adapter) { const parsed = adapter.parse(await readSafeSource(f.path, repository, config)); index.symbols.push(...parsed.symbols); index.imports.push(...parsed.imports); index.exports.push(...parsed.exports); index.dependencies.push(...parsed.dependencies); } index.summaries.push({ path: f.path, symbolId: null, summary: `${f.language} file with ${f.lineCount} lines at ${f.path}`, contentHash: f.contentHash, confidence: 'medium' }); } return resolveDependencyTargets(index); }
