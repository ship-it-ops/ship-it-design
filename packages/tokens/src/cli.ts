#!/usr/bin/env node
/**
 * `shipit` CLI entry. Currently ships one command: `build-tokens`.
 *
 * Usage:
 *   shipit build-tokens [--watch] [--cwd <dir>]
 */

import { existsSync, mkdirSync, watch, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { argv, exit } from 'node:process';

import { createJiti } from 'jiti';

import type { ShipItConfig } from './config.js';
import { emitSparseOverrideCss } from './emit-sparse.js';

const CONFIG_BASENAMES = ['ship-it.config.ts', 'ship-it.config.mjs', 'ship-it.config.js'];

const findConfig = (cwd: string): string | null => {
  const found = CONFIG_BASENAMES.map((name) => join(cwd, name)).filter(existsSync);
  if (found.length === 0) return null;
  if (found.length > 1) {
    throw new Error(
      `Multiple ship-it config files found in ${cwd}: ${found.map((f) => f.replace(cwd + '/', '')).join(', ')}. Keep only one.`,
    );
  }
  return found[0]!;
};

const loadConfig = async (configPath: string): Promise<ShipItConfig> => {
  const jiti = createJiti(configPath, { interopDefault: true });
  const mod = (await jiti.import(configPath)) as ShipItConfig | { default: ShipItConfig };
  // Accept both `export default defineConfig(...)` and direct exports.
  return 'default' in mod ? (mod.default as ShipItConfig) : (mod as ShipItConfig);
};

export type RunOptions = { cwd?: string };
export type RunResult = { code: 0 | 1; wrote: string | null; error?: string };

export const runBuildTokens = async ({
  cwd = process.cwd(),
}: RunOptions = {}): Promise<RunResult> => {
  try {
    const configPath = findConfig(cwd);
    if (!configPath) return { code: 0, wrote: null };

    const config = await loadConfig(configPath);
    const css = emitSparseOverrideCss(config, { sourceConfig: configPath.replace(cwd + '/', '') });
    if (css === '') return { code: 0, wrote: null };

    const outRel = config.output ?? '.ship-it/tokens.css';
    const outAbs = isAbsolute(outRel) ? outRel : resolve(cwd, outRel);
    mkdirSync(dirname(outAbs), { recursive: true });
    writeFileSync(outAbs, css, 'utf8');
    return { code: 0, wrote: outAbs };
  } catch (err) {
    return { code: 1, wrote: null, error: err instanceof Error ? err.message : String(err) };
  }
};

const main = async (): Promise<void> => {
  const args = argv.slice(2);
  if (args[0] !== 'build-tokens') {
    console.error('Usage: shipit build-tokens [--watch] [--cwd <dir>]');
    exit(1);
  }
  const cwdFlag = args.indexOf('--cwd');
  const cwd = cwdFlag !== -1 ? resolve(args[cwdFlag + 1]!) : process.cwd();
  const watchMode = args.includes('--watch');

  const runOnce = async (): Promise<void> => {
    const result = await runBuildTokens({ cwd });
    if (result.error) console.error(`✗ ${result.error}`);
    else if (result.wrote) console.log(`✓ wrote ${result.wrote}`);
    else console.log('· no ship-it.config found — nothing to do');
    if (!watchMode) exit(result.code);
  };

  await runOnce();

  if (watchMode) {
    console.log(`… watching ${cwd} for ship-it.config changes`);
    const watcher = watch(cwd, { persistent: true }, (_event, filename) => {
      if (filename?.startsWith('ship-it.config.')) {
        console.log(`↺ ${filename} changed — rebuilding`);
        void runOnce();
      }
    });
    process.on('SIGINT', () => {
      watcher.close();
      exit(0);
    });
  }
};

// Only run main() when invoked as a binary, not when imported by tests.
if (import.meta.url === `file://${process.argv[1]}`) {
  void main();
}
