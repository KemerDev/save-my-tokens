import { describe, expect, it } from 'vitest';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildIndex } from '../../src/indexer/buildIndex.js';
import { defaultConfig } from '../../src/config/schema.js';
const root = `${process.cwd()}/tests/fixtures/basic`;
describe('buildIndex', () => { it('extracts fixture symbols and dependencies', async () => { const config = { ...defaultConfig, roots: [root] }; const index = await buildIndex({ roots: [root], primaryRoot: root, configPath: null }, config); expect(index.symbols.some(s => s.qualifiedName.includes('LoginService.login'))).toBe(true); expect(index.dependencies.some(d => d.reference.includes('this.repo'))).toBe(true); });

  it('indexes C and C++ source and header files', async () => {
    const nativeRoot = join(tmpdir(), `smt-native-index-${process.pid}`);
    rmSync(nativeRoot, { recursive: true, force: true });
    mkdirSync(nativeRoot, { recursive: true });
    try {
      writeFileSync(join(nativeRoot, 'native.c'), 'int c_helper(void) { return 1; }\n');
      writeFileSync(join(nativeRoot, 'bridge.cxx'), 'int cxx_bridge() { return 2; }\n');
      writeFileSync(join(nativeRoot, 'engine.cpp'), 'int cpp_engine() { return 3; }\n');
      writeFileSync(join(nativeRoot, 'native.h'), 'int c_header_value(void);\n');
      writeFileSync(join(nativeRoot, 'engine.hpp'), 'class NativeEngine { public: void start(); };\n');

      const config = { ...defaultConfig, roots: [nativeRoot] };
      const index = await buildIndex({ roots: [nativeRoot], primaryRoot: nativeRoot, configPath: null }, config);
      const languagesByPath = Object.fromEntries(index.files.map(f => [f.path, f.language]));
      expect(languagesByPath).toMatchObject({
        'native.c': 'c',
        'bridge.cxx': 'cpp',
        'engine.cpp': 'cpp',
        'native.h': 'c',
        'engine.hpp': 'cpp'
      });
      expect(index.symbols.map(s => `${s.path}:${s.qualifiedName}`)).toEqual(expect.arrayContaining([
        'native.c:c_helper',
        'bridge.cxx:cxx_bridge',
        'engine.cpp:cpp_engine',
        'native.h:c_header_value',
        'engine.hpp:NativeEngine'
      ]));
    } finally {
      rmSync(nativeRoot, { recursive: true, force: true });
    }
  });
});
