const patterns = [
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, 'private-key', 'private key block'],
    [/(api[_-]?key|token|secret|password|credential)\s*[:=]\s*['"]?[^'"\s]+/gi, 'credential', 'credential-like assignment'],
    [/^[A-Z0-9_]*(TOKEN|SECRET|PASSWORD|KEY)=.+$/gim, 'env', 'environment secret']
];
export function redactSecrets(text) {
    const redactions = [];
    let out = text;
    for (const [re, kind, reason] of patterns)
        out = out.replace(re, (m) => { const line = text.slice(0, text.indexOf(m)).split(/\r?\n/).length; redactions.push({ kind, line, reason }); return `[REDACTED:${kind}]`; });
    return { text: out, redactions };
}
//# sourceMappingURL=secretRedaction.js.map