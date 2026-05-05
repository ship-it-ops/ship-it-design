import createMDX from '@next/mdx';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

/**
 * Next.js 15 + MDX. Static export so GitHub Pages can host it.
 *
 * `NEXT_PUBLIC_BASE_PATH` lets the Pages workflow build assets under the repo
 * subpath (e.g. `/ship-it-design/`). Empty in dev / local builds.
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
  experimental: {
    mdxRs: false,
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      // Render a `<a class="docs-anchor">#</a>` after every h2/h3/h4 so the
      // hover-reveal `.docs-anchor` styles in `app/globals.css` actually have
      // a target. `rehype-slug` only writes the `id`; this plugin emits the
      // anchor element.
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['docs-anchor'], 'aria-label': 'Link to section' },
          content: { type: 'text', value: '#' },
          test: ['h2', 'h3', 'h4'],
        },
      ],
      [
        rehypePrettyCode,
        {
          theme: { dark: 'github-dark-default', light: 'github-light-default' },
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
