'use client';

import * as RadixToast from '@radix-ui/react-toast';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { cn } from '../../utils/cn';

export type ToastVariant = 'default' | 'info' | 'ok' | 'warn' | 'err';

export interface ToastInput {
  /** Optional ID; auto-generated when omitted. Useful for `dismiss(id)`. */
  id?: string;
  variant?: ToastVariant;
  title: ReactNode;
  description?: ReactNode;
  /** Inline action — typically a Button. */
  action?: ReactNode;
  /** Auto-dismiss after N ms. Default 4000. Set to 0 to require manual dismiss. */
  duration?: number;
}

interface ToastEntry extends ToastInput {
  id: string;
}

interface ToastContextValue {
  toast: (t: ToastInput) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantIcon: Record<ToastVariant, string> = {
  default: '●',
  info: 'ℹ',
  ok: '✓',
  warn: '!',
  err: '×',
};

const variantTextColor: Record<ToastVariant, string> = {
  default: 'text-text-dim',
  info: 'text-accent',
  ok: 'text-ok',
  warn: 'text-warn',
  err: 'text-err',
};

const variantBorderLeft: Record<ToastVariant, string> = {
  default: 'border-l-border',
  info: 'border-l-accent',
  ok: 'border-l-ok',
  warn: 'border-l-warn',
  err: 'border-l-err',
};

/**
 * Wrap your app once at the root. Components inside can call `useToast()` to
 * push transient messages from anywhere.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const toast = useCallback((t: ToastInput) => {
    const id = t.id ?? Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
        <RadixToast.Viewport className="fixed right-5 bottom-5 z-toast flex w-[380px] max-w-[calc(100vw-40px)] flex-col gap-2 outline-none" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside <ToastProvider>');
  return ctx;
}

interface ToastCardProps {
  toast: ToastEntry;
  onDismiss: () => void;
}

export const ToastCard = forwardRef<HTMLLIElement, ToastCardProps>(function ToastCard(
  { toast, onDismiss },
  ref,
) {
  const variant = toast.variant ?? 'default';
  return (
    <RadixToast.Root
      ref={ref}
      duration={toast.duration ?? 4000}
      onOpenChange={(open) => {
        if (!open) onDismiss();
      }}
      className={cn(
        'bg-panel border-border pointer-events-auto rounded-md border border-l-[2px] p-3 shadow-lg',
        'flex items-start gap-[10px]',
        'data-[state=open]:animate-[ship-toast-in_220ms_var(--easing-out)]',
        variantBorderLeft[variant],
      )}
    >
      <span className={cn('mt-px text-[14px] leading-none', variantTextColor[variant])}>
        {variantIcon[variant]}
      </span>
      <div className="min-w-0 flex-1">
        <RadixToast.Title className="text-text text-[13px] font-medium">
          {toast.title}
        </RadixToast.Title>
        {toast.description && (
          <RadixToast.Description className="text-text-muted mt-[2px] text-[12px] leading-[1.5]">
            {toast.description}
          </RadixToast.Description>
        )}
        {toast.action && <div className="mt-2">{toast.action}</div>}
      </div>
      <RadixToast.Close
        aria-label="Dismiss"
        className="text-text-dim hover:text-text -mt-px text-[15px] leading-none"
      >
        ×
      </RadixToast.Close>
    </RadixToast.Root>
  );
});

ToastCard.displayName = 'ToastCard';
