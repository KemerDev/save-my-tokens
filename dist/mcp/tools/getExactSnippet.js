import { readSafeSource } from "../../indexer/fileTree.js";
import { getExactSnippetInputSchema } from "../schemas.js";
import { catchTool, errText, common } from "./common.js";
import { getSourceRange } from "../../retrieval/contextPlanner.js";
export function getExactSnippet(context, raw) {
    return catchTool(async () => {
        const input = getExactSnippetInputSchema.parse(raw);
        if (input.end_line < input.start_line)
            return errText("INTERNAL_ERROR", "Invalid line range");
        const requestedLines = input.end_line - input.start_line + 1;
        const maxLines = context.config.maxExactSnippetLines;
        if (requestedLines > maxLines)
            return errText("FULL_FILE_READ_REJECTED", `Exact snippet range is too large (${requestedLines} lines); narrow to ${maxLines} lines or less`, { requestedLines, maxLines, path: input.path }, [
                {
                    tool: "get_file_summary",
                    args: {
                        path: input.path,
                        include_symbols: true,
                        include_imports: true,
                        max_tokens: 3000,
                    },
                    reason: "Summarize file before requesting a smaller exact snippet",
                },
            ]);
        const source = await readSafeSource(input.path, context.repository, context.config);
        if (input.end_line > source.lineCount)
            return errText("FILE_NOT_FOUND", "Line range exceeds file length", {
                lineCount: source.lineCount,
            });
        const range = {
            startLine: input.start_line,
            endLine: input.end_line,
            startColumn: 1,
            endColumn: null,
        };
        const snippet = getSourceRange(source, range);
        if (snippet.estimatedTokens > input.max_tokens)
            return errText("TOKEN_BUDGET_TOO_SMALL", "Snippet exceeds max_tokens", {
                estimated: snippet.estimatedTokens,
            });
        return { ...common(input.max_tokens, [snippet.code], [], "high"), snippet };
    });
}
//# sourceMappingURL=getExactSnippet.js.map