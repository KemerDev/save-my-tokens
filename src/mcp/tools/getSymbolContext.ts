import type { RuntimeContext } from "../../server.js";
import { getSymbolContextInputSchema } from "../schemas.js";
import { catchTool, common, fitList, resolveOne } from "./common.js";
import { validateDependencyDepth } from "../../guardrails/depth.js";
import { snippetForRange } from "../../retrieval/contextPlanner.js";
import {
  recommendSnippet,
  recommendSymbolContext,
} from "../../retrieval/recommendations.js";
import { toolError } from "../../utils/errors.js";
import type { DependencyRecord } from "../../indexer/types.js";
function toRef(d: DependencyRecord, depth: number) {
  return {
    reference: d.reference,
    assigned_from: null,
    assignment_location: d.location,
    assignment_code: null,
    type_guess: null,
    methods_called: [] as string[],
    importance: d.importance,
    included: depth > 0,
  };
}
export function getSymbolContext(context: RuntimeContext, raw: unknown) {
  return catchTool(async () => {
    const input = getSymbolContextInputSchema.parse(raw);
    const depth = validateDependencyDepth(
      input.dependency_depth,
      context.config,
    );
    if (!depth.allowed)
      return toolError("DEPENDENCY_DEPTH_TOO_HIGH", depth.message!, {
        dependency_depth: input.dependency_depth,
      });
    const resolved = resolveOne(context, input.symbol, input.file_hint);
    if ("error" in resolved) return resolved.error;
    const include = input.include ?? {};
    const body = include.body ?? context.config.includeCodeByDefault;
    const symbolLines = resolved.range.endLine - resolved.range.startLine + 1;
    const canIncludeBody =
      body && symbolLines <= context.config.maxExactSnippetLines;
    const snippet = canIncludeBody
      ? await snippetForRange(context, resolved.path, resolved.range)
      : null;
    const deps = context.index.dependencies.filter(
      (d) => d.fromSymbolId === resolved.id,
    );
    const imports = context.index.imports.filter(
      (i) => i.path === resolved.path,
    );
    const included =
      input.dependency_depth > 0
        ? deps
            .slice(0, 12)
            .map((d) => ({
              symbol: d.reference,
              reason: `${d.relationship} dependency`,
              location: d.location,
              code: null,
              summary: `${d.relationship} ${d.reference}`,
              importance: d.importance,
            }))
        : [];
    const bodyOmittedReason =
      body && !canIncludeBody
        ? `Body omitted because symbol spans ${symbolLines} lines; request a narrower exact snippet (max ${context.config.maxExactSnippetLines} lines).`
        : null;
    const parts = [
      resolved.signature ?? resolved.qualifiedName,
      snippet?.code ?? "",
      bodyOmittedReason ?? "",
      ...included.map((d) => d.summary),
    ];
    return {
      ...common(
        input.max_tokens,
        parts,
        [
          recommendSnippet(
            resolved.path,
            resolved.range.startLine,
            resolved.range.endLine,
            bodyOmittedReason ?? "Retrieve exact edit range",
            context.config.maxExactSnippetLines,
          ),
        ],
        "medium",
      ),
      primary_symbol: {
        symbol: resolved.qualifiedName,
        kind: resolved.kind,
        signature: resolved.signature,
        location: { path: resolved.path, range: resolved.range },
        code: snippet?.code ?? null,
        summary:
          bodyOmittedReason ?? `${resolved.kind} ${resolved.qualifiedName}`,
      },
      ...(() => {
        const selfRefDeps = deps.filter(
          (d) => d.relationship === "calls" && !d.reference.startsWith("this.") && d.resolution !== "external",
        );
        const thisRefDeps = deps.filter((d) => d.reference.startsWith("this."));
        const { accepted: acceptedSelf, omitted: omittedSelf } = fitList(selfRefDeps, input.max_tokens, (d) => d.reference);
        const { accepted: acceptedThis, omitted: omittedThis } = fitList(thisRefDeps, input.max_tokens, (d) => d.reference);
        return {
          self_references: acceptedSelf.map((d) => toRef(d, input.dependency_depth)),
          omitted_self_references_count: omittedSelf.length,
          this_references: acceptedThis.map((d) => toRef(d, input.dependency_depth)),
          omitted_this_references_count: omittedThis.length,
        };
      })(),
      included_dependencies: included,
      external_dependencies: deps
        .filter((d) => d.resolution === "external")
        .map((d) => ({
          symbol: d.reference,
          reason: "external or unresolved dependency",
          location: d.location,
          code: null,
          summary: null,
        })),
      imports,
      omitted_dependencies: input.dependency_depth > 0
        ? deps
            .slice(included.length)
            .map((d) => ({
              symbol: d.reference,
              reason: "omitted due to depth or budget",
              suggestedCall: recommendSymbolContext(resolved),
            }))
        : [],
    };
  });
}
