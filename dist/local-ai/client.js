export function createDisabledLocalAiClient(config) { return { async summarize() { return { summary: 'Local AI disabled; deterministic static summary used.', confidence: 'low', model: config.model }; }, async rankDependencies(input) { return { model: config.model, rankings: input.dependencies.map(d => ({ symbol: d.symbol, importance: d.staticSignals.some(s => /auth|persist|mutation|external/i.test(s)) ? 'high' : 'medium', reason: 'Static ranking because local AI is disabled.' })) }; }, async health() { return { available: false, provider: config.provider, model: config.model, reason: 'disabled' }; } }; }
export function createLocalAiClient(config) { if (!config.enabled)
    return createDisabledLocalAiClient(config); return { async summarize(input) { const res = await fetch(`${config.baseUrl.replace(/\/$/, '')}/chat/completions`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ model: config.model, messages: [{ role: 'user', content: `Summarize this ${input.targetType} in <= ${input.maxTokens} tokens. Do not invent paths or line numbers.\n\n${input.text}` }], temperature: 0 }) }); if (!res.ok)
        return { summary: 'Local AI unavailable; static fallback required.', confidence: 'low', model: config.model }; const json = await res.json(); return { summary: String(json.choices?.[0]?.message?.content ?? '').trim() || 'No local summary returned.', confidence: 'medium', model: config.model }; }, async rankDependencies(input) { return createDisabledLocalAiClient(config).rankDependencies(input); }, async health() { try {
        const r = await fetch(config.baseUrl);
        return { available: r.ok, provider: config.provider, model: config.model, reason: r.ok ? undefined : `HTTP ${r.status}` };
    }
    catch (e) {
        return { available: false, provider: config.provider, model: config.model, reason: e instanceof Error ? e.message : String(e) };
    } } }; }
//# sourceMappingURL=client.js.map