import createMDX from '@next/mdx';
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
