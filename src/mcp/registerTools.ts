import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { RuntimeContext } from '../server.js';
import { askCodebaseInputSchema, explainSymbolDependenciesInputSchema, getExactSnippetInputSchema, getFileSummaryInputSchema, getRelevantContextInputSchema, getSymbolContextInputSchema, getUsageContextInputSchema, readFullFileEscapeHatchInputSchema, resolveSymbolInputSchema, TOOL_NAMES } from './schemas.js';
import { askCodebase } from './tools/askCodebase.js';
import { resolveSymbol } from './tools/resolveSymbol.js';
import { getSymbolContext } from './tools/getSymbolContext.js';
import { explainSymbolDependencies } from './tools/explainSymbolDependencies.js';
import { getUsageContext } from './tools/getUsageContext.js';
import { getRelevantContext } from './tools/getRelevantContext.js';
import { getExactSnippet } from './tools/getExactSnippet.js';
import { getFileSummary } from './tools/getFileSummary.js';
import { readFullFileEscapeHatch } from './tools/readFullFileEscapeHatch.js';
const descriptions: Record<string, string> = {
  ask_codebase: 'Answer a codebase question from compact indexed summaries and symbols. Prefer this before raw file reads.',
  resolve_symbol: 'Resolve a symbol to one or more locations without returning source bodies.',
  get_symbol_context: 'Return symbol-first context with optional depth-1 direct dependencies under a token budget.',
  explain_symbol_dependencies: 'Explain direct dependencies for a symbol without source code bodies.',
  get_usage_context: 'Find callers/usages of an indexed symbol with optional one-line snippets.',
  get_relevant_context: 'Retrieve task-relevant symbols/files for planning an edit or investigation.',
  get_exact_snippet: 'Return exact bounded source lines for edit-critical ranges.',
  get_file_summary: 'Summarize a file structure without returning the full file.',
  read_full_file_escape_hatch: 'Guarded fallback for justified small full-file reads; prefer symbols/snippets first.'
};
export function registerTools(server: McpServer, context: RuntimeContext): void {
  const specs = [
    ['ask_codebase', askCodebaseInputSchema, askCodebase], ['resolve_symbol', resolveSymbolInputSchema, resolveSymbol], ['get_symbol_context', getSymbolContextInputSchema, getSymbolContext], ['explain_symbol_dependencies', explainSymbolDependenciesInputSchema, explainSymbolDependencies], ['get_usage_context', getUsageContextInputSchema, getUsageContext], ['get_relevant_context', getRelevantContextInputSchema, getRelevantContext], ['get_exact_snippet', getExactSnippetInputSchema, getExactSnippet], ['get_file_summary', getFileSummaryInputSchema, getFileSummary], ['read_full_file_escape_hatch', readFullFileEscapeHatchInputSchema, readFullFileEscapeHatch]
  ] as const;
  for (const [name, schema, handler] of specs) server.registerTool(name, { title: name, description: descriptions[name], inputSchema: schema.shape }, (args: unknown) => handler(context, args) as never);
}
export function registeredToolNames(): string[] { return [...TOOL_NAMES]; }
