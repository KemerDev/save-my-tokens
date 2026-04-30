export type AbsolutePath = string;
export type RepoRelativePath = string;
export type SupportedLanguage = 'typescript' | 'tsx' | 'javascript' | 'jsx' | 'json' | 'markdown';
export type SymbolKind = 'class' | 'function' | 'method' | 'variable' | 'type' | 'module' | 'route' | 'unknown';
export type ExportStatus = 'exported' | 'default-exported' | 'local' | 'unknown';
export type SymbolId = string;
export type DependencyRelationship = 'calls' | 'reads' | 'writes' | 'imports' | 'uses-type' | 'constructs' | 'unknown';
export type DependencyImportance = 'high' | 'medium' | 'low';
export type DependencyResolution = 'resolved' | 'unresolved' | 'external';
export type Confidence = 'high' | 'medium' | 'low';

export interface SourceRange { startLine: number; endLine: number; startColumn: number | null; endColumn: number | null }
export interface SourceLocation { path: RepoRelativePath; line: number; column: number | null }
export interface IndexedFile { path: RepoRelativePath; absolutePath: AbsolutePath; language: SupportedLanguage | 'unknown'; lineCount: number; contentHash: string; ignored: boolean; ignoreReason: string | null }
export interface SymbolRecord { id: SymbolId; name: string; qualifiedName: string; kind: SymbolKind; path: RepoRelativePath; range: SourceRange; signature: string | null; container: string | null; exportStatus: ExportStatus; language: SupportedLanguage | 'unknown'; docstring: string | null }
export interface ImportRecord { path: RepoRelativePath; statement: string; line: number; importedName: string | null; localName: string | null; source: string; resolvedPath: RepoRelativePath | null }
export interface ExportRecord { path: RepoRelativePath; name: string; kind: SymbolKind; line: number; symbolId: SymbolId | null }
export interface DependencyRecord { fromSymbolId: SymbolId; toSymbolId: SymbolId | null; reference: string; relationship: DependencyRelationship; location: SourceLocation; importance: DependencyImportance; resolution: DependencyResolution }
export interface SummaryRecord { path: RepoRelativePath; symbolId: SymbolId | null; summary: string; contentHash: string; confidence: Confidence }
export interface RootHashRecord { root: AbsolutePath; contentHash: string }
export interface IndexMetadata { createdAt: string; rootHashes: RootHashRecord[]; parserVersions: Record<string, string>; toolVersion: string }
export interface CodebaseIndex { files: IndexedFile[]; symbols: SymbolRecord[]; imports: ImportRecord[]; exports: ExportRecord[]; dependencies: DependencyRecord[]; summaries: SummaryRecord[]; metadata: IndexMetadata }
export interface RepositoryContext { roots: AbsolutePath[]; primaryRoot: AbsolutePath; configPath: AbsolutePath | null }
export interface SourceFileText { path: RepoRelativePath; text: string; lineCount: number; contentHash: string }
export interface SymbolQuery { symbol: string; fileHint?: RepoRelativePath | null; scope?: string | null; kind?: SymbolKind | null; maxResults: number }
export interface SymbolMatch extends SymbolRecord { confidence: number }
export interface SourceSnippet { path: RepoRelativePath; range: SourceRange; code: string; estimatedTokens: number }
