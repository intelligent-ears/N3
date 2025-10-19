import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/index.min.js',
      format: 'iife',
      name: 'N3BlockscoutWidget',
      plugins: [terser()],
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'util': 'util',
        'stream': 'stream',
        'path': 'path',
        'http': 'http',
        'https': 'https',
        'url': 'url',
        'assert': 'assert',
        'zlib': 'zlib',
        'events': 'events'
      },
      sourcemap: true
    }
  ],
  external: ['react', 'react-dom'],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist'
    })
  ]
};