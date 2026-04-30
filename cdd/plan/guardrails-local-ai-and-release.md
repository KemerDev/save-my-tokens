# Guardrails, Local AI, Documentation, and Release Plan

## Guardrail Contracts

### Path safety

```ts
export function normalizeRepoPath(inputPath: string, repository: RepositoryContext): RepoRelativePath;
```

```ts
export function isPathInsideRoots(path: AbsolutePath, repository: RepositoryContext): boolean;
```

```ts
export function isSecretLikePath(path: RepoRelativePath, config: SaveMyTokensConfig): boolean;
```

```ts
export function isExcludedPath(path: RepoRelativePath, config: SaveMyTokensConfig): boolean;
```

Path safety applies to every tool input that accepts a path or scope.

### Full-file guardrail

```ts
export function evaluateFullFileRequest(input: FullFileGuardrailInput, context: RuntimeContext): Promise<FullFileGuardrailDecision>;
```

```ts
export interface FullFileGuardrailInput {
  path: RepoRelativePath;
  justification: string;
  maxTokens: number;
}
```

```ts
export type FullFileGuardrailDecision = FullFileAllowedDecision | FullFileRejectedDecision;
```

```ts
export interface FullFileAllowedDecision {
  allowed: true;
  reason: string;
}
```

```ts
export interface FullFileRejectedDecision {
  allowed: false;
  reason: string;
  summary: string;
  availableSymbols: SymbolSummary[];
  suggestedNextCalls: RecommendedCall[];
}
```

### Dependency depth guardrail

```ts
export function validateDependencyDepth(depth: number, config: SaveMyTokensConfig): DepthValidationResult;
```

```ts
export interface DepthValidationResult {
  allowed: boolean;
  code?: 'DEPENDENCY_DEPTH_TOO_HIGH';
  message?: string;
}
```

### Secret redaction

```ts
export function redactSecrets(text: string): RedactionResult;
```

```ts
export interface RedactionResult {
  text: string;
  redactions: RedactionRecord[];
}
```

```ts
export interface RedactionRecord {
  kind: 'env' | 'private-key' | 'token' | 'credential' | 'unknown';
  line: number | null;
  reason: string;
}
```

## Token Budget Contract

```ts
export function createTokenBudget(maxTokens: number, defaults: SaveMyTokensConfig): TokenBudget;
```

```ts
export interface TokenBudget {
  requestedMaxTokens: number;
  remainingTokens: number;
  consumedTokens: number;
  truncated: boolean;
}
```

```ts
export function reservePrimaryContext(budget: TokenBudget, text: string): BudgetReservation;
```

```ts
export function tryAddOptionalContext(budget: TokenBudget, text: string, priority: DependencyImportance): BudgetReservation;
```

```ts
export interface BudgetReservation {
  accepted: boolean;
  estimatedTokens: number;
  reason?: string;
}
```

Budget behavior must prioritize primary symbols and required metadata before optional dependencies.

## Local AI Contract

### Client

```ts
export interface LocalAiClient {
  summarize(input: SummarizeInput): Promise<SummarizeOutput>;
  rankDependencies(input: RankDependenciesInput): Promise<RankDependenciesOutput>;
  health(): Promise<LocalAiHealth>;
}
```

```ts
export interface SummarizeInput {
  targetType: 'file' | 'symbol' | 'dependency' | 'question';
  text: string;
  maxTokens: number;
  mode?: RetrievalMode;
}
```

```ts
export interface SummarizeOutput {
  summary: string;
  confidence: Confidence;
  model: string;
}
```

```ts
export interface RankDependenciesInput {
  primarySymbol: string;
  dependencies: DependencyCandidate[];
  taskHint?: string | null;
}
```

```ts
export interface DependencyCandidate {
  symbol: string;
  relationship: DependencyRelationship;
  staticSignals: string[];
  summary?: string | null;
}
```

```ts
export interface RankDependenciesOutput {
  rankings: DependencyRanking[];
  model: string;
}
```

```ts
export interface DependencyRanking {
  symbol: string;
  importance: DependencyImportance;
  reason: string;
}
```

```ts
export interface LocalAiHealth {
  available: boolean;
  provider: string;
  model: string;
  reason?: string;
}
```

### Authority boundary

- Static analysis owns paths, line ranges, signatures, imports, exports, references, and exact code.
- Local AI owns summaries, rankings, and explanations only.
- Any response containing exact code must derive that exact code from local source reads after path guardrails.
- Local AI unavailability degrades summaries and rankings, not symbol resolution or exact snippets.

## Documentation Deliverables

### README

The README must include:

- What the tool does.
- Installation with `npx`, global npm install, and local checkout.
- MCP client configuration examples.
- CLI flags.
- Config file example.
- Environment variables.
- Tool overview and recommended workflow.
- Full-file escape hatch warning.
- Local AI setup and authority boundary.
- Development commands.

### Agent instruction files

Root `AGENTS.md` and `CLAUDE.md` must enforce:

```text
Use save-my-tokens first.
Prefer symbols over files.
Use exact snippets only for edits.
Use full-file reads only as an escape hatch.
```

## Release Gates

### Package gate

- `package.json` has name, version, description, `type: module`, binary, files, engines, scripts, dependencies, and devDependencies.
- `dist/cli.js` is emitted by build.
- Package excludes tests and source-only artifacts unless intentionally published.

### Runtime gate

- Built CLI starts MCP stdio server with `--root`.
- Invalid config fails with a clear error.
- Missing root fails with a clear error.
- The server does not print noisy logs to stdout in MCP stdio mode.

### Tool gate

- All tools validate input and output.
- All errors use the standard error shape.
- Every context-returning tool includes token budget metadata.
- Every context-returning tool includes next recommended calls unless there is no useful follow-up.

### Security gate

- Outside-root paths rejected.
- Secret-like paths rejected by default.
- Dependency/build/generated folders excluded by default.
- Full-file reads of large files rejected with alternatives.
- Local AI requests exclude secret-like files and pass through redaction.

## Test Strategy

### Unit tests

- Guardrail decisions.
- Secret redaction patterns.
- Token budget reservation behavior.
- Local AI disabled and unavailable behavior.
- README examples parse as JSON where applicable.

### Integration tests

- MCP server smoke test over stdio if test harness supports subprocess transport.
- Local AI disabled flow returns deterministic static summaries.
- Escape hatch rejected response includes file summary, available symbols, and suggested calls.

### Manual release smoke

```text
npm install
npm run build
npm run typecheck
npm run lint
npm run test
node dist/cli.js --root tests/fixtures/basic --stdio
```
