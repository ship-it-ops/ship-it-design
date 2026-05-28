import createMDX from '@next/mdx';

/**
 * Next.js 16 + MDX. Static export so GitHub Pages can host it.
 *
 * `NEXT_PUBLIC_BASE_PATH` lets the Pages workflow build assets under the repo
 * subpath (e.g. `/ship-it-design/`). Empty in dev / local builds.
 *
 * Turbopack is the default for `next dev` and `next build` in 16. MDX plugins
 * are passed as string module names (not imported function references) so
 * Turbopack can serialize the loader options across its worker boundary —
 * `@next/mdx@16` resolves the strings to packages at compile time.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'mdx'],
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  transpilePackages: [
    '@ship-it-ui/ui',
    '@ship-it-ui/tokens',
    '@ship-it-ui/icons',
    '@ship-it-ui/shipit',
  ],
  // React Compiler is stable in Next 16 and lives at the top level (it was
  // promoted out of `experimental` in 16). Requires `babel-plugin-react-compiler`
  // in devDependencies. If the compiler ever rejects a docs component, narrow
  // scope via `compilationMode` here rather than disabling globally.
  reactCompiler: true,
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [['remark-gfm']],
    rehypePlugins: [
      ['rehype-slug'],
      // Render a `<a class="docs-anchor">#</a>` after every h2/h3/h4 so the
      // hover-reveal `.docs-anchor` styles in `app/globals.css` actually have
      // a target. `rehype-slug` only writes the `id`; this plugin emits the
      // anchor element.
      [
        'rehype-autolink-headings',
        {
          behavior: 'append',
          properties: { className: ['docs-anchor'], 'aria-label': 'Link to section' },
          content: { type: 'text', value: '#' },
          test: ['h2', 'h3', 'h4'],
        },
      ],
      [
        'rehype-pretty-code',
        {
          theme: { dark: 'github-dark-default', light: 'github-light-default' },
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
