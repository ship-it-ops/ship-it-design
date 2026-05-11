'use client';

import { useToast } from '@ship-it-ui/ui';
import { useRef, useState, type HTMLAttributes } from 'react';

/**
 * MDX `<pre>` replacement. `rehype-pretty-code` has already converted children
 * into `<code>` with token spans before we render — this just adds the chrome
 * (header, language label, copy button) and a Toast on copy.
 */
export function CodeBlock({ children, className, ...props }: HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const text = ref.current?.innerText ?? '';
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ variant: 'ok', title: 'Copied', duration: 1500 });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast({ variant: 'err', title: 'Copy failed' });
    }
  };

  return (
    <div className="border-border bg-panel-2 rounded-base my-4 overflow-hidden border">
      <div className="border-border bg-panel flex items-center justify-between border-b px-3 py-1.5 text-[11px]">
        <span className="text-text-dim font-mono">{getLang(props)}</span>
        <button
          type="button"
          onClick={onCopy}
          className="text-text-muted hover:text-text focus-visible:ring-accent-dim font-mono outline-none focus-visible:ring-[3px]"
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre
        ref={ref}
        {...props}
        className={`overflow-x-auto px-4 py-3 font-mono text-[13px] leading-[1.55] ${className ?? ''}`}
      >
        {children}
      </pre>
    </div>
  );
}

function getLang(props: HTMLAttributes<HTMLPreElement>): string {
  // `rehype-pretty-code` puts `data-language` on the `<pre>`.
  const dl = (props as { 'data-language'?: string })['data-language'];
  return dl ?? '';
}
