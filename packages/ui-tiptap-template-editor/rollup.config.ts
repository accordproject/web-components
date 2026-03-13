import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import filesize from 'rollup-plugin-filesize';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: 'json' };

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs' as const,
        sourcemap: true,
        exports: 'named' as const,
      },
      {
        file: pkg.module,
        format: 'es' as const,
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({ browser: true }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.build.json',
        declaration: false,
      }),
      postcss({ extract: false }),
      filesize(),
    ],
    external: ['react', 'react-dom'],
  },
  {
    input: 'src/index.ts',
    output: [{ file: pkg.types, format: 'es' as const }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];

export default config;
