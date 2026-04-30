# MCP Tool Contracts

## Shared Conventions

### Confidence

```ts
export type Confidence = 'high' | 'medium' | 'low';
```

### Common response metadata

```ts
export interface CommonResponseMetadata {
  token_budget: TokenBudgetReport;
  next_recommended_calls: RecommendedCall[];
  confidence: Confidence;
  confidence_reason?: string;
}
```

```ts
export interface RecommendedCall {
  tool: ToolName;
  args: Record<string, unknown>;
  reason: string;
}
```

```ts
export type ToolName =
  | 'ask_codebase'
  | 'resolve_symbol'
  | 'get_symbol_context'
  | 'explain_symbol_dependencies'
  | 'get_usage_context'
  | 'get_relevant_context'
  | 'get_exact_snippet'
  | 'get_file_summary'
  | 'read_full_file_escape_hatch';
```

```ts
export interface TokenBudgetReport {
  requested_max_tokens: number;
  estimated_returned_tokens: number;
  truncated: boolean;
}
```

### Standard error shape

```ts
export interface ToolErrorResponse {
  error: {
    code: ToolErrorCode;
    message: string;
    details: Record<string, unknown>;
    suggested_next_calls: RecommendedCall[];
  };
}
```

```ts
export type ToolErrorCode =
  | 'SYMBOL_NOT_FOUND'
  | 'AMBIGUOUS_SYMBOL'
  | 'FILE_NOT_FOUND'
  | 'PATH_OUTSIDE_ROOT'
  | 'TOKEN_BUDGET_TOO_SMALL'
  | 'DEPENDENCY_DEPTH_TOO_HIGH'
  | 'FULL_FILE_READ_REJECTED'
  | 'UNSUPPORTED_LANGUAGE'
  | 'INDEX_NOT_READY'
  | 'LOCAL_AI_UNAVAILABLE'
  | 'INTERNAL_ERROR';
```

## Tool: `ask_codebase`

### Input

```ts
export interface AskCodebaseInput {
  question: string;
  scope?: string | null;
  mode?: RetrievalMode;
  max_tokens: number;
  include_code?: boolean;
}
```

```ts
export type RetrievalMode = 'overview' | 'debug' | 'edit' | 'architecture' | 'api' | 'security' | 'performance';
```

### Output

```ts
export interface AskCodebaseOutput extends CommonResponseMetadata {
  answer: string;
  relevant_symbols: RelevantSymbol[];
  relevant_files: RelevantFile[];
  omitted_context: OmittedContext[];
}
```

```ts
export interface RelevantSymbol {
  symbol: string;
  kind: SymbolKind;
  path: string;
  range: JsonSourceRange;
  reason: string;
  confidence: Confidence;
}
```

```ts
export interface RelevantFile {
  path: string;
  reason: string;
  summary: string;
}
```

```ts
export interface OmittedContext {
  item: string;
  reason: string;
}
```

### Behavior contract

- Use indexed symbols, file summaries, dependency summaries, and optional local AI to answer broad questions.
- Prefer summaries over exact code unless `include_code` is true.
- Return recommended calls for the most likely next symbol-level context.

## Tool: `resolve_symbol`

### Input

```ts
export interface ResolveSymbolInput {
  symbol: string;
  file_hint?: string | null;
  scope?: string | null;
  kind?: SymbolKind | null;
  max_results?: number;
}
```

### Output

```ts
export interface ResolveSymbolOutput {
  matches: SymbolMatch[];
  next_recommended_calls: RecommendedCall[];
}
```

```ts
export interface SymbolMatch {
  symbol: string;
  kind: SymbolKind;
  path: string;
  range: JsonSourceRange;
  signature: string | null;
  container: string | null;
  confidence: number;
}
```

### Behavior contract

- Return matching symbol locations and signatures without source bodies.
- Preserve ambiguity by returning multiple matches.
- Recommend `get_symbol_context` for the best match when confidence is sufficient.

## Tool: `get_symbol_context`

### Input

```ts
export interface GetSymbolContextInput {
  symbol: string;
  file_hint?: string | null;
  dependency_depth?: number;
  include?: SymbolContextIncludeOptions;
  max_tokens: number;
}
```

