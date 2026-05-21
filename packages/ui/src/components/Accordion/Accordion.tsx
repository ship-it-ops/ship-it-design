'use client';

import * as RadixAccordion from '@radix-ui/react-accordion';
import { DynamicIconGlyph, IconGlyph } from '@ship-it-ui/icons';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * Accordion — collapsible sections. Built on Radix Accordion.
 *
 * Use `type='single'` for one-open-at-a-time (FAQ pages); `'multiple'` when
 * sections are independent (filter groups, listing detail panels).
 */

export type AccordionProps = (
  | RadixAccordion.AccordionSingleProps
  | RadixAccordion.AccordionMultipleProps
) & { children?: ReactNode };

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { className, ...props },
  ref,
) {
  return (
    <RadixAccordion.Root
      ref={ref}
      className={cn('divide-border border-border divide-y border-t border-b', className)}
      {...(props as RadixAccordion.AccordionSingleProps)}
    />
  );
});
Accordion.displayName = 'Accordion';

export interface AccordionItemProps extends RadixAccordion.AccordionItemProps {}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { className, ...props },
  ref,
) {
  return <RadixAccordion.Item ref={ref} className={cn(className)} {...props} />;
});
AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps extends Omit<
  RadixAccordion.AccordionTriggerProps,
  'asChild'
> {
  /** Optional icon name rendered to the left of the trigger label. */
  leadingIcon?: string;
}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ children, leadingIcon, className, ...props }, ref) {
    return (
      <RadixAccordion.Header className="flex">
        <RadixAccordion.Trigger
          ref={ref}
          className={cn(
            'group text-text hover:text-accent-text flex flex-1 cursor-pointer items-center gap-3 py-3 text-left text-[14px] font-medium',
            'focus-visible:ring-accent-dim outline-none focus-visible:ring-[3px]',
            'transition-colors duration-(--duration-micro)',
            className,
          )}
          {...props}
        >
          {leadingIcon && (
            <DynamicIconGlyph name={leadingIcon} size={16} className="text-text-dim shrink-0" />
          )}
          <span className="flex-1">{children}</span>
          <IconGlyph
            name="caretDown"
            size={16}
            className="text-text-dim shrink-0 transition-transform duration-(--duration-micro) group-data-[state=open]:rotate-180"
          />
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>
    );
  },
);
AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionContentProps extends RadixAccordion.AccordionContentProps {}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ className, children, ...props }, ref) {
    return (
      <RadixAccordion.Content
        ref={ref}
        className={cn(
          'text-text-dim overflow-hidden text-[13px] leading-relaxed',
          'data-[state=closed]:animate-[accordion-up_160ms_var(--easing-out)] data-[state=open]:animate-[accordion-down_160ms_var(--easing-out)]',
          className,
        )}
        {...props}
      >
        <div className="pb-3">{children}</div>
      </RadixAccordion.Content>
    );
  },
);
AccordionContent.displayName = 'AccordionContent';
