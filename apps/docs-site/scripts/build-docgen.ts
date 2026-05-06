/**
 * Runs `react-docgen-typescript` over the workspace component packages and
 * writes `.generated/docgen.json`. `<PropsTable component="Button" />` consumes
 * this at render time.
 *
 * Run via `predev` / `prebuild`.
 */
import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import { withCustomConfig } from 'react-docgen-typescript';

const APP_ROOT = process.cwd();
const REPO_ROOT = resolve(APP_ROOT, '../..');
const TSCONFIG = resolve(REPO_ROOT, 'packages/ui/tsconfig.json');
const OUT_DIR = join(APP_ROOT, '.generated');
const OUT_FILE = join(OUT_DIR, 'docgen.json');

const PACKAGES = [resolve(REPO_ROOT, 'packages/ui/src'), resolve(REPO_ROOT, 'packages/shipit/src')];

function listTsx(dir: string, out: string[] = []): string[] {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) {
      listTsx(abs, out);
    } else if (
      name.endsWith('.tsx') &&
      !name.endsWith('.stories.tsx') &&
      !name.endsWith('.test.tsx')
    ) {
      out.push(abs);
    }
  }
  return out;
}

interface PropEntry {
  name: string;
  type: string;
  defaultValue?: string;
  description?: string;
  required?: boolean;
}

function main() {
  const parser = withCustomConfig(TSCONFIG, {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    propFilter: (prop) => {
      if (prop.parent?.fileName?.includes('node_modules')) return false;
      return true;
    },
  });

  const out: Record<string, PropEntry[]> = {};
  for (const pkg of PACKAGES) {
    const files = listTsx(pkg);
    let parsed: ReturnType<typeof parser.parse>;
    try {
      parsed = parser.parse(files);
    } catch (err) {
      console.warn(`[docgen] parse failed for ${pkg}:`, err);
      continue;
    }
    for (const c of parsed) {
      const props: PropEntry[] = Object.values(c.props).map((p) => ({
        name: p.name,
        type: p.type?.name ?? 'unknown',
        defaultValue: p.defaultValue?.value ?? undefined,
        description: p.description || undefined,
        required: p.required,
      }));
      if (props.length > 0) out[c.displayName] = props;
    }
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(out, null, 2), 'utf8');
  console.log(
    `[docgen] wrote ${Object.keys(out).length} components → ${relative(APP_ROOT, OUT_FILE)}`,
  );
}

main();
