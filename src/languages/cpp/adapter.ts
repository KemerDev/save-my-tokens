import type { LanguageAdapter, ParsedFileFacts } from '../languageAdapter.js';
import type { ExportRecord, ImportRecord, SourceFileText, SupportedLanguage, SymbolKind, SymbolRecord } from '../../indexer/types.js';

const INCLUDE_RE = /^\s*#\s*include\s+[<"]([^>"]+)[>"]/;
const TYPE_RE = /^\s*(class|struct|enum(?:\s+class)?)\s+([A-Za-z_]\w*)/;
const FUNCTION_RE = /^\s*(?:[A-Za-z_~][\w:<>~*&\s]+\s+)([A-Za-z_~]\w*)\s*\([^;{}]*\)\s*(?:const\s*)?(?:noexcept\s*)?(?:;|\{)/;
const CONTROL_WORDS = new Set(['if', 'for', 'while', 'switch', 'catch', 'return', 'sizeof']);

function languageFor(path: string): SupportedLanguage {
  return path.endsWith('.cpp') || path.endsWith('.cxx') || path.endsWith('.hpp') ? 'cpp' : 'c';
}

function range(line: number) {
  return { startLine: line, endLine: line, startColumn: null, endColumn: null };
}

function symbolRecord(source: SourceFileText, language: SupportedLanguage, name: string, kind: SymbolKind, line: number, signature: string): SymbolRecord {
  return { id: `${source.path}#${name}@${line}`, name, qualifiedName: name, kind, path: source.path, range: range(line), signature, container: null, exportStatus: 'local', language, docstring: null };
}

function exportRecord(source: SourceFileText, name: string, kind: SymbolKind, line: number): ExportRecord {
  return { path: source.path, name, kind, line, symbolId: `${source.path}#${name}@${line}` };
}

export function createCppAdapter(): LanguageAdapter {
  return {
    supports: path => /\.(?:c|cpp|cxx|h|hpp)$/.test(path),
    parse(source: SourceFileText): ParsedFileFacts {
      const language = languageFor(source.path);
      const symbols: SymbolRecord[] = [];
      const imports: ImportRecord[] = [];
      const exports: ExportRecord[] = [];
      const lines = source.text.split(/\r?\n/);

      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i]!;
        const lineNumber = i + 1;
        const stripped = line.trim();
        if (!stripped || stripped.startsWith('//')) continue;

        const includeMatch = stripped.match(INCLUDE_RE);
        if (includeMatch) {
          const included = includeMatch[1]!;
          imports.push({ path: source.path, statement: stripped, line: lineNumber, importedName: null, localName: null, source: included, resolvedPath: null });
          continue;
        }

        const typeMatch = stripped.match(TYPE_RE);
        if (typeMatch) {
          const kind: SymbolKind = typeMatch[1]!.startsWith('class') ? 'class' : 'type';
          const name = typeMatch[2]!;
          symbols.push(symbolRecord(source, language, name, kind, lineNumber, stripped));
          exports.push(exportRecord(source, name, kind, lineNumber));
          continue;
        }

        const functionMatch = stripped.match(FUNCTION_RE);
        if (functionMatch) {
          const name = functionMatch[1]!;
          if (CONTROL_WORDS.has(name)) continue;
          symbols.push(symbolRecord(source, language, name, 'function', lineNumber, stripped));
          exports.push(exportRecord(source, name, 'function', lineNumber));
        }
      }

      return { symbols, imports, exports, dependencies: [] };
    }
  };
}
