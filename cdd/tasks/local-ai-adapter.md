# Task: Optional Local AI Adapter

## Objective

Implement optional local-AI summarization and dependency ranking without making it a source of exact facts.

## Context

Read these plan sections:

- `cdd/plan/guardrails-local-ai-and-release.md` Local AI Contract
- `cdd/plan/product-scope.md` Optional Local AI Configuration

## Files to create or modify

- `src/local-ai/client.ts`
- `src/local-ai/summarize.ts`
- `src/local-ai/rankDependencies.ts`
- `tests/unit/localAiClient.test.ts`
- `tests/unit/localAiDisabled.test.ts`

## Implementation requirements

- Support disabled local AI as the default.
- Support OpenAI-compatible HTTP request shape for Ollama, LM Studio, and similar local services.
- Do not send secret-like file contents to local AI.
- Apply secret redaction before local AI calls.
- Return `LOCAL_AI_UNAVAILABLE` only for tools or modes that explicitly require local AI; otherwise degrade to static summaries.
- Cache summary outputs only through cache contracts added in indexing work.
- Local AI outputs must never create or alter line ranges, paths, or exact source code.

## Tests

- Disabled local AI returns unavailable health without throwing.
- Static fallback summaries are used when local AI is disabled.
- Redaction runs before mocked local AI request.
- Ranking output maps to high, medium, and low importance.

## Acceptance criteria

- `ask_codebase`, `get_relevant_context`, and dependency explanation can optionally use local AI while exact tools remain deterministic.
