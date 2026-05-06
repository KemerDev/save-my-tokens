import path from "node:path";
import { lexicalScore } from "../utils/text.js";
const MIN_SYMBOL_SCORE = 0.2;
function toPosix(value) {
    return value.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/\/$/, "");
}
function normalizeScope(context, scope) {
    if (!scope?.trim())
        return null;
    let normalized = toPosix(scope.trim());
    if (normalized.startsWith("./"))
        normalized = normalized.slice(2);
    const roots = [context.repository.primaryRoot, ...context.repository.roots]
        .filter(Boolean)
        .map((root) => toPosix(path.resolve(root)));
    for (const root of roots) {
        if (normalized === root)
            return "";
        if (normalized.startsWith(`${root}/`))
            return normalized.slice(root.length + 1);
    }
    normalized = normalized.replace(/^\/+/, "");
    const exactFile = context.index.files.find((file) => normalized === file.path || normalized.endsWith(`/${file.path}`));
    if (exactFile)
        return exactFile.path;
    return normalized;
}
function pathMatchesScope(filePath, normalizedScope) {
    if (normalizedScope === null || normalizedScope === "")
        return true;
    const scope = toPosix(normalizedScope).replace(/^\/+/, "");
    return (filePath === scope ||
        filePath.startsWith(`${scope}/`) ||
        filePath.endsWith(`/${scope}`) ||
        filePath.includes(`/${scope}/`));
}
function scopedSymbols(context, scope) {
    const normalizedScope = normalizeScope(context, scope);
    return context.index.symbols.filter((symbol) => pathMatchesScope(symbol.path, normalizedScope));
}
function scopedFiles(context, scope) {
    const normalizedScope = normalizeScope(context, scope);
    return context.index.files.filter((file) => pathMatchesScope(file.path, normalizedScope));
}
export function rankSymbols(context, query, limit = 10, scope) {
    return scopedSymbols(context, scope)
        .map((symbol) => ({
        symbol,
        score: lexicalScore(query, `${symbol.qualifiedName} ${symbol.path} ${symbol.signature ?? ""}`),
    }))
        .filter((result) => result.score >= MIN_SYMBOL_SCORE)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}
export function rankFiles(context, query, limit = 10, scope) {
    return scopedFiles(context, scope)
        .map((file) => ({
        file,
        score: lexicalScore(query, `${file.path} ${file.language}`),
    }))
        .filter((result) => result.score > 0 || Boolean(scope))
        .sort((a, b) => b.score - a.score || a.file.path.localeCompare(b.file.path))
        .slice(0, limit);
}
//# sourceMappingURL=relevance.js.map