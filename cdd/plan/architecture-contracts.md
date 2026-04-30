# Architecture Contracts

## System Boundary

`save-my-tokens` is a local MCP server. It indexes a configured repository root and exposes token-bounded code intelligence tools to MCP clients. It does not modify the target repository.

## Module Layout

```text
src/
  cli.ts
  server.ts
  config/
    loadConfig.ts
    schema.ts
  mcp/
    registerTools.ts
    schemas.ts
    tools/
      askCodebase.ts
      resolveSymbol.ts
      getSymbolContext.ts
      explainSymbolDependencies.ts
      getUsageContext.ts
      getRelevantContext.ts
      getExactSnippet.ts
      getFileSummary.ts
      readFullFileEscapeHatch.ts
  indexer/
    buildIndex.ts
    fileTree.ts
    symbolIndex.ts
    importGraph.ts
    dependencyGraph.ts
    cache.ts
    types.ts
  languages/
    languageAdapter.ts
    typescript/
      adapter.ts
      symbols.ts
      dependencies.ts
  retrieval/
    contextPlanner.ts
    relevance.ts
    recommendations.ts
  local-ai/
    client.ts
    rankDependencies.ts
    summarize.ts
  guardrails/
    tokenBudget.ts
    pathSafety.ts
    secretRedaction.ts
    depth.ts
  utils/
    errors.ts
    logger.ts
    text.ts
```

## Core Data Contracts

### Config

```ts
export interface SaveMyTokensConfig {
  roots: string[];
  defaultMaxTokens: number;
  defaultDependencyDepth: number;
  maxDependencyDepthWithoutOverride: number;
  fullFileReadLimitLines: number;
  includeCodeByDefault: boolean;
  includeSummariesForOmittedDependencies: boolean;
  returnNextRecommendedCalls: boolean;
  watch: boolean;
  excludeDirs: string[];
  excludeFiles: string[];
  localAi: LocalAiConfig;
  logLevel: LogLevel;
}
```

```ts
export interface LocalAiConfig {
  enabled: boolean;
  provider: 'ollama' | 'lmstudio' | 'openai-compatible';
  baseUrl: string;
  model: string;
}
```

```ts
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
```

### Runtime Context

```ts
export interface RuntimeContext {
  config: SaveMyTokensConfig;
  repository: RepositoryContext;
  index: CodebaseIndex;
  localAi: LocalAiClient | null;
  logger: Logger;
}
```

```ts
export interface RepositoryContext {
  roots: AbsolutePath[];
  primaryRoot: AbsolutePath;
  configPath: AbsolutePath | null;
}
```

### Path Types

```ts
export type AbsolutePath = string;
export type RepoRelativePath = string;
```

### Codebase Index

```ts
export interface CodebaseIndex {
  files: IndexedFile[];
  symbols: SymbolRecord[];
  imports: ImportRecord[];
  exports: ExportRecord[];
  dependencies: DependencyRecord[];
  summaries: SummaryRecord[];
  metadata: IndexMetadata;
}
```

```ts
export interface IndexMetadata {
  createdAt: string;
  rootHashes: RootHashRecord[];
  parserVersions: Record<string, string>;
  toolVersion: string;
}
```

```ts
export interface RootHashRecord {
  root: AbsolutePath;
  contentHash: string;
}
```

### Files

```ts
export interface IndexedFile {
  path: RepoRelativePath;
  absolutePath: AbsolutePath;
  language: SupportedLanguage | 'unknown';
  lineCount: number;
  contentHash: string;
  ignored: boolean;
  ignoreReason: string | null;
}
```

```ts
export type SupportedLanguage = 'typescript' | 'tsx' | 'javascript' | 'jsx' | 'json' | 'markdown';
```

### Symbols

```ts
export interface SymbolRecord {
  id: SymbolId;
  name: string;
  qualifiedName: string;
  kind: SymbolKind;
  path: RepoRelativePath;
  range: SourceRange;
  signature: string | null;
  container: string | null;
  exportStatus: ExportStatus;
  language: SupportedLanguage | 'unknown';
  docstring: string | null;
}
```

```ts
export type SymbolId = string;
```

```ts
export type SymbolKind =
  | 'class'
  | 'function'
  | 'method'
  | 'variable'
  | 'type'
  | 'module'
  | 'route'
  | 'unknown';
```

```ts
export type ExportStatus = 'exported' | 'default-exported' | 'local' | 'unknown';
```

```ts
export interface SourceRange {
  startLine: number;
  endLine: number;
  startColumn: number | null;
  endColumn: number | null;
}
```

### Imports and Exports

```ts
export interface ImportRecord {
  path: RepoRelativePath;
  statement: string;
  line: number;
  importedName: string | null;
  localName: string | null;
  source: string;
  resolvedPath: RepoRelativePath | null;
}
```

```ts
export interface ExportRecord {
  path: RepoRelativePath;
  name: string;
  kind: SymbolKind;
  line: number;
  symbolId: SymbolId | null;
}
```

### Dependencies

