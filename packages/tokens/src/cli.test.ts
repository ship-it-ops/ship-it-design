import { execSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { runBuildTokens } from './cli';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('shipit build-tokens', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'shipit-cli-'));
  });

  afterEach(() => {
    execSync(`rm -rf "${dir}"`);
  });

  it('exits cleanly without writing a file when no config exists', async () => {
    const result = await runBuildTokens({ cwd: dir });
    expect(result.code).toBe(0);
    expect(result.wrote).toBe(null);
  });

  it('writes a sparse override file to `.ship-it/tokens.css` when a config is present', async () => {
    writeFileSync(
      join(dir, 'ship-it.config.ts'),
      `import { defineConfig } from '${resolve(__dirname, 'config.ts')}';
       export default defineConfig({ accentH: 280, color: { dark: { panel: '#0d0f14' } } });`,
    );
    const result = await runBuildTokens({ cwd: dir });
    expect(result.code).toBe(0);
    expect(result.wrote).toBe(join(dir, '.ship-it', 'tokens.css'));
    const css = readFileSync(result.wrote!, 'utf8');
    expect(css).toContain('--accent-h: 280;');
    expect(css).toContain('--color-panel: #0d0f14;');
  });

  it('honors the `output` config option', async () => {
    writeFileSync(
      join(dir, 'ship-it.config.ts'),
      `import { defineConfig } from '${resolve(__dirname, 'config.ts')}';
       export default defineConfig({ accentH: 280, output: 'custom/path.css' });`,
    );
    const result = await runBuildTokens({ cwd: dir });
    expect(result.wrote).toBe(join(dir, 'custom', 'path.css'));
    expect(existsSync(result.wrote!)).toBe(true);
  });

  it('exits 1 with a clear message when a color value is invalid', async () => {
    writeFileSync(
      join(dir, 'ship-it.config.ts'),
      `import { defineConfig } from '${resolve(__dirname, 'config.ts')}';
       export default defineConfig({ color: { dark: { panel: 'not-a-color' } } });`,
    );
    const result = await runBuildTokens({ cwd: dir });
    expect(result.code).toBe(1);
    expect(result.error).toMatch(/Invalid CSS color/);
  });
});
