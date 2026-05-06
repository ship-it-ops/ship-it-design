/**
 * Builds `public/search-index.json` over the navigation entries plus all
 * heading text scraped from MDX pages. The client-side palette
 * (`components/docs/DocsSearch.tsx`) fetches this on first ⌘K open.
 *
 * Headings are extracted via remark's MDX-aware AST walk (so headings
 * inside fenced code blocks are *not* indexed) and slugged with
 * `github-slugger` — the same library `rehype-slug` uses internally —
 * including its per-document de-duplication. That guarantees the `hash`
 * we emit here matches the `id` rendered into the DOM, so deep-link
 * navigation from search results lands on the right anchor.
 *
 * Run via `predev` / `prebuild`.
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import GitHubSlugger from 'github-slugger';
import { toString as mdastToString } from 'mdast-util-to-string';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

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

interface MdNode {
  type: string;
  depth?: number;
  children?: MdNode[];
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

const parser = unified().use(remarkParse);

interface ExtractedHeading {
  depth: number;
  text: string;
}

/** Walk the MDX AST, return h1+h2+h3 with rendered plain text. */
function extractHeadings(source: string): ExtractedHeading[] {
  const tree = parser.parse(source) as unknown as MdNode;
  const out: ExtractedHeading[] = [];
  const visit = (node: MdNode) => {
    if (node.type === 'heading' && typeof node.depth === 'number' && node.depth <= 3) {
      const text = mdastToString(node as never).trim();
      if (text) out.push({ depth: node.depth, text });
    }
    // remark-parse never descends into `code` (fenced code blocks) when
    // looking for heading nodes — code is a leaf — but be explicit anyway.
    if (node.type === 'code') return;
    if (node.children) for (const child of node.children) visit(child);
  };
  visit(tree);
  return out;
}

function main() {
  const entries: SearchEntry[] = [];
  const pages = findMdxPages(APP_DIR);

  for (const { abs, slug } of pages) {
    const raw = readFileSync(abs, 'utf8');
    const sectionId = slug.split('/')[0] ?? '';
    const section = sectionLabel(sectionId);

    const headings = extractHeadings(raw);
    const h1 = headings.find((h) => h.depth === 1);
    const title = h1?.text ?? slug;

    entries.push({
      id: `page:${slug}`,
      title,
      section,
      slug,
    });

    // One slugger per page so the per-document de-dup counter matches
    // exactly what `rehype-slug` does at render time.
    const slugger = new GitHubSlugger();
    if (h1) slugger.slug(h1.text); // reserve the h1's slug, same as rehype-slug

    for (const heading of headings) {
      if (heading.depth < 2) continue;
      const hash = slugger.slug(heading.text);
      entries.push({
        id: `${slug}#${hash}`,
        title: heading.text,
        description: title,
        section,
        slug,
        hash,
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
