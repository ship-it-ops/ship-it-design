import { preserveDirectivesPlugin } from 'esbuild-plugin-preserve-directives';
import { defineConfig } from 'tsup';

export default defineConfig([
  // TS/JS bundle.
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    tsconfig: './tsconfig.build.json',
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: false,
    external: [/^react/, /^@xyflow/, /^@ship-it-ui\//],
    esbuildPlugins: [
      preserveDirectivesPlugin({
        directives: ['use client', 'use server'],
        include: /\.(js|ts|jsx|tsx)$/,
        exclude: /node_modules/,
      }),
    ],
  },
  // Standalone CSS entry — the canvas component no longer imports its
  // stylesheet, so consumers must import `@ship-it-ui/graph-editor/styles.css`
  // explicitly. Building it as its own entry keeps `dist/styles.css`
  // generated (inlining `@xyflow/react/dist/style.css` + the Ship-It
  // overrides) without producing an empty JS shim.
  {
    entry: { styles: 'src/styles.css' },
    outDir: 'dist',
    clean: false,
    sourcemap: true,
  },
]);
