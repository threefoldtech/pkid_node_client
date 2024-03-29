import typescript from 'rollup-plugin-typescript2';
import ttypescript from 'ttypescript';

import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const config = [
  {
    input: 'src/index.ts',
    plugins: [
      typescript({
        typescript: ttypescript,
        useTsconfigDeclarationDir: true,
        emitDeclarationOnly: true,
      }),
      json(),
    ],
    output: {
      file: 'dist/es/index.js',
      format: 'es',
      sourcemap: true,
      exports: 'named',
    },
    external: ['axios', 'os', 'url', 'tweetnacl', 'tweetnacl-util', 'libsodium-wrappers'],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    external: ['axios', 'os', 'url', 'tweetnacl', 'tweetnacl-util', 'libsodium-wrappers'],
    plugins: [
      typescript({
        typescript: ttypescript,
        useTsconfigDeclarationDir: true,
        emitDeclarationOnly: true,
      }),
      json(),
      nodeResolve({
        preferBuiltins: true,
      }),
      commonjs(),
    ],
  },
];
export default config;
