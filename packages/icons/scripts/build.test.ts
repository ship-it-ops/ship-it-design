import { randomUUID } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { buildIcons, emptyIndexSource, toPascal } from './build';

const createWorkspace = () => {
  const root = join(tmpdir(), `ship-it-icons-${randomUUID()}`);
  const svgDir = join(root, 'src', 'svg');
  const outDir = join(root, 'src', 'components');
  const indexFile = join(root, 'src', 'index.ts');
  mkdirSync(svgDir, { recursive: true });
  return { svgDir, outDir, indexFile };
};

describe('build-icons', () => {
  it('derives PascalCase component names from SVG filenames', () => {
    expect(toPascal('arrow-right.svg')).toBe('ArrowRight');
    expect(toPascal('upload_cloud.svg')).toBe('UploadCloud');
    expect(toPascal('close icon.svg')).toBe('CloseIcon');
  });

  it('resets the barrel file when no SVGs exist', async () => {
    const workspace = createWorkspace();

    await expect(buildIcons(workspace)).resolves.toBe(0);

    expect(readFileSync(workspace.indexFile, 'utf8')).toBe(emptyIndexSource);
  });

  it('generates React icon components and sorted barrel exports', async () => {
    const workspace = createWorkspace();
    writeFileSync(
      join(workspace.svgDir, 'z-arrow.svg'),
      '<svg viewBox="0 0 16 16"><path fill="#000" d="M1 8h14" /></svg>',
    );
    writeFileSync(
      join(workspace.svgDir, 'alert-circle.svg'),
      '<svg viewBox="0 0 16 16"><circle fill="#000000" cx="8" cy="8" r="7" /></svg>',
    );

    await expect(buildIcons(workspace)).resolves.toBe(2);

    const alertIcon = readFileSync(join(workspace.outDir, 'AlertCircleIcon.tsx'), 'utf8');
    const zArrowIcon = readFileSync(join(workspace.outDir, 'ZArrowIcon.tsx'), 'utf8');
    const index = readFileSync(workspace.indexFile, 'utf8');

    expect(alertIcon).toContain('const AlertCircleIcon');
    expect(alertIcon).toContain('aria-hidden');
    expect(alertIcon).toContain('currentColor');
    expect(zArrowIcon).toContain('const ZArrowIcon');
    expect(index).toContain("export type { SVGProps } from 'react';");
    expect(index.indexOf('AlertCircleIcon')).toBeLessThan(index.indexOf('ZArrowIcon'));
  });
});
