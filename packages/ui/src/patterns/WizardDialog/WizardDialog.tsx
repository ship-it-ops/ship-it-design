'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { Button } from '../../components/Button';
import { DialogContent, DialogRoot } from '../../components/Dialog';
import { Stepper } from '../Stepper';

/**
 * WizardDialog — modal multi-step flow. Composes `Dialog`, `Stepper`, and
 * Next/Back navigation around a `steps` array. Each step's content can be a
 * static node or a render function that receives the wizard context, which
 * is useful for steps that need to read or drive the navigation imperatively.
 *
 * `canAdvance` lets a step gate the Next button (e.g. when a form field is
 * empty). When the last step's Next is clicked, the wizard calls
 * `onComplete()` and lets the consumer close the dialog from there.
 */

export interface WizardContext {
  current: number;
  total: number;
  goNext: () => void;
  goBack: () => void;
  goTo: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

export interface WizardStep {
  /** Stable id. Used as the React key and the Stepper id. */
  id: string;
  /** Visible label in the Stepper. */
  label: string;
  /**
   * Step body. Pass a node for static content or a function for content that
   * needs the wizard context (e.g. to disable a Next button from inside).
   */
  content: ReactNode | ((ctx: WizardContext) => ReactNode);
  /**
   * Predicate that gates the Next button for this step. Receives the wizard
   * context. Default: always true (Next is enabled).
   */
  canAdvance?: (ctx: WizardContext) => boolean;
}

export interface WizardDialogProps {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Fires when the dialog open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Ordered list of wizard steps. */
  steps: ReadonlyArray<WizardStep>;
  /** Step index to start at. Default 0. */
  initialStep?: number;
  /** Fires when Next is clicked on the last step. The consumer typically closes the dialog here. */
  onComplete?: () => void;
  /** Dialog title (visible heading). */
  title?: ReactNode;
  /** Dialog description (rendered below the title for assistive tech). */
  description?: ReactNode;
  /** Pixel max-width of the dialog panel. Default 560. */
  width?: number | string;
  /** Override the Next button label. Default `'Next'`. */
  nextLabel?: ReactNode;
  /** Override the Next button label on the last step. Default `'Done'`. */
  completeLabel?: ReactNode;
  /** Override the Back button label. Default `'Back'`. */
  backLabel?: ReactNode;
  /** Optional cancel slot rendered in the footer alongside the navigation. */
  cancelLabel?: ReactNode;
  /** Fires when the cancel button is pressed. The consumer typically closes the dialog. */
  onCancel?: () => void;
}

export function WizardDialog({
  open,
  defaultOpen,
  onOpenChange,
  steps,
  initialStep = 0,
  onComplete,
  title,
  description,
  width = 560,
  nextLabel = 'Next',
  completeLabel = 'Done',
  backLabel = 'Back',
  cancelLabel,
  onCancel,
}: WizardDialogProps) {
  const [current, setCurrent] = useState(initialStep);

  const total = steps.length;
  const safeCurrent = Math.min(current, Math.max(0, total - 1));
  const step = steps[safeCurrent];

  const goTo = useCallback(
    (index: number) => {
      setCurrent(Math.min(Math.max(0, index), Math.max(0, total - 1)));
    },
    [total],
  );
  const goNext = useCallback(() => setCurrent((c) => Math.min(c + 1, total - 1)), [total]);
  const goBack = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  const ctx = useMemo<WizardContext>(
    () => ({
      current: safeCurrent,
      total,
      goNext,
      goBack,
      goTo,
      isFirst: safeCurrent === 0,
      isLast: safeCurrent >= total - 1,
    }),
    [safeCurrent, total, goNext, goBack, goTo],
  );

  const stepperSteps = useMemo(() => steps.map((s) => ({ id: s.id, label: s.label })), [steps]);

  if (!step) return null;

  const canAdvance = step.canAdvance ? step.canAdvance(ctx) : true;
  const body = typeof step.content === 'function' ? step.content(ctx) : step.content;

  const handlePrimary = () => {
    if (ctx.isLast) {
      onComplete?.();
    } else {
      goNext();
    }
  };

  return (
    <DialogRoot open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogContent width={width}>
        {title && <WizardTitle>{title}</WizardTitle>}
        {description && <WizardDescription>{description}</WizardDescription>}
        <div className="mb-5">
          <Stepper steps={stepperSteps} current={safeCurrent} />
        </div>
        <div className="mb-5">{body}</div>
        <div className="flex justify-end gap-2">
          {cancelLabel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={goBack} disabled={ctx.isFirst}>
            {backLabel}
          </Button>
          <Button type="button" variant="primary" onClick={handlePrimary} disabled={!canAdvance}>
            {ctx.isLast ? completeLabel : nextLabel}
          </Button>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}

function WizardTitle({ children }: { children: ReactNode }) {
  return <RadixDialog.Title className="mb-2 text-[16px] font-medium">{children}</RadixDialog.Title>;
}
function WizardDescription({ children }: { children: ReactNode }) {
  return (
    <RadixDialog.Description className="text-text-muted mb-4 text-[13px] leading-[1.55]">
      {children}
    </RadixDialog.Description>
  );
}

WizardDialog.displayName = 'WizardDialog';