```ts
export interface DependencyRecord {
  fromSymbolId: SymbolId;
  toSymbolId: SymbolId | null;
  reference: string;
  relationship: DependencyRelationship;
  location: SourceLocation;
  importance: DependencyImportance;
  resolution: DependencyResolution;
}
```

```ts
export type DependencyRelationship =
  | 'calls'
  | 'reads'
  | 'writes'
  | 'imports'
  | 'instantiates'
  | 'inherits'
  | 'decorates'
  | 'unknown';
```

```ts
export type DependencyImportance = 'high' | 'medium' | 'low';
```

```ts
export type DependencyResolution = 'exact' | 'inferred' | 'unresolved';
```

```ts
export interface SourceLocation {
  path: RepoRelativePath;
  line: number;
  column: number | null;
}
```

### Summaries

```ts
export interface SummaryRecord {
  targetType: 'file' | 'symbol' | 'dependency';
  targetId: string;
  summary: string;
  generatedBy: 'static' | 'local-ai';
  confidence: Confidence;
  contentHash: string;
  createdAt: string;
}
```

```ts
export type Confidence = 'high' | 'medium' | 'low';
```

## Service Interfaces

### Config loading

```ts
export function loadConfig(cliOptions: CliOptions, env: NodeJS.ProcessEnv): Promise<SaveMyTokensConfig>;
```

```ts
export interface CliOptions {
  root?: string;
  config?: string;
  maxTokens?: number;
  dependencyDepth?: number;
  localAiProvider?: string;
  localAiBaseUrl?: string;
  localAiModel?: string;
  disableLocalAi?: boolean;
  logLevel?: LogLevel;
  watch?: boolean;
  stdio?: boolean;
}
```

### Server lifecycle

```ts
export function createRuntimeContext(config: SaveMyTokensConfig): Promise<RuntimeContext>;
```

```ts
export function startMcpServer(context: RuntimeContext): Promise<void>;
```

```ts
export function registerTools(context: RuntimeContext): void;
```

### Indexing

```ts
export function buildIndex(repository: RepositoryContext, config: SaveMyTokensConfig): Promise<CodebaseIndex>;
```

```ts
export interface LanguageAdapter {
  language: SupportedLanguage;
  canParse(file: IndexedFile): boolean;
  extractSymbols(file: IndexedFile, source: string): Promise<SymbolRecord[]>;
  extractImports(file: IndexedFile, source: string): Promise<ImportRecord[]>;
  extractExports(file: IndexedFile, source: string): Promise<ExportRecord[]>;
  extractDependencies(file: IndexedFile, source: string, symbols: SymbolRecord[]): Promise<DependencyRecord[]>;
}
```

### Guardrails

```ts
export function assertSafeRepoPath(path: string, repository: RepositoryContext, config: SaveMyTokensConfig): RepoRelativePath;
```

```ts
export function estimateTokens(text: string): number;
```

```ts
export function applyTokenBudget<T extends BudgetedResponse>(response: T, budget: TokenBudgetRequest): T;
```

```ts
export interface TokenBudgetRequest {
  requestedMaxTokens: number;
  minimumUsefulTokens: number;
}
```

```ts
export interface TokenBudgetReport {
  requestedMaxTokens: number;
  estimatedReturnedTokens: number;
  truncated: boolean;
}
```

## Integration Call Chain

```text
CLI command -> loadConfig -> createRuntimeContext -> buildIndex -> startMcpServer -> registerTools -> tool handler -> guardrails -> index/retrieval/local-ai services -> response schema validation -> MCP result
```

## Integration Friction and Resolutions

| Friction | Resolution in plan |
|---|---|
| No existing source code exists | Scaffold project from specification and this CDD plan |
| MCP SDK API may evolve | Isolate SDK usage in `server.ts` and `mcp/registerTools.ts`; implementation task must verify current SDK API before coding |
| TypeScript compiler API can be complex | First production slice requires useful static extraction, not full compiler-perfect type resolution |
| Multi-language support is desired | Define `LanguageAdapter`; ship TypeScript/JavaScript first and fallback summaries for unsupported files |
| Token counts are approximations | Use deterministic estimator and include `estimated_returned_tokens`; do not promise model-exact tokenization |
| Local AI may be unavailable | All exact symbol/source tools must work without local AI |

## Test Strategy

### Unit tests

- Config precedence from defaults, config file, environment, and CLI.
- Path guardrails for outside-root paths and secret-like files.
- Token budget estimation and truncation reports.
- TypeScript adapter symbol, import, export, and dependency extraction on fixtures.
- Error mapping to standard error codes.

### Integration tests

- Start runtime against fixture repository.
- Register all tools.
- Resolve a service method by qualified and unqualified names.
- Retrieve depth `0` symbol context.
- Retrieve depth `1` context with `this.*` dependencies and same-class helpers.
- Reject large full-file reads while returning summary and suggested calls.

### Release checks

- `npm run build`.
- `npm run typecheck`.
- `npm run lint`.
- `npm run test`.
- Local MCP stdio smoke test against fixture repository.
