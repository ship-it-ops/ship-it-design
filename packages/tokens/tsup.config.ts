import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  // Use a build-only tsconfig with `composite: false` — tsup's DTS step
  // chokes on the workspace root's `composite: true`.
  tsconfig: './tsconfig.build.json',
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
});