```ts
export interface SymbolContextIncludeOptions {
  body?: boolean;
  signature?: boolean;
  docstring?: boolean;
  class_fields?: boolean;
  self_references?: boolean;
  this_references?: boolean;
  called_methods?: boolean;
  same_class_helpers?: boolean;
  imports?: boolean;
  types?: boolean;
  summaries?: boolean;
}
```

### Output

```ts
export interface GetSymbolContextOutput extends CommonResponseMetadata {
  primary_symbol: PrimarySymbolContext;
  self_references: InstanceReferenceContext[];
  this_references: InstanceReferenceContext[];
  included_dependencies: IncludedDependencyContext[];
  external_dependencies: ExternalDependencyContext[];
  imports: ImportContext[];
  omitted_dependencies: OmittedDependencyContext[];
}
```

```ts
export interface PrimarySymbolContext {
  symbol: string;
  kind: SymbolKind;
  signature: string | null;
  location: JsonSourceLocationRange;
  code: string | null;
  summary: string | null;
}
```

```ts
export interface InstanceReferenceContext {
  reference: string;
  assigned_from: string | null;
  assignment_location: JsonSourceLineLocation | null;
  assignment_code: string | null;
  type_guess: string | null;
  methods_called: string[];
  importance: DependencyImportance;
  included: boolean;
  why_not_included?: string;
}
```

```ts
export interface IncludedDependencyContext {
  symbol: string;
  reason: string;
  location: JsonSourceLocationRange | null;
  code: string | null;
  summary: string | null;
}
```

```ts
export interface ExternalDependencyContext {
  symbol: string;
  reason: string;
  location: JsonSourceLocationRange | null;
  included: boolean;
  why_not_included?: string;
  summary?: string;
}
```

```ts
export interface ImportContext {
  statement: string;
  path: string;
  line: number;
  resolved_path: string | null;
}
```

```ts
export interface OmittedDependencyContext {
  symbol: string;
  reason: string;
  suggested_call?: RecommendedCall;
}
```

### Behavior contract

- Depth `0` returns the requested symbol, its signature, location, optional source body, imports needed by the symbol, and recommended follow-ups.
- Depth `1` includes direct instance references, constructor or field assignments, same-class helpers, directly called local symbols, important imports, external dependency summaries, omitted dependencies, and next recommended calls.
- Depth `2` includes selected second-level dependency summaries and only exact code that fits within the budget.
- Depth above configured maximum returns a structured error unless strict budget and justification support is added in a later task.

## Tool: `explain_symbol_dependencies`

### Input

```ts
export interface ExplainSymbolDependenciesInput {
  symbol: string;
  file_hint?: string | null;
  dependency_depth?: number;
  max_tokens: number;
}
```

### Output

```ts
export interface ExplainSymbolDependenciesOutput extends CommonResponseMetadata {
  symbol: string;
  summary: string;
  dependencies: DependencyExplanation[];
}
```

```ts
export interface DependencyExplanation {
  symbol: string;
  kind: SymbolKind;
  importance: DependencyImportance;
  relationship: DependencyRelationship;
  reason: string;
  code_included: false;
  suggested_next_call?: RecommendedCall;
}
```

### Behavior contract

- Explain dependency relationships without exact source code.
- Prefer this tool for call-flow understanding when edits are not yet needed.

## Tool: `get_usage_context`

### Input

```ts
export interface GetUsageContextInput {
  symbol: string;
  within?: string | null;
  scope?: string | null;
  max_results?: number;
  include_snippets?: boolean;
  max_tokens: number;
}
```

### Output

```ts
export interface GetUsageContextOutput {
  symbol: string;
  defined_at: UsageDefinitionLocation | null;
  usages: UsageContext[];
  token_budget: TokenBudgetReport;
  next_recommended_calls: RecommendedCall[];
}
```

```ts
export interface UsageDefinitionLocation {
  path: string;
  line: number;
  enclosing_symbol: string | null;
}
```

```ts
export interface UsageContext {
  path: string;
  line: number;
  enclosing_symbol: string | null;
  usage_kind: 'read' | 'write' | 'call' | 'assignment' | 'import' | 'unknown';
  code: string | null;
}
```

