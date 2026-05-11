'use client';

import { useToast } from '@ship-it-ui/ui';
import { useEffect, useRef, useState } from 'react';


interface Props {
  source: string;
  language?: string;
}

/**
 * Variant of CodeBlock that highlights an arbitrary string at runtime via
 * Shiki. Used by `LivePreview` to render example sources that aren't part of
 * an MDX page (and therefore weren't pre-highlighted by `rehype-pretty-code`).
 *
 * Highlighter is loaded lazily and shared across instances.
 */
let highlighterPromise: Promise<unknown> | null = null;
async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then((shiki) =>
      shiki.createHighlighter({
        themes: ['github-dark-default', 'github-light-default'],
        langs: ['tsx', 'ts', 'jsx', 'js', 'css', 'bash', 'json'],
      }),
    );
  }
  return highlighterPromise;
}

export function CodeBlockStatic({ source, language = 'tsx' }: Props) {
  const [html, setHtml] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const hi = (await getHighlighter()) as {
        codeToHtml: (code: string, opts: Record<string, unknown>) => string;
      };
      const out = hi.codeToHtml(source, {
        lang: language,
        themes: { dark: 'github-dark-default', light: 'github-light-default' },
        defaultColor: false,
      });
      if (!cancelled) setHtml(out);
    })();
    return () => {
      cancelled = true;
    };
  }, [source, language]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      toast({ variant: 'ok', title: 'Copied', duration: 1500 });
    } catch {
      toast({ variant: 'err', title: 'Copy failed' });
    }
  };

  return (
    <div className="bg-panel-2">
      <div className="border-border bg-panel flex items-center justify-between border-b px-3 py-1.5 text-[11px]">
        <span className="text-text-dim font-mono">{language}</span>
        <button
          type="button"
          onClick={onCopy}
          className="text-text-muted hover:text-text focus-visible:ring-accent-dim font-mono outline-none focus-visible:ring-[3px]"
        >
          copy
        </button>
      </div>
      <div
        ref={ref}
        className="overflow-x-auto px-4 py-3 text-[13px] leading-[1.55]"
         
        dangerouslySetInnerHTML={{
          __html: html ?? `<pre><code>${escapeHtml(source)}</code></pre>`,
        }}
      />
    </div>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}
