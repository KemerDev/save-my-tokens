import { z } from "zod";
export const logLevelSchema = z.enum(["error", "warn", "info", "debug"]);
export const localAiSchema = z.object({
    enabled: z.boolean().default(false),
    provider: z
        .enum(["ollama", "lmstudio", "openai-compatible"])
        .default("ollama"),
    baseUrl: z.string().url().default("http://localhost:11434/v1"),
    model: z.string().default("llama3.1"),
});
export const saveMyTokensConfigSchema = z.object({
    roots: z.array(z.string()).default([]),
    defaultMaxTokens: z.number().int().positive().default(4000),
    defaultDependencyDepth: z.number().int().min(0).max(2).default(1),
    maxDependencyDepthWithoutOverride: z.number().int().min(0).max(2).default(2),
    fullFileReadLimitLines: z.number().int().positive().default(300),
    maxExactSnippetLines: z.number().int().positive().default(80),
    includeCodeByDefault: z.boolean().default(false),
    includeSummariesForOmittedDependencies: z.boolean().default(true),
    returnNextRecommendedCalls: z.boolean().default(true),
    watch: z.boolean().default(false),
    excludeDirs: z
        .array(z.string())
        .default([
        "node_modules",
        "dist",
        "build",
        ".next",
        "coverage",
        ".git",
        "vendor",
    ]),
    excludeFiles: z
        .array(z.string())
        .default([".env", ".env.*", "*.pem", "*.key", "*.crt"]),
    localAi: localAiSchema.default(() => localAiSchema.parse({})),
    logLevel: logLevelSchema.default("warn"),
});
export const defaultConfig = saveMyTokensConfigSchema.parse({});
//# sourceMappingURL=schema.js.map