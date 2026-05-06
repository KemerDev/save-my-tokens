import type { RuntimeContext } from "../../server.js";
import { getRelevantContextInputSchema } from "../schemas.js";
import { catchTool, common } from "./common.js";
import { rankFiles, rankSymbols } from "../../retrieval/relevance.js";
import { recommendSymbolContext } from "../../retrieval/recommendations.js";
export function getRelevantContext(context: RuntimeContext, raw: unknown) {
  return catchTool(() => {
    const input = getRelevantContextInputSchema.parse(raw);
    const symbols = rankSymbols(context, input.task, 8, input.scope);
    const files = rankFiles(context, input.task, 6, input.scope);
    const answer = symbols.length
      ? `Most relevant symbols: ${symbols.map((s) => s.symbol.qualifiedName).join(", ")}.`
      : `No strong symbol match; inspect relevant files and refine query.`;
    return {
      ...common(
        input.max_tokens,
        [answer],
        symbols.length
          ? symbols.slice(0, 3).map((s) => recommendSymbolContext(s.symbol))
          : files
              .slice(0, 3)
              .map((f) => ({
                tool: "get_file_summary",
                args: {
                  path: f.file.path,
                  include_symbols: true,
                  include_imports: true,
                  max_tokens: 3000,
                },
                reason: "Inspect scoped file summary next",
              })),
        symbols.length ? "medium" : "low",
      ),
      answer,
      edit_targets:
        input.mode === "edit"
          ? symbols.map((s) => ({
              path: s.symbol.path,
              symbol: s.symbol.qualifiedName,
              reason: "lexical task match",
            }))
          : [],
      relevant_symbols: symbols.map((s) => ({
        symbol: s.symbol.qualifiedName,
        kind: s.symbol.kind,
        path: s.symbol.path,
        range: s.symbol.range,
        reason: "lexical match",
        confidence: s.score > 0.7 ? "high" : "medium",
      })),
      relevant_files: files.map((f) => ({
        path: f.file.path,
        reason: "path/language lexical match",
        summary: `${f.file.language} file with ${f.file.lineCount} lines`,
      })),
      omitted_context: [],
    };
  });
}
