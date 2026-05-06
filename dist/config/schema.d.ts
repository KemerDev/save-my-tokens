import { z } from "zod";
export declare const logLevelSchema: z.ZodEnum<{
    error: "error";
    warn: "warn";
    info: "info";
    debug: "debug";
}>;
export declare const localAiSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    provider: z.ZodDefault<z.ZodEnum<{
        ollama: "ollama";
        lmstudio: "lmstudio";
        "openai-compatible": "openai-compatible";
    }>>;
    baseUrl: z.ZodDefault<z.ZodString>;
    model: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export declare const saveMyTokensConfigSchema: z.ZodObject<{
    roots: z.ZodDefault<z.ZodArray<z.ZodString>>;
    defaultMaxTokens: z.ZodDefault<z.ZodNumber>;
    defaultDependencyDepth: z.ZodDefault<z.ZodNumber>;
    maxDependencyDepthWithoutOverride: z.ZodDefault<z.ZodNumber>;
    fullFileReadLimitLines: z.ZodDefault<z.ZodNumber>;
    maxExactSnippetLines: z.ZodDefault<z.ZodNumber>;
    includeCodeByDefault: z.ZodDefault<z.ZodBoolean>;
    includeSummariesForOmittedDependencies: z.ZodDefault<z.ZodBoolean>;
    returnNextRecommendedCalls: z.ZodDefault<z.ZodBoolean>;
    watch: z.ZodDefault<z.ZodBoolean>;
    excludeDirs: z.ZodDefault<z.ZodArray<z.ZodString>>;
    excludeFiles: z.ZodDefault<z.ZodArray<z.ZodString>>;
    localAi: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        provider: z.ZodDefault<z.ZodEnum<{
            ollama: "ollama";
            lmstudio: "lmstudio";
            "openai-compatible": "openai-compatible";
        }>>;
        baseUrl: z.ZodDefault<z.ZodString>;
        model: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>>;
    logLevel: z.ZodDefault<z.ZodEnum<{
        error: "error";
        warn: "warn";
        info: "info";
        debug: "debug";
    }>>;
}, z.core.$strip>;
export type SaveMyTokensConfig = z.infer<typeof saveMyTokensConfigSchema>;
export type LocalAiConfig = z.infer<typeof localAiSchema>;
export type LogLevel = z.infer<typeof logLevelSchema>;
export declare const defaultConfig: {
    roots: string[];
    defaultMaxTokens: number;
    defaultDependencyDepth: number;
    maxDependencyDepthWithoutOverride: number;
    fullFileReadLimitLines: number;
    maxExactSnippetLines: number;
    includeCodeByDefault: boolean;
    includeSummariesForOmittedDependencies: boolean;
    returnNextRecommendedCalls: boolean;
    watch: boolean;
    excludeDirs: string[];
    excludeFiles: string[];
    localAi: {
        enabled: boolean;
        provider: "ollama" | "lmstudio" | "openai-compatible";
        baseUrl: string;
        model: string;
    };
    logLevel: "error" | "warn" | "info" | "debug";
};
