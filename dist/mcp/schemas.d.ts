import { z } from 'zod';
export declare const confidenceSchema: z.ZodEnum<{
    high: "high";
    medium: "medium";
    low: "low";
}>;
export declare const symbolKindSchema: z.ZodEnum<{
    function: "function";
    unknown: "unknown";
    type: "type";
    class: "class";
    method: "method";
    variable: "variable";
    module: "module";
    route: "route";
}>;
export declare const dependencyImportanceSchema: z.ZodEnum<{
    high: "high";
    medium: "medium";
    low: "low";
}>;
export declare const retrievalModeSchema: z.ZodEnum<{
    debug: "debug";
    overview: "overview";
    edit: "edit";
    architecture: "architecture";
    api: "api";
    security: "security";
    performance: "performance";
}>;
export declare const toolNameSchema: z.ZodEnum<{
    ask_codebase: "ask_codebase";
    resolve_symbol: "resolve_symbol";
    get_symbol_context: "get_symbol_context";
    explain_symbol_dependencies: "explain_symbol_dependencies";
    get_usage_context: "get_usage_context";
    get_relevant_context: "get_relevant_context";
    get_exact_snippet: "get_exact_snippet";
    get_file_summary: "get_file_summary";
    read_full_file_escape_hatch: "read_full_file_escape_hatch";
}>;
export declare const sourceRangeSchema: z.ZodObject<{
    startLine: z.ZodNumber;
    endLine: z.ZodNumber;
    startColumn: z.ZodNullable<z.ZodNumber>;
    endColumn: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
export declare const recommendedCallSchema: z.ZodObject<{
    tool: z.ZodEnum<{
        ask_codebase: "ask_codebase";
        resolve_symbol: "resolve_symbol";
        get_symbol_context: "get_symbol_context";
        explain_symbol_dependencies: "explain_symbol_dependencies";
        get_usage_context: "get_usage_context";
        get_relevant_context: "get_relevant_context";
        get_exact_snippet: "get_exact_snippet";
        get_file_summary: "get_file_summary";
        read_full_file_escape_hatch: "read_full_file_escape_hatch";
    }>;
    args: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    reason: z.ZodString;
}, z.core.$strip>;
export declare const tokenBudgetReportSchema: z.ZodObject<{
    requested_max_tokens: z.ZodNumber;
    estimated_returned_tokens: z.ZodNumber;
    truncated: z.ZodBoolean;
}, z.core.$strip>;
export declare const commonMetadataSchema: z.ZodObject<{
    token_budget: z.ZodObject<{
        requested_max_tokens: z.ZodNumber;
        estimated_returned_tokens: z.ZodNumber;
        truncated: z.ZodBoolean;
    }, z.core.$strip>;
    next_recommended_calls: z.ZodArray<z.ZodObject<{
        tool: z.ZodEnum<{
            ask_codebase: "ask_codebase";
            resolve_symbol: "resolve_symbol";
            get_symbol_context: "get_symbol_context";
            explain_symbol_dependencies: "explain_symbol_dependencies";
            get_usage_context: "get_usage_context";
            get_relevant_context: "get_relevant_context";
            get_exact_snippet: "get_exact_snippet";
            get_file_summary: "get_file_summary";
            read_full_file_escape_hatch: "read_full_file_escape_hatch";
        }>;
        args: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        reason: z.ZodString;
    }, z.core.$strip>>;
    confidence: z.ZodEnum<{
        high: "high";
        medium: "medium";
        low: "low";
    }>;
    confidence_reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const errorCodeSchema: z.ZodEnum<{
    SYMBOL_NOT_FOUND: "SYMBOL_NOT_FOUND";
    AMBIGUOUS_SYMBOL: "AMBIGUOUS_SYMBOL";
    FILE_NOT_FOUND: "FILE_NOT_FOUND";
    PATH_OUTSIDE_ROOT: "PATH_OUTSIDE_ROOT";
    TOKEN_BUDGET_TOO_SMALL: "TOKEN_BUDGET_TOO_SMALL";
    DEPENDENCY_DEPTH_TOO_HIGH: "DEPENDENCY_DEPTH_TOO_HIGH";
    FULL_FILE_READ_REJECTED: "FULL_FILE_READ_REJECTED";
    UNSUPPORTED_LANGUAGE: "UNSUPPORTED_LANGUAGE";
    INDEX_NOT_READY: "INDEX_NOT_READY";
    LOCAL_AI_UNAVAILABLE: "LOCAL_AI_UNAVAILABLE";
    INTERNAL_ERROR: "INTERNAL_ERROR";
}>;
export declare const askCodebaseInputSchema: z.ZodObject<{
    question: z.ZodString;
    scope: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    mode: z.ZodDefault<z.ZodEnum<{
        debug: "debug";
        overview: "overview";
        edit: "edit";
        architecture: "architecture";
        api: "api";
        security: "security";
        performance: "performance";
    }>>;
    max_tokens: z.ZodNumber;
    include_code: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const resolveSymbolInputSchema: z.ZodObject<{
    symbol: z.ZodString;
    file_hint: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    scope: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    kind: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        function: "function";
        unknown: "unknown";
        type: "type";
        class: "class";
        method: "method";
        variable: "variable";
        module: "module";
        route: "route";
    }>>>;
    max_results: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const symbolContextIncludeSchema: z.ZodDefault<z.ZodObject<{
    body: z.ZodOptional<z.ZodBoolean>;
    signature: z.ZodOptional<z.ZodBoolean>;
    docstring: z.ZodOptional<z.ZodBoolean>;
    class_fields: z.ZodOptional<z.ZodBoolean>;
    self_references: z.ZodOptional<z.ZodBoolean>;
    this_references: z.ZodOptional<z.ZodBoolean>;
    called_methods: z.ZodOptional<z.ZodBoolean>;
    same_class_helpers: z.ZodOptional<z.ZodBoolean>;
    imports: z.ZodOptional<z.ZodBoolean>;
    types: z.ZodOptional<z.ZodBoolean>;
    summaries: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>>;
export declare const getSymbolContextInputSchema: z.ZodObject<{
    symbol: z.ZodString;
    file_hint: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dependency_depth: z.ZodDefault<z.ZodNumber>;
    include: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        body: z.ZodOptional<z.ZodBoolean>;
        signature: z.ZodOptional<z.ZodBoolean>;
        docstring: z.ZodOptional<z.ZodBoolean>;
        class_fields: z.ZodOptional<z.ZodBoolean>;
        self_references: z.ZodOptional<z.ZodBoolean>;
        this_references: z.ZodOptional<z.ZodBoolean>;
        called_methods: z.ZodOptional<z.ZodBoolean>;
        same_class_helpers: z.ZodOptional<z.ZodBoolean>;
        imports: z.ZodOptional<z.ZodBoolean>;
        types: z.ZodOptional<z.ZodBoolean>;
        summaries: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    max_tokens: z.ZodNumber;
}, z.core.$strip>;
export declare const explainSymbolDependenciesInputSchema: z.ZodObject<{
    symbol: z.ZodString;
    file_hint: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dependency_depth: z.ZodDefault<z.ZodNumber>;
    max_tokens: z.ZodNumber;
}, z.core.$strip>;
export declare const getUsageContextInputSchema: z.ZodObject<{
    symbol: z.ZodString;
    file_hint: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    within: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    scope: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    include_snippets: z.ZodDefault<z.ZodBoolean>;
    max_results: z.ZodDefault<z.ZodNumber>;
    max_tokens: z.ZodNumber;
}, z.core.$strip>;
export declare const getRelevantContextInputSchema: z.ZodObject<{
    task: z.ZodString;
    scope: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    mode: z.ZodDefault<z.ZodEnum<{
        debug: "debug";
        overview: "overview";
        edit: "edit";
        architecture: "architecture";
        api: "api";
        security: "security";
        performance: "performance";
    }>>;
    include_code: z.ZodDefault<z.ZodBoolean>;
    max_tokens: z.ZodNumber;
}, z.core.$strip>;
export declare const getExactSnippetInputSchema: z.ZodObject<{
    path: z.ZodString;
    start_line: z.ZodNumber;
    end_line: z.ZodNumber;
    max_tokens: z.ZodNumber;
}, z.core.$strip>;
export declare const getFileSummaryInputSchema: z.ZodObject<{
    path: z.ZodString;
    include_symbols: z.ZodOptional<z.ZodBoolean>;
    include_imports: z.ZodOptional<z.ZodBoolean>;
    max_tokens: z.ZodNumber;
}, z.core.$strip>;
export declare const readFullFileEscapeHatchInputSchema: z.ZodObject<{
    path: z.ZodString;
    justification: z.ZodString;
    max_tokens: z.ZodNumber;
}, z.core.$strip>;
export type RecommendedCall = z.infer<typeof recommendedCallSchema>;
export declare const TOOL_NAMES: ("ask_codebase" | "resolve_symbol" | "get_symbol_context" | "explain_symbol_dependencies" | "get_usage_context" | "get_relevant_context" | "get_exact_snippet" | "get_file_summary" | "read_full_file_escape_hatch")[];