### Behavior contract

- Return bounded usage locations and enclosing symbol metadata.
- Include snippets only when requested and within budget.

## Tool: `get_relevant_context`

### Input

```ts
export interface GetRelevantContextInput {
  task: string;
  scope?: string | null;
  mode?: RetrievalMode;
  include_code?: boolean;
  max_tokens: number;
}
```

### Output

```ts
export interface GetRelevantContextOutput extends CommonResponseMetadata {
  answer: string;
  edit_targets: EditTarget[];
  relevant_symbols: RelevantSymbol[];
  relevant_files: RelevantFile[];
  omitted_context: OmittedContext[];
}
```

```ts
export interface EditTarget {
  symbol: string;
  path: string;
  range: JsonSourceRange;
  reason: string;
  confidence: Confidence;
}
```

### Behavior contract

- Identify likely files and symbols for a task.
- In edit mode, emphasize edit targets and exact follow-up calls.
- Use summaries by default; include code only for small, high-confidence targets.

## Tool: `get_exact_snippet`

### Input

```ts
export interface GetExactSnippetInput {
  path: string;
  start_line: number;
  end_line: number;
  max_tokens?: number;
}
```

### Output

```ts
export interface GetExactSnippetOutput {
  path: string;
  range: JsonSourceRange;
  code: string;
  token_budget: TokenBudgetReport;
}
```

### Behavior contract

- Return exact source for a known safe range.
- Reject outside-root paths, secret-like paths, and ranges that effectively bypass full-file guardrails.

## Tool: `get_file_summary`

### Input

```ts
export interface GetFileSummaryInput {
  path: string;
  include_symbols?: boolean;
  include_imports?: boolean;
  max_tokens: number;
}
```

### Output

```ts
export interface GetFileSummaryOutput {
  path: string;
  summary: string;
  imports: ImportSummary[];
  exports: ExportSummary[];
  symbols: SymbolSummary[];
  next_recommended_calls: RecommendedCall[];
  token_budget: TokenBudgetReport;
  confidence: Confidence;
}
```

```ts
export interface ImportSummary {
  statement: string;
  line: number;
  resolved_path: string | null;
}
```

```ts
export interface ExportSummary {
  name: string;
  kind: SymbolKind;
  line: number;
}
```

```ts
export interface SymbolSummary {
  symbol: string;
  kind: SymbolKind;
  range: JsonSourceRange;
  signature: string | null;
}
```

### Behavior contract

- Provide file purpose, imports, exports, symbols, and next calls without full source.

## Tool: `read_full_file_escape_hatch`

### Input

```ts
export interface ReadFullFileEscapeHatchInput {
  path: string;
  justification: string;
  max_tokens?: number;
}
```

### Output

```ts
export type ReadFullFileEscapeHatchOutput = FullFileAllowedOutput | FullFileRejectedOutput;
```

```ts
export interface FullFileAllowedOutput {
  path: string;
  code: string;
  warning: string;
  token_budget: TokenBudgetReport;
}
```

```ts
export interface FullFileRejectedOutput {
  rejected: true;
  reason: string;
  summary: string;
  available_symbols: SymbolSummary[];
  suggested_next_calls: RecommendedCall[];
}
```

### Behavior contract

- Allow only small files or cases that fit configured line and token limits.
- Reject unsafe paths and large files with alternatives.

## Shared JSON Location Types

```ts
export interface JsonSourceRange {
  start_line: number;
  end_line: number;
}
```

```ts
export interface JsonSourceLocationRange {
  path: string;
  start_line: number;
  end_line: number;
}
```

```ts
export interface JsonSourceLineLocation {
  path: string;
  line: number;
}
```

## Tool Test Strategy

### Unit tests

- Zod schema accepts valid examples and rejects invalid payloads.
- Error responses match standard error shape.
- Default values are applied consistently for optional inputs.
- Recommended-call payloads target valid tool names.

### Integration tests

- MCP tool registration exposes all nine tools.
- Each tool returns expected output shape against fixtures.
- Guarded calls return structured errors or rejected escape-hatch responses.
- Token budget metadata is present on every context-returning tool.
