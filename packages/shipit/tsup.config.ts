import { preserveDirectivesPlugin } from 'esbuild-plugin-preserve-directives';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  tsconfig: './tsconfig.build.json',
  dts: true,
  sourcemap: true,
  clean: true,
  // Disabled: tsup's `treeshake: true` re-runs the bundle through Rollup,
  // which strips top-level `'use client'` directives that the
  // esbuild-plugin-preserve-directives plugin re-injected. esbuild itself
  // already tree-shakes during the initial bundle.
  treeshake: false,
  external: ['react', 'react-dom', '@ship-it-ui/ui', '@ship-it-ui/icons'],
  esbuildPlugins: [
    preserveDirectivesPlugin({
      directives: ['use client', 'use server'],
      include: /\.(js|ts|jsx|tsx)$/,
      exclude: /node_modules/,
    }),
  ],
});
