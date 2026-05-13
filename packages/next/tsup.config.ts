import { preserveDirectivesPlugin } from 'esbuild-plugin-preserve-directives';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts'],
  format: ['esm', 'cjs'],
  tsconfig: './tsconfig.build.json',
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: false,
  external: [/^react/, /^next/, /^@ship-it-ui\//],
  esbuildPlugins: [
    preserveDirectivesPlugin({
      directives: ['use client', 'use server'],
      include: /\.(js|ts|jsx|tsx)$/,
      exclude: /node_modules/,
    }),
  ],
});
