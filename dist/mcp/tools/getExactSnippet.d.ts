import type { RuntimeContext } from "../../server.js";
export declare function getExactSnippet(context: RuntimeContext, raw: unknown): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
    structuredContent: {
        error: {
            code: import("../../utils/errors.js").ToolErrorCode;
            message: string;
            details: Record<string, unknown>;
            suggested_next_calls: unknown[];
        };
    };
    isError: boolean;
} | (object & Record<"content", unknown>)>;
