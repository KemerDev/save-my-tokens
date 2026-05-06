import { beforeAll, describe, expect, it } from "vitest";
import { defaultConfig } from "../../src/config/schema.js";
import { createRuntimeContext } from "../../src/server.js";
import type { RuntimeContext } from "../../src/server.js";
import { resolveSymbol } from "../../src/mcp/tools/resolveSymbol.js";
import { getExactSnippet } from "../../src/mcp/tools/getExactSnippet.js";
import { readFullFileEscapeHatch } from "../../src/mcp/tools/readFullFileEscapeHatch.js";
import { askCodebase } from "../../src/mcp/tools/askCodebase.js";
import { getFileSummary } from "../../src/mcp/tools/getFileSummary.js";
import { getSymbolContext } from "../../src/mcp/tools/getSymbolContext.js";
import { getUsageContext } from "../../src/mcp/tools/getUsageContext.js";
import { explainSymbolDependencies } from "../../src/mcp/tools/explainSymbolDependencies.js";
import { getRelevantContext } from "../../src/mcp/tools/getRelevantContext.js";
const root = `${process.cwd()}/tests/fixtures/basic`;
let context: RuntimeContext;
beforeAll(async () => {
  context = await createRuntimeContext({
    ...defaultConfig,
    roots: [root],
    fullFileReadLimitLines: 100,
  });
});
describe("tools", () => {
  it("resolves symbol", async () => {
    const out: any = await resolveSymbol(context, {
      symbol: "LoginService",
      max_results: 5,
    });
    expect(out.structuredContent.matches.length).toBeGreaterThan(0);
  });
  it("gets exact snippet", async () => {
    const out: any = await getExactSnippet(context, {
      path: "src/service.ts",
      start_line: 1,
      end_line: 3,
      max_tokens: 100,
    });
    expect(out.structuredContent.snippet.code).toContain("UserRepository");
  });
  it("rejects large full-file escape hatch", async () => {
    const out: any = await readFullFileEscapeHatch(context, {
      path: "src/large.ts",
      justification: "debug generated list",
      max_tokens: 10000,
    });
    expect(out.isError).toBe(true);
  });
  it("ask_codebase returns answer and relevant symbols", async () => {
    const out: any = await askCodebase(context, {
      question: "login service",
      max_tokens: 2000,
    });
    expect(out.structuredContent.answer).toBeTruthy();
    expect(out.structuredContent.relevant_symbols).toBeDefined();
  });
  it("get_file_summary returns imports and symbols", async () => {
    const out: any = await getFileSummary(context, {
      path: "src/service.ts",
      max_tokens: 2000,
    });
    expect(out.structuredContent.imports.length).toBeGreaterThan(0);
    expect(out.structuredContent.symbols.length).toBeGreaterThan(0);
  });
  it("get_symbol_context depth 0 returns primary_symbol", async () => {
    const out: any = await getSymbolContext(context, {
      symbol: "LoginService",
      dependency_depth: 0,
      max_tokens: 2000,
    });
    expect(out.structuredContent.primary_symbol.symbol).toContain(
      "LoginService",
    );
  });
  it("get_symbol_context depth 1 returns this_references", async () => {
    const out: any = await getSymbolContext(context, {
      symbol: "LoginService.login",
      dependency_depth: 1,
      max_tokens: 4000,
    });
    expect(out.structuredContent.this_references.length).toBeGreaterThan(0);
  });
  it("get_usage_context finds usages of UserRepository", async () => {
    const out: any = await getUsageContext(context, {
      symbol: "UserRepository",
      max_tokens: 2000,
    });
    expect(out.structuredContent.usages).toBeDefined();
    expect(Array.isArray(out.structuredContent.usages)).toBe(true);
  });
  it("explain_symbol_dependencies returns dependencies list without code", async () => {
    const out: any = await explainSymbolDependencies(context, {
      symbol: "LoginService.login",
      max_tokens: 2000,
    });
    expect(out.structuredContent.dependencies).toBeDefined();
    expect(out.structuredContent.dependencies.length).toBeGreaterThan(0);
    expect(out.structuredContent.dependencies[0].code).toBeUndefined();
  });
  it("get_relevant_context finds symbols for a task query", async () => {
    const out: any = await getRelevantContext(context, {
      task: "login user authentication",
      max_tokens: 2000,
    });
    expect(out.structuredContent.relevant_symbols.length).toBeGreaterThan(0);
  });
  it("get_relevant_context respects relative file scope", async () => {
    const out: any = await getRelevantContext(context, {
      task: "login user authentication",
      scope: "src/repo.ts",
      max_tokens: 2000,
    });
    expect(out.structuredContent.relevant_symbols.length).toBeGreaterThan(0);
    expect(
      out.structuredContent.relevant_symbols.every(
        (s: any) => s.path === "src/repo.ts",
      ),
    ).toBe(true);
    expect(
      out.structuredContent.next_recommended_calls.every(
        (call: any) => call.args.file_hint === "src/repo.ts",
      ),
    ).toBe(true);
  });
  it("get_relevant_context respects absolute file scope", async () => {
    const out: any = await getRelevantContext(context, {
      task: "login user authentication",
      scope: `${root}/src/repo.ts`,
      max_tokens: 2000,
    });
    expect(
      out.structuredContent.relevant_files.every(
        (f: any) => f.path === "src/repo.ts",
      ),
    ).toBe(true);
    expect(
      out.structuredContent.relevant_symbols.every(
        (s: any) => s.path === "src/repo.ts",
      ),
    ).toBe(true);
  });
  it("rejects exact snippets over the configured line guardrail", async () => {
    const out: any = await getExactSnippet(context, {
      path: "src/large.ts",
      start_line: 1,
      end_line: 81,
      max_tokens: 10000,
    });
    expect(out.isError).toBe(true);
    expect(out.structuredContent.error.code).toBe("FULL_FILE_READ_REJECTED");
  });
  it("omits oversized symbol bodies and recommends a bounded snippet", async () => {
    const out: any = await getSymbolContext(context, {
      symbol: "many",
      file_hint: "src/large.ts",
      dependency_depth: 0,
      include: { body: true },
      max_tokens: 2000,
    });
    expect(out.structuredContent.primary_symbol.code).toBeNull();
    expect(out.structuredContent.primary_symbol.summary).toContain(
      "Body omitted",
    );
    const call = out.structuredContent.next_recommended_calls[0];
    expect(call.tool).toBe("get_exact_snippet");
    expect(call.args.end_line - call.args.start_line + 1).toBeLessThanOrEqual(
      80,
    );
  });
});
