import * as RadixTabs from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { createContext, forwardRef, useContext, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * Tabs — two visual styles built on Radix Tabs.
 *
 * `variant="underline"` (default) is the navigation tab style: text labels with
 * a moving 2px underline. `variant="pill"` is the segmented-control style: a
 * rounded panel housing pill buttons. Both share Radix's keyboard semantics
 * (←/→ to move, Home/End to jump, Enter/Space to activate when activation is
 * manual).
 */

type TabsVariant = 'underline' | 'pill';

const TabsVariantContext = createContext<TabsVariant>('underline');

const tabsListStyles = cva('', {
  variants: {
    variant: {
      underline: 'flex gap-6 border-b border-border',
      pill: 'inline-flex gap-1 rounded-base border border-border bg-panel-2 p-[3px]',
    },
  },
});

const tabsTriggerStyles = cva(
  'cursor-pointer outline-none transition-colors duration-(--duration-micro) focus-visible:ring-[3px] focus-visible:ring-accent-dim',
  {
    variants: {
      variant: {
        underline: cn(
          'relative -mb-px inline-flex items-center px-[2px] py-2 text-[13px]',
          'border-b-2 border-transparent text-text-muted',
          'hover:text-text',
          'data-[state=active]:border-accent data-[state=active]:text-text data-[state=active]:font-medium',
        ),
        pill: cn(
          'inline-flex items-center rounded-sm px-[14px] py-[6px] text-[12px] font-normal',
          'text-text-muted hover:text-text',
          'data-[state=active]:bg-panel data-[state=active]:text-text data-[state=active]:font-medium',
          'data-[state=active]:shadow-sm',
        ),
      },
    },
  },
);

export interface TabsProps extends RadixTabs.TabsProps {
  /** Visual style — `underline` (default) or segmented `pill`. */
  variant?: TabsVariant;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { variant = 'underline', className, ...props },
  ref,
) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <RadixTabs.Root
        ref={ref}
        className={cn('flex flex-col', variant === 'underline' && 'gap-3', className)}
        {...props}
      />
    </TabsVariantContext.Provider>
  );
});

export const TabsList = forwardRef<HTMLDivElement, RadixTabs.TabsListProps>(function TabsList(
  { className, ...props },
  ref,
) {
  const variant = useContext(TabsVariantContext);
  return <RadixTabs.List ref={ref} className={cn(tabsListStyles({ variant }), className)} {...props} />;
});

export interface TabProps extends RadixTabs.TabsTriggerProps {
  children?: ReactNode;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab({ className, ...props }, ref) {
  const variant = useContext(TabsVariantContext);
  return (
    <RadixTabs.Trigger ref={ref} className={cn(tabsTriggerStyles({ variant }), className)} {...props} />
  );
});

export const TabsContent = forwardRef<HTMLDivElement, RadixTabs.TabsContentProps>(
  function TabsContent({ className, ...props }, ref) {
    return (
      <RadixTabs.Content
        ref={ref}
        className={cn('outline-none focus-visible:ring-[3px] focus-visible:ring-accent-dim', className)}
        {...props}
      />
    );
  },
);

export type TabsVariantProps = VariantProps<typeof tabsTriggerStyles>;
