# Indexing and Retrieval Contracts

## Indexing Responsibilities

The indexer owns deterministic facts about repository files. It does not call the local AI for exact facts.

### Required indexes

| Index | Purpose |
|---|---|
| File tree | Safe, excluded-aware repository inventory |
| Symbol index | Classes, functions, methods, variables, types, modules, and ranges |
| Import graph | Import statements and resolved local module paths |
| Export graph | Public exports and default exports |
| Dependency graph | Direct symbol references and relationships |
| Summary cache | Static or local-AI summaries keyed by content hash |

## File Discovery Contract

```ts
export function discoverFiles(repository: RepositoryContext, config: SaveMyTokensConfig): Promise<IndexedFile[]>;
```

`discoverFiles` returns files inside configured roots that pass excludes, secret filtering, and size constraints.

```ts
export interface FileDiscoveryOptions {
  roots: AbsolutePath[];
  excludeDirs: string[];
  excludeFiles: string[];
  respectGitignore: boolean;
}
```

## Source Reading Contract

```ts
export function readSafeSource(path: RepoRelativePath, repository: RepositoryContext, config: SaveMyTokensConfig): Promise<SourceFileText>;
```

```ts
export interface SourceFileText {
  path: RepoRelativePath;
  text: string;
  lineCount: number;
  contentHash: string;
}
```

`readSafeSource` is an internal exact-source utility. It is not exposed as a broad MCP tool.

## Symbol Lookup Contract

```ts
export function findSymbols(index: CodebaseIndex, query: SymbolQuery): SymbolMatch[];
```

```ts
export interface SymbolQuery {
  symbol: string;
  fileHint?: RepoRelativePath | null;
  scope?: string | null;
  kind?: SymbolKind | null;
  maxResults: number;
}
```

Symbol matching uses exact qualified name, exact local name, file hint, scope, kind, exports, and lexical similarity to rank matches.

## Snippet Contract

```ts
export function getSourceRange(source: SourceFileText, range: SourceRange): SourceSnippet;
```

```ts
export interface SourceSnippet {
  path: RepoRelativePath;
  range: SourceRange;
  code: string;
  estimatedTokens: number;
}
```

## Context Planning Contract

```ts
export function planSymbolContext(input: SymbolContextPlanInput, context: RuntimeContext): Promise<SymbolContextPlan>;
```

```ts
export interface SymbolContextPlanInput {
  symbol: string;
  fileHint?: RepoRelativePath | null;
  dependencyDepth: number;
  include: Required<SymbolContextIncludeOptions>;
  maxTokens: number;
}
```

```ts
export interface SymbolContextPlan {
  primarySymbol: SymbolRecord;
  primarySnippet: SourceSnippet | null;
  instanceReferences: InstanceReferencePlan[];
  includedDependencies: DependencyPlanItem[];
  externalDependencies: DependencyPlanItem[];
  omittedDependencies: OmittedDependencyPlanItem[];
  imports: ImportRecord[];
  recommendations: RecommendedCall[];
  confidence: Confidence;
  confidenceReason?: string;
}
```

```ts
export interface InstanceReferencePlan {
  reference: string;
  assignedFrom: string | null;
  assignmentLocation: SourceLocation | null;
  assignmentCode: string | null;
  typeGuess: string | null;
  methodsCalled: string[];
  importance: DependencyImportance;
  included: boolean;
  whyNotIncluded?: string;
}
```

```ts
export interface DependencyPlanItem {
  symbol: string;
  symbolId: SymbolId | null;
  reason: string;
  relationship: DependencyRelationship;
  importance: DependencyImportance;
  location: SourceRange | null;
  includeCode: boolean;
  summary: string | null;
}
```

```ts
export interface OmittedDependencyPlanItem {
  symbol: string;
  reason: string;
  suggestedCall?: RecommendedCall;
}
```

## Relevance Retrieval Contract

```ts
export function retrieveRelevantContext(input: RelevantContextQuery, context: RuntimeContext): Promise<RelevantContextPlan>;
```

```ts
export interface RelevantContextQuery {
  task: string;
  scope?: string | null;
  mode: RetrievalMode;
  includeCode: boolean;
  maxTokens: number;
}
```

```ts
export interface RelevantContextPlan {
  answer: string;
  editTargets: EditTarget[];
  relevantSymbols: RelevantSymbol[];
  relevantFiles: RelevantFile[];
  omittedContext: OmittedContext[];
  recommendations: RecommendedCall[];
  confidence: Confidence;
}
```

## Dependency Expansion Policy

| Depth | Included context |
|---:|---|
| `0` | Requested symbol, signature, location, optional body, local imports |
| `1` | Depth `0` plus direct instance references, constructor/class field assignments, same-class helpers, direct local calls, direct external summaries |
| `2` | Depth `1` plus selected summaries for dependencies of direct dependencies |
| `3+` | Structured rejection until a later explicitly guarded feature adds justification support |

## Importance Policy

| Importance | Include preference |
|---|---|
| High | Include exact code when small and relevant; otherwise summarize and recommend follow-up |
| Medium | Include summary or exact code when budget allows |
| Low | Omit or summarize unless the task specifically references it |

High-importance signals include authorization, validation, persistence, mutation, business rules, external API calls, error handling that changes behavior, and transaction boundaries.

Low-importance signals include logging, metrics, tracing, formatting helpers, static constants, and simple pass-through wrappers.

## TypeScript/JavaScript Adapter Contract

```ts
export function createTypeScriptAdapter(): LanguageAdapter;
```

The adapter extracts:

- top-level functions;
- classes;
- methods;
- class fields;
- variables with exported or top-level visibility;
- type aliases and interfaces;
- imports and exports;
- direct calls inside indexed symbol ranges;
- `this.*` references and constructor assignments.

## Unsupported Language Contract

Unsupported language files may still appear in file summaries and exact snippets. They should not claim high-confidence symbol extraction unless a fallback parser identifies simple patterns reliably.

## Cache Contract

```ts
export interface IndexCache {
  read(repository: RepositoryContext, config: SaveMyTokensConfig): Promise<CodebaseIndex | null>;
  write(repository: RepositoryContext, config: SaveMyTokensConfig, index: CodebaseIndex): Promise<void>;
  invalidate(paths: RepoRelativePath[]): Promise<void>;
}
```

Cache keys include repository root, branch or unknown branch marker, file content hash, parser version, tool version, and local model version when summaries depend on local AI.

## Test Strategy

### Unit tests

- File discovery honors excludes and `.gitignore` fixtures.
- Symbol extraction returns line ranges and signatures for TypeScript fixture classes and functions.
- Import/export extraction resolves local relative modules.
- Dependency extraction identifies direct calls and `this.*` references.
- Token-aware context planning preserves primary symbol before dependencies.

### Integration tests

- Build index for fixture repository.
- Resolve duplicate symbol names with file hints.
- Retrieve context for a method that uses constructor-injected dependencies.
- Retrieve task context for an edit request with relevant edit targets.
- Rebuild index after fixture file change and confirm content hash changes.
