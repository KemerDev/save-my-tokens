import type { RuntimeContext } from "../../server.js";
import { askCodebaseInputSchema } from "../schemas.js";
import { catchTool, common } from "./common.js";
import { rankFiles, rankSymbols } from "../../retrieval/relevance.js";
import { recommendSymbolContext } from "../../retrieval/recommendations.js";
export function askCodebase(context: RuntimeContext, raw: unknown) {
  return catchTool(async () => {
    const input = askCodebaseInputSchema.parse(raw);
    const symbols = rankSymbols(context, input.question, 8, input.scope);
    const files = rankFiles(context, input.question, 5, input.scope);
    const answer = symbols.length
      ? `Based on deterministic index data, start with ${symbols[0]!.symbol.qualifiedName} in ${symbols[0]!.symbol.path}.`
      : "No precise symbol match found; use get_relevant_context or refine the scope.";
    return {
      ...common(
        input.max_tokens,
        [answer],
        symbols.slice(0, 3).map((s) => recommendSymbolContext(s.symbol)),
        symbols.length ? "medium" : "low",
        "Lexical retrieval over static index; local AI is optional and non-authoritative.",
      ),
      answer,
      relevant_symbols: symbols.map((s) => ({
        symbol: s.symbol.qualifiedName,
        kind: s.symbol.kind,
        path: s.symbol.path,
        range: s.symbol.range,
        reason: "matched question terms",
        confidence: s.score > 0.7 ? "high" : "medium",
      })),
      relevant_files: files.map((f) => ({
        path: f.file.path,
        reason: "matched question terms",
        summary: `${f.file.language} file with ${f.file.lineCount} lines`,
      })),
      omitted_context: [],
    };
  });
}
