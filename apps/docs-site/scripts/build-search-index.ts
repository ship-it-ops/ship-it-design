/**
 * Builds `public/search-index.json` over the navigation entries plus all
 * heading text scraped from MDX pages. The client-side palette
 * (`components/docs/DocsSearch.tsx`) fetches this on first ⌘K open.
 *
 * Run via `predev` / `prebuild`.
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const APP_ROOT = process.cwd();
const APP_DIR = resolve(APP_ROOT, 'app');
const OUT_FILE = resolve(APP_ROOT, 'public', 'search-index.json');

interface SearchEntry {
  id: string;
  title: string;
  description?: string;
  section: string;
  slug: string;
  hash?: string;
}

function findMdxPages(dir: string, out: { abs: string; slug: string }[] = []) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) {
      findMdxPages(abs, out);
    } else if (name === 'page.mdx') {
      // Convert app/(docs)/foundations/color/page.mdx → foundations/color
      // Strip route groups like `(docs)` and the trailing `/page.mdx`.
      const rel = relative(APP_DIR, abs).replace(/\\/g, '/');
      const slug = rel
        .replace(/\/page\.mdx$/, '')
        .split('/')
        .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')))
        .join('/');
      if (slug) out.push({ abs, slug });
    }
  }
  return out;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function main() {
  const entries: SearchEntry[] = [];
  const pages = findMdxPages(APP_DIR);

  for (const { abs, slug } of pages) {
    const raw = readFileSync(abs, 'utf8');
    const sectionId = slug.split('/')[0] ?? '';
    const section = sectionLabel(sectionId);

    const titleMatch = raw.match(/^#\s+(.+)$/m);
    const title = titleMatch?.[1]?.trim() ?? slug;
    entries.push({
      id: `page:${slug}`,
      title,
      section,
      slug,
    });

    // Each h2 / h3 becomes its own entry.
    const headingRe = /^(#{2,3})\s+(.+)$/gm;
    let m: RegExpExecArray | null;
    while ((m = headingRe.exec(raw))) {
      const text = m[2]?.trim();
      if (!text) continue;
      entries.push({
        id: `${slug}#${slugify(text)}`,
        title: text,
        description: title,
        section,
        slug,
        hash: slugify(text),
      });
    }
  }

  mkdirSync(resolve(APP_ROOT, 'public'), { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(entries), 'utf8');
  console.log(`[search] wrote ${entries.length} entries → ${relative(APP_ROOT, OUT_FILE)}`);
}

function sectionLabel(id: string): string {
  switch (id) {
    case 'get-started':
      return 'Get Started';
    case 'foundations':
      return 'Foundations';
    case 'components':
      return 'Components';
    case 'patterns':
      return 'Patterns';
    case 'shipit':
      return 'ShipIt';
    default:
      return 'Docs';
  }
}

main();
