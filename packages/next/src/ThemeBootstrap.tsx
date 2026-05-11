import { THEME_COOKIE_NAME } from './theme-cookie';

/**
 * ThemeBootstrap — render inside the `<head>` of your App Router root layout.
 * Injects a synchronous inline script that reads the theme cookie and sets
 * `<html data-theme>` *before* the first paint, which kills the dark→light
 * flash of unstyled content for users on the light theme.
 *
 * Pair with `getThemeFromCookies(cookies())` to seed the server-rendered
 * `data-theme` on `<html>` for the very first frame.
 *
 * ```tsx
 * import { cookies } from 'next/headers';
 * import { ThemeBootstrap, getThemeFromCookies } from '@ship-it-ui/next';
 *
 * export default function RootLayout({ children }) {
 *   const theme = getThemeFromCookies(cookies());
 *   return (
 *     <html lang="en" data-theme={theme}>
 *       <head><ThemeBootstrap /></head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ThemeBootstrap(): JSX.Element {
  return (
    <script
      // The script must be synchronous and inline — there's no place else to
      // intercept the document before paint. Build the cookie name into the
      // script so consumers don't have to mirror it.
      dangerouslySetInnerHTML={{ __html: buildBootstrapScript() }}
    />
  );
}

ThemeBootstrap.displayName = 'ThemeBootstrap';

/**
 * Returns the inline-script body that `ThemeBootstrap` injects. Exported so
 * tests (and consumers with a custom layout) can inspect or reuse the source.
 */
export function buildBootstrapScript(): string {
  return `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE_NAME}=(dark|light)/);var t=m&&m[1];if(t==='light'){document.documentElement.setAttribute('data-theme','light');}else if(t==='dark'){document.documentElement.removeAttribute('data-theme');}}catch(_){}})();`;
}
