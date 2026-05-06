/**
 * One-shot migrator for the legacy Storybook `.stories.tsx` files.
 *
 * The stories were deleted in commit `a69522b` ("chore: rework docs"). This
 * script reads them back from `a69522b^` (the parent), splits each file's
 * named exports into one `examples/<kebab>/<example>.tsx` per story, and
 * generates a matching `app/(docs)/<section>/<kebab>/page.mdx` plus a fresh
 * `content/navigation.ts` registering everything.
 *
 * The output mirrors the hand-written Button page (the template) so the new
 * pages drop in cleanly. After running, regenerate the registries:
 *
 *     pnpm run generate
 *
 * Re-running is idempotent — examples and pages are overwritten in place.
 */
import { execSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import {
  Project,
  SyntaxKind,
  type ObjectLiteralExpression,
  type SourceFile,
  type VariableDeclaration,
} from 'ts-morph';

const STORIES_COMMIT = 'a69522b^';
const APP_ROOT = process.cwd();
const REPO_ROOT = execSync('git rev-parse --show-toplevel').toString().trim();
const EXAMPLES_DIR = join(APP_ROOT, 'examples');
const PAGES_DIR = join(APP_ROOT, 'app', '(docs)');
const NAV_FILE = join(APP_ROOT, 'content', 'navigation.ts');

interface StoryExport {
  storyName: string; // 'WithIcon'
  exampleSlug: string; // 'with-icon'
  source: string; // entire .tsx file content for this single example
}

interface MigratedComponent {
  pkg: 'ui' | 'shipit';
  storyPath: string; // packages/ui/.../Avatar.stories.tsx
  title: string; // 'Components/Display/Avatar'
  componentName: string; // 'Avatar' (used for PropsTable)
  section: string; // 'components' | 'patterns' | 'shipit'
  group: string; // 'Display' | 'Inputs' | …
  pageTitle: string; // 'Avatar'
  pageSlug: string; // 'components/avatar'
  componentDir: string; // 'avatar' (kebab leaf)
  description: string; // one-line summary or fallback
  exports: StoryExport[];
}

function kebab(s: string): string {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function listStoryPaths(): string[] {
  const out = execSync(`git ls-tree -r ${STORIES_COMMIT} --name-only`, {
    cwd: REPO_ROOT,
  }).toString();
  return out
    .split('\n')
    .filter(
      (p) =>
        p.endsWith('.stories.tsx') &&
        (p.startsWith('packages/ui/') || p.startsWith('packages/shipit/')),
    );
}

function readFromHistory(path: string): string {
  return execSync(`git show ${STORIES_COMMIT}:${path}`, { cwd: REPO_ROOT }).toString();
}

/** Sectionize 'Components/Display/Avatar' → { section: 'components', group: 'Display', leaf: 'Avatar' }. */
function classifyTitle(
  title: string,
  pkg: 'ui' | 'shipit',
): { section: string; group: string; leaf: string } {
  const segs = title.split('/').map((s) => s.trim());
  if (pkg === 'shipit') {
    // ShipIt/AI/AskBar
    return {
      section: 'shipit',
      group: segs[1] ?? 'General',
      leaf: segs[segs.length - 1] ?? 'Untitled',
    };
  }
  // Components/Inputs/Button or Patterns/Forms/Combobox
  const top = segs[0]?.toLowerCase() ?? 'components';
  const section = top === 'patterns' ? 'patterns' : 'components';
  return {
    section,
    group: segs[1] ?? 'General',
    leaf: segs[segs.length - 1] ?? 'Untitled',
  };
}

/** Strip Storybook-specific imports and type aliases. */
function stripStorybookGlue(file: SourceFile) {
  for (const imp of file.getImportDeclarations()) {
    const mod = imp.getModuleSpecifierValue();
    if (mod === '@storybook/react-vite' || mod === '@storybook/react') {
      imp.remove();
    }
  }
  for (const ta of file.getTypeAliases()) {
    if (ta.getName() === 'Story') ta.remove();
  }
}

/** Rewrite relative imports to the public package barrel. */
function rewriteRelativeImports(file: SourceFile, pkg: 'ui' | 'shipit') {
  const target = pkg === 'shipit' ? '@ship-it-ui/shipit' : '@ship-it-ui/ui';
  for (const imp of file.getImportDeclarations()) {
    const mod = imp.getModuleSpecifierValue();
    // Heuristic: anything that starts with './' or '../' is package-internal
    // and should resolve to the public barrel. Cross-package relatives
    // (e.g. shipit reaching into ui) are unusual — handle if encountered.
    if (mod.startsWith('./') || mod.startsWith('../')) {
      imp.setModuleSpecifier(target);
    }
  }

  // After rewriting, several imports may now hit the same barrel — collapse
  // them into one to keep the example tidy.
  const grouped = new Map<string, Set<string>>();
  const grpDefault = new Map<string, string>();
  const dropped: string[] = [];
  for (const imp of file.getImportDeclarations()) {
    const mod = imp.getModuleSpecifierValue();
    if (mod !== target) continue;
    const set = grouped.get(mod) ?? new Set();
    for (const named of imp.getNamedImports()) {
      const text = named.getText();
      set.add(text);
    }
    grouped.set(mod, set);
    const def = imp.getDefaultImport()?.getText();
    if (def && !grpDefault.has(mod)) grpDefault.set(mod, def);
    dropped.push(imp.getText());
    imp.remove();
  }
  for (const [mod, set] of grouped) {
    if (set.size === 0 && !grpDefault.has(mod)) continue;
    const named = Array.from(set).sort().join(', ');
    const def = grpDefault.get(mod);
    file.addImportDeclaration({
      moduleSpecifier: mod,
      defaultImport: def,
      namedImports: named ? Array.from(set).sort() : undefined,
    });
  }
  void dropped;
}

/** Pull a string-literal property out of an object literal, undefined if absent. */
function getStringProp(obj: ObjectLiteralExpression, name: string): string | undefined {
  const prop = obj.getProperty(name);
  if (!prop) return undefined;
  if (prop.getKind() !== SyntaxKind.PropertyAssignment) return undefined;
  const init = prop.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializer();
  if (!init) return undefined;
  if (init.getKind() === SyntaxKind.StringLiteral) {
    return init.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralText();
  }
  return undefined;
}

/** Turn an object-literal `args` block into a JSX attribute string. */
function argsToAttrs(args: ObjectLiteralExpression): string {
  const parts: string[] = [];
  let childrenExpr: string | null = null;
  for (const prop of args.getProperties()) {
    if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const pa = prop.asKindOrThrow(SyntaxKind.PropertyAssignment);
    const name = pa.getName();
    const init = pa.getInitializer();
    if (!init) continue;
    if (name === 'children') {
      childrenExpr = init.getText();
      continue;
    }
    if (init.getKind() === SyntaxKind.StringLiteral) {
      parts.push(`${name}=${init.getText()}`);
    } else if (init.getKind() === SyntaxKind.TrueKeyword) {
      parts.push(name);
    } else {
      parts.push(`${name}={${init.getText()}}`);
    }
  }
  return JSON.stringify({ attrs: parts.join(' '), children: childrenExpr });
}

/** Build a JSX element string `<Comp attrs…>children</Comp>`. */
function buildJsxFromArgs(componentName: string, attrsJson: string): string {
  const { attrs, children } = JSON.parse(attrsJson) as { attrs: string; children: string | null };
  if (children) {
    return `<${componentName}${attrs ? ' ' + attrs : ''}>${children === 'null' ? '' : `{${children}}`}</${componentName}>`;
  }
  return `<${componentName}${attrs ? ' ' + attrs : ''} />`;
}

interface RenderBody {
  body: string;
  /** Name of the first parameter of the render arrow, if any (e.g., `args`). */
  paramName?: string;
}

/** Lift an arrow-function or function-expression render body into a JSX
 * expression. Returns the body text plus the name of the first parameter
 * binding (if present) — Storybook injects `meta.args + story.args` into
 * that parameter at runtime, so the caller needs to materialise it. */
function liftRenderBody(file: SourceFile, init: VariableDeclaration): RenderBody | null {
  const obj = init.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!obj) return null;
  const renderProp = obj.getProperty('render');
  if (!renderProp || renderProp.getKind() !== SyntaxKind.PropertyAssignment) return null;
  const renderInit = renderProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializer();
  if (!renderInit) return null;

  if (renderInit.getKind() === SyntaxKind.ArrowFunction) {
    const arrow = renderInit.asKindOrThrow(SyntaxKind.ArrowFunction);
    const param = arrow.getParameters()[0];
    const paramName =
      param?.getNameNode().getKind() === SyntaxKind.Identifier ? param.getName() : undefined;
    return { body: arrow.getBody().getText(), paramName };
  }
  if (renderInit.getKind() === SyntaxKind.FunctionExpression) {
    const fn = renderInit.asKindOrThrow(SyntaxKind.FunctionExpression);
    const param = fn.getParameters()[0];
    const paramName =
      param?.getNameNode().getKind() === SyntaxKind.Identifier ? param.getName() : undefined;
    return { body: fn.getBody().getText(), paramName };
  }
  void file;
  return null;
}

/** Build an object-literal string of merged meta + story args so a render
 * body that closes over a parameter can be given a real binding. Story
 * args override meta args (Storybook's runtime behaviour). */
function buildMergedArgsObject(
  meta: ObjectLiteralExpression,
  storyArgs: ObjectLiteralExpression | undefined,
): string {
  const merged = new Map<string, string>();
  for (const obj of [meta.getProperty('args'), storyArgs]) {
    if (!obj) continue;
    let ol: ObjectLiteralExpression | undefined;
    if (obj.getKind() === SyntaxKind.PropertyAssignment) {
      ol = obj
        .asKindOrThrow(SyntaxKind.PropertyAssignment)
        .getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
    } else if (obj.getKind() === SyntaxKind.ObjectLiteralExpression) {
      ol = obj as ObjectLiteralExpression;
    }
    if (!ol) continue;
    for (const prop of ol.getProperties()) {
      if (prop.getKind() === SyntaxKind.PropertyAssignment) {
        const pa = prop.asKindOrThrow(SyntaxKind.PropertyAssignment);
        // Storybook overrides via map insertion order — Map.set replaces.
        merged.set(pa.getName(), pa.getText());
      } else if (prop.getKind() === SyntaxKind.ShorthandPropertyAssignment) {
        const sh = prop.asKindOrThrow(SyntaxKind.ShorthandPropertyAssignment);
        merged.set(sh.getName(), sh.getName());
      }
    }
  }
  if (merged.size === 0) return '{}';
  return `{\n  ${Array.from(merged.values()).join(',\n  ')},\n}`;
}

/** Generate a single example file from a story's named export. */
function generateExampleSource(opts: {
  baseFile: SourceFile;
  meta: ObjectLiteralExpression;
  componentName: string;
  exportName: string;
  exportInit: VariableDeclaration;
  pkg: 'ui' | 'shipit';
}): string {
  const { baseFile, meta, componentName, exportName, exportInit, pkg } = opts;

  // Make a working copy so removing the other exports doesn't touch the
  // shared base file.
  const project = new Project({ useInMemoryFileSystem: true });
  const work = project.createSourceFile('example.tsx', baseFile.getFullText());

  stripStorybookGlue(work);
  rewriteRelativeImports(work, pkg);

  // Remove `export default meta` (an ExportAssignment) and any other
  // default-export glue; the regenerated example uses `export default
  // function Example()`.
  for (const ea of work.getExportAssignments()) {
    ea.remove();
  }

  // Drop the `meta` declaration AND every exported Story except the one
  // we're emitting. Stories may or may not be wrapped in `export` keywords;
  // story files always declare each export as its own statement, so dropping
  // the whole statement is safe.
  for (const stmt of work.getVariableStatements()) {
    const decls = stmt.getDeclarations();
    if (decls.length !== 1) continue;
    const name = decls[0]!.getName();
    if (name === 'meta') {
      stmt.remove();
      continue;
    }
    if (stmt.isExported() && name !== exportName) {
      stmt.remove();
    }
  }

  // Now find the surviving export and replace it with a default-exported
  // function `Example()` that renders the story.
  const surviving = work.getVariableDeclaration(exportName);
  if (!surviving) {
    throw new Error(`Lost export ${exportName} during rewrite`);
  }

  // Build the body.
  let body: string;
  const lifted = liftRenderBody(work, surviving);
  if (lifted) {
    // renderBody is either `(<JSX/>)` or `{ return <JSX/>; }` — both work
    // inside a function returning that.
    const survivingInit = surviving.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
    const storyArgs = survivingInit
      ?.getProperty('args')
      ?.asKind(SyntaxKind.PropertyAssignment)
      ?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
    const argsLiteral = buildMergedArgsObject(meta, storyArgs);
    // `as const` preserves literal types ('accent' rather than `string`)
    // so spreading {...args} into a strict-typed component still narrows.
    const argsBinding = lifted.paramName
      ? `const ${lifted.paramName} = ${argsLiteral} as const;\n`
      : '';
    const renderText = lifted.body.startsWith('{') ? lifted.body : `{ return ${lifted.body}; }`;
    // Strip enclosing braces, then re-wrap with the args binding.
    const inner = renderText.replace(/^\s*\{/, '').replace(/\}\s*$/, '');
    body = `{${argsBinding}${inner}}`;
  } else {
    // No render — synthesize from meta.args + this story's args.
    const init = surviving.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
    const storyArgs = init?.getProperty('args');
    const merged = project.createSourceFile('m.tsx', '').addVariableStatement({
      declarations: [{ name: '__merged__', initializer: '({})' }],
    });
    void merged;
    // Walk meta.args, add story.args overrides on top, then build attrs.
    const combined: Record<string, string> = {};
    for (const obj of [meta.getProperty('args'), storyArgs]) {
      if (!obj) continue;
      if (obj.getKind() !== SyntaxKind.PropertyAssignment) continue;
      const pa = obj.asKindOrThrow(SyntaxKind.PropertyAssignment);
      const ol = pa.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
      if (!ol) continue;
      for (const prop of ol.getProperties()) {
        if (prop.getKind() === SyntaxKind.PropertyAssignment) {
          const ppa = prop.asKindOrThrow(SyntaxKind.PropertyAssignment);
          const propInit = ppa.getInitializer();
          if (!propInit) continue;
          combined[ppa.getName()] = propInit.getText();
        } else if (prop.getKind() === SyntaxKind.ShorthandPropertyAssignment) {
          // `args: { features, columns: 3 }` — the value is a reference
          // to a top-level binding with the same name.
          const sh = prop.asKindOrThrow(SyntaxKind.ShorthandPropertyAssignment);
          const name = sh.getName();
          combined[name] = name;
        }
      }
    }
    let attrs = '';
    let children = '';
    for (const [rawName, val] of Object.entries(combined)) {
      // ts-morph returns quoted names verbatim for property keys like
      // `'aria-label'`. Strip the quotes for JSX attribute emission.
      const name = rawName.replace(/^['"]|['"]$/g, '');
      if (name === 'children') {
        children = val.startsWith('"') || val.startsWith("'") ? val.slice(1, -1) : `{${val}}`;
        continue;
      }
      if (val === 'true') attrs += ` ${name}`;
      else if (val.startsWith('"') || val.startsWith("'")) attrs += ` ${name}=${val}`;
      else attrs += ` ${name}={${val}}`;
    }
    body = children
      ? `return <${componentName}${attrs}>${children}</${componentName}>;`
      : `return <${componentName}${attrs} />;`;
  }

  // Replace the original `export const X: Story = {...};` statement with
  // the function. Find the parent statement and remove it, then append.
  const survivingStatement = surviving.getVariableStatement();
  if (!survivingStatement) throw new Error(`No statement for ${exportName}`);
  survivingStatement.remove();

  const trimmedBody = body.trim().startsWith('{') ? body.trim().slice(1, -1) : `${body.trim()}`;
  work.addStatements(
    `\nexport default function Example() {\n  ${trimmedBody.replace(/\n/g, '\n  ')}\n}\n`,
  );

  work.formatText();
  return work.getFullText();
}

function processStory(path: string): MigratedComponent | null {
  const pkg: 'ui' | 'shipit' = path.startsWith('packages/shipit/') ? 'shipit' : 'ui';
  const raw = readFromHistory(path);
  const project = new Project({ useInMemoryFileSystem: true });
  const file = project.createSourceFile('s.tsx', raw);

  const metaDecl = file.getVariableDeclaration('meta');
  const meta = metaDecl?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!meta) {
    console.warn(`[skip] no meta in ${path}`);
    return null;
  }
  const title = getStringProp(meta, 'title') ?? 'Components/Misc/Untitled';
  const componentName =
    meta
      .getProperty('component')
      ?.asKind(SyntaxKind.PropertyAssignment)
      ?.getInitializer()
      ?.getText() ??
    title.split('/').pop() ??
    'Component';

  const { section, group, leaf } = classifyTitle(title, pkg);
  const componentDir = kebab(leaf);
  const pageSlug = `${section}/${componentDir}`;

  // Each named exported variable that isn't `meta` is a story.
  const storyDecls: VariableDeclaration[] = [];
  for (const stmt of file.getVariableStatements()) {
    if (!stmt.isExported() && !stmt.hasExportKeyword()) continue;
    for (const d of stmt.getDeclarations()) {
      if (d.getName() !== 'meta') storyDecls.push(d);
    }
  }

  if (storyDecls.length === 0) {
    console.warn(`[skip] no stories in ${path}`);
    return null;
  }

  const exports: StoryExport[] = [];
  for (const decl of storyDecls) {
    const exportName = decl.getName();
    const exampleSlug = kebab(exportName);
    try {
      const source = generateExampleSource({
        baseFile: file,
        meta,
        componentName,
        exportName,
        exportInit: decl,
        pkg,
      });
      exports.push({ storyName: exportName, exampleSlug, source });
    } catch (err) {
      console.warn(`[error] ${path} :: ${exportName} → ${(err as Error).message}`);
    }
  }

  return {
    pkg,
    storyPath: path,
    title,
    componentName,
    section,
    group,
    pageTitle: leaf,
    pageSlug,
    componentDir,
    description: '',
    exports,
  };
}

function writeExample(component: MigratedComponent, exp: StoryExport) {
  const dir = join(EXAMPLES_DIR, component.componentDir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${exp.exampleSlug}.tsx`), exp.source, 'utf8');
}

function writeMdxPage(component: MigratedComponent) {
  const dir = join(PAGES_DIR, component.section, component.componentDir);
  mkdirSync(dir, { recursive: true });
  const lines: string[] = [];
  lines.push(`# ${component.pageTitle}`);
  lines.push('');
  lines.push(
    `Each example below is a real component instance — flip the theme toggle to see how it adapts.`,
  );
  lines.push('');
  for (const exp of component.exports) {
    const heading = exp.storyName
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/^./, (c) => c.toUpperCase());
    lines.push(`## ${heading}`);
    lines.push('');
    lines.push(`<LivePreview example="${component.componentDir}/${exp.exampleSlug}" />`);
    lines.push('');
  }
  lines.push(`## Props`);
  lines.push('');
  lines.push(`<PropsTable component="${component.componentName}" />`);
  lines.push('');
  lines.push(
    `<EditOnGithub source="apps/docs-site/app/(docs)/${component.section}/${component.componentDir}/page.mdx" />`,
  );
  lines.push('');
  writeFileSync(join(dir, 'page.mdx'), lines.join('\n'), 'utf8');
}

function writeNavigation(components: MigratedComponent[]) {
  // Group by section → group label → entries.
  const sections: Record<string, Record<string, MigratedComponent[]>> = {};
  for (const c of components) {
    sections[c.section] ??= {};
    sections[c.section]![c.group] ??= [];
    sections[c.section]![c.group]!.push(c);
  }
  for (const sec of Object.values(sections)) {
    for (const g of Object.values(sec)) g.sort((a, b) => a.pageTitle.localeCompare(b.pageTitle));
  }

  const groupOrder: Record<string, string[]> = {
    components: ['Inputs', 'Display', 'Overlays'],
    patterns: ['Navigation', 'Forms', 'Feedback', 'Data', 'Layout', 'Charts'],
    shipit: ['AI', 'Entity', 'Graph', 'Marketing', 'Data'],
  };

  const out: string[] = [];
  out.push(`/**`);
  out.push(` * Single source of truth for the docs sidebar.`);
  out.push(` *`);
  out.push(` * Filesystem order is meaningless — the order here is the order users see.`);
  out.push(` * Pages are served directly as \`app/(docs)/<slug>/page.mdx\` via Next's`);
  out.push(` * \`pageExtensions: ['ts','tsx','mdx']\`, so a route only becomes reachable`);
  out.push(` * once an entry is added here AND a matching \`page.mdx\` exists.`);
  out.push(` *`);
  out.push(` * To add a page: drop the MDX at \`app/(docs)/<section>/<slug>/page.mdx\``);
  out.push(` * and add an entry to the matching section below.`);
  out.push(` */`);
  out.push(``);
  out.push(`export interface NavLeaf {`);
  out.push(`  title: string;`);
  out.push(`  /** Slug relative to site root, no leading slash. */`);
  out.push(`  slug: string;`);
  out.push(`  badge?: string;`);
  out.push(`}`);
  out.push(``);
  out.push(`export interface NavGroup {`);
  out.push(`  label: string;`);
  out.push(`  items: NavLeaf[];`);
  out.push(`}`);
  out.push(``);
  out.push(`export interface NavSection {`);
  out.push(`  /** Top-level section, becomes the first slug segment. */`);
  out.push(`  id: string;`);
  out.push(`  label: string;`);
  out.push(`  groups: NavGroup[];`);
  out.push(`}`);
  out.push(``);
  out.push(`export const navigation: NavSection[] = [`);

  // Get Started + Foundations are not auto-generated.
  out.push(`  {`);
  out.push(`    id: 'get-started',`);
  out.push(`    label: 'Get Started',`);
  out.push(`    groups: [`);
  out.push(`      {`);
  out.push(`        label: 'Overview',`);
  out.push(`        items: [`);
  out.push(`          { title: 'Introduction', slug: 'get-started/introduction' },`);
  out.push(`          { title: 'Installation', slug: 'get-started/installation' },`);
  out.push(`          { title: 'Theming', slug: 'get-started/theming' },`);
  out.push(`        ],`);
  out.push(`      },`);
  out.push(`    ],`);
  out.push(`  },`);
  out.push(`  {`);
  out.push(`    id: 'foundations',`);
  out.push(`    label: 'Foundations',`);
  out.push(`    groups: [`);
  out.push(`      {`);
  out.push(`        label: 'Tokens',`);
  out.push(`        items: [`);
  out.push(`          { title: 'Color', slug: 'foundations/color' },`);
  out.push(`          { title: 'Typography', slug: 'foundations/typography' },`);
  out.push(`          { title: 'Spacing', slug: 'foundations/spacing' },`);
  out.push(`          { title: 'Motion', slug: 'foundations/motion' },`);
  out.push(`        ],`);
  out.push(`      },`);
  out.push(`      {`);
  out.push(`        label: 'Guidelines',`);
  out.push(`        items: [`);
  out.push(`          { title: 'Design Principles', slug: 'foundations/principles' },`);
  out.push(`          { title: 'Iconography', slug: 'foundations/iconography' },`);
  out.push(`          { title: 'Layout', slug: 'foundations/layout' },`);
  out.push(`          { title: 'Accessibility', slug: 'foundations/accessibility' },`);
  out.push(`          { title: 'Voice & Content', slug: 'foundations/voice-and-content' },`);
  out.push(`        ],`);
  out.push(`      },`);
  out.push(`    ],`);
  out.push(`  },`);

  for (const sectionId of ['components', 'patterns', 'shipit'] as const) {
    const sectionLabel =
      sectionId === 'components' ? 'Components' : sectionId === 'patterns' ? 'Patterns' : 'ShipIt';
    const groups = sections[sectionId] ?? {};
    const order = groupOrder[sectionId] ?? Object.keys(groups);
    const orderedGroupKeys = [
      ...order.filter((g) => groups[g]),
      ...Object.keys(groups).filter((g) => !order.includes(g)),
    ];
    if (orderedGroupKeys.length === 0) continue;
    out.push(`  {`);
    out.push(`    id: '${sectionId}',`);
    out.push(`    label: '${sectionLabel}',`);
    out.push(`    groups: [`);
    for (const groupLabel of orderedGroupKeys) {
      const items = groups[groupLabel] ?? [];
      out.push(`      {`);
      out.push(`        label: '${groupLabel}',`);
      out.push(`        items: [`);
      for (const c of items) {
        out.push(`          { title: '${c.pageTitle}', slug: '${c.pageSlug}' },`);
      }
      out.push(`        ],`);
      out.push(`      },`);
    }
    out.push(`    ],`);
    out.push(`  },`);
  }
  out.push(`];`);
  out.push(``);
  out.push(`/** Flatten to an ordered list of leafs (used by Pager and Search). */`);
  out.push(`export function flatNav(): NavLeaf[] {`);
  out.push(`  return navigation.flatMap((s) => s.groups.flatMap((g) => g.items));`);
  out.push(`}`);
  out.push(``);
  out.push(`/** Resolve a slug to its leaf entry, or undefined. */`);
  out.push(`export function findLeaf(slug: string): NavLeaf | undefined {`);
  out.push(`  return flatNav().find((l) => l.slug === slug);`);
  out.push(`}`);
  out.push(``);
  out.push(`/** Find prev/next neighbors for the Pager. */`);
  out.push(`export function neighbors(slug: string): { prev?: NavLeaf; next?: NavLeaf } {`);
  out.push(`  const flat = flatNav();`);
  out.push(`  const i = flat.findIndex((l) => l.slug === slug);`);
  out.push(`  if (i === -1) return {};`);
  out.push(`  return { prev: flat[i - 1], next: flat[i + 1] };`);
  out.push(`}`);
  writeFileSync(NAV_FILE, out.join('\n') + '\n', 'utf8');
}

function main() {
  console.log(`[migrate] reading stories from ${STORIES_COMMIT}`);
  const paths = listStoryPaths();
  console.log(`[migrate] ${paths.length} story files`);

  // Wipe previous migration output (preserve the hand-written Button page
  // template — but we'll regenerate Button too, the codemod's output is
  // the canonical version going forward).
  rmSync(EXAMPLES_DIR, { recursive: true, force: true });
  // Don't wipe entire (docs)/components — that would nuke get-started/foundations.
  for (const sec of ['components', 'patterns', 'shipit']) {
    rmSync(join(PAGES_DIR, sec), { recursive: true, force: true });
  }

  const components: MigratedComponent[] = [];
  let totalExamples = 0;
  for (const path of paths) {
    const c = processStory(path);
    if (!c) continue;
    components.push(c);
    for (const exp of c.exports) {
      writeExample(c, exp);
      totalExamples += 1;
    }
    writeMdxPage(c);
  }
  components.sort((a, b) => a.pageSlug.localeCompare(b.pageSlug));
  writeNavigation(components);

  console.log(
    `[migrate] wrote ${totalExamples} examples across ${components.length} components, navigation regenerated`,
  );
}

main();
