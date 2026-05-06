/**
 * Tailwind v4 runs as a PostCSS plugin in Next.js. The single `@import` lives in
 * `app/globals.css`; this file just registers the plugin.
 */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
