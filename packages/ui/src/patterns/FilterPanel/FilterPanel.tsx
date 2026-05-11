'use client';

import {
  forwardRef,
  useCallback,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';

/**
 * FilterPanel — multi-facet checkbox filter panel. Pass a `facets` array
 * describing each facet (label, options, optional collapsibility); the panel
 * renders a header with a reset action, then each facet as a labeled
 * checkbox group. Selections are emitted as
 * `Record<facetId, readonly string[]>` and supported in both controlled and
 * uncontrolled modes — mirroring `Slider` and `NavBar`.
 *
 * Reset both invokes the optional `onReset` callback and emits an empty
 * selection through `onValueChange`, so consumers can drive either signal.
 */

export interface FilterFacetOption {
  value: string;
  label: ReactNode;
}

export interface FilterFacet {
  id: string;
  label: ReactNode;
  options: ReadonlyArray<FilterFacetOption>;
  /** Whether the group can collapse. Default `true`. */
  collapsible?: boolean;
  /** Initial open state for collapsible groups. Default `true`. */
  defaultOpen?: boolean;
}

export type FilterPanelValue = Record<string, ReadonlyArray<string>>;

export interface FilterPanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onReset' | 'defaultValue' | 'title'> {
  facets: ReadonlyArray<FilterFacet>;
  /** Controlled selection map keyed by facet id. */
  value?: FilterPanelValue;
  /** Uncontrolled initial selection map. Default `{}`. */
  defaultValue?: FilterPanelValue;
  /** Fires whenever the selection changes — including reset. */
  onValueChange?: (next: FilterPanelValue) => void;
  /** Fired when the reset action is invoked, alongside `onValueChange({})`. */
  onReset?: () => void;
  /**
   * Optional per-option counts shown in a trailing pill. Shape:
   * `{ [facetId]: { [optionValue]: number } }`.
   */
  counts?: Record<string, Record<string, number>>;
  /** Override the header title. Default `'Filter'`. */
  title?: ReactNode;
  /** Override the reset button label. Default `'Reset'`. */
  resetLabel?: ReactNode;
}

const EMPTY: FilterPanelValue = Object.freeze({});

export const FilterPanel = forwardRef<HTMLDivElement, FilterPanelProps>(function FilterPanel(
  {
    facets,
    value,
    defaultValue,
    onValueChange,
    onReset,
    counts,
    title = 'Filter',
    resetLabel = 'Reset',
    className,
    ...props
  },
  ref,
) {
  const [selection, setSelection] = useControllableState<FilterPanelValue>({
    value,
    defaultValue: defaultValue ?? EMPTY,
    onChange: onValueChange,
  });

  const total = facets.reduce((sum, facet) => sum + (selection[facet.id]?.length ?? 0), 0);

  const toggle = useCallback(
    (facetId: string, optionValue: string, next: boolean) => {
      setSelection((prev) => {
        const current = prev?.[facetId] ?? [];
        const filtered = current.filter((v) => v !== optionValue);
        const updated = next ? [...filtered, optionValue] : filtered;
        return { ...(prev ?? {}), [facetId]: updated };
      });
    },
    [setSelection],
  );

  const handleReset = useCallback(() => {
    setSelection(EMPTY);
    onReset?.();
  }, [setSelection, onReset]);

  return (
    <div
      ref={ref}
      role="group"
      aria-label={typeof title === 'string' ? title : undefined}
      className={cn(
        'rounded-base border-border bg-panel flex w-[260px] flex-col gap-3 border p-4',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className="text-text-dim font-mono text-[10px] tracking-[1.4px] uppercase">
          {title}
        </span>
        {total > 0 && (
          <Badge size="sm" variant="accent">
            {total}
          </Badge>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={total === 0}
          className="ml-auto"
        >
          {resetLabel}
        </Button>
      </div>
      {facets.map((facet) => (
        <FilterFacetGroup
          key={facet.id}
          facet={facet}
          selected={selection[facet.id] ?? []}
          counts={counts?.[facet.id]}
          onToggle={toggle}
        />
      ))}
    </div>
  );
});

FilterPanel.displayName = 'FilterPanel';

interface FilterFacetGroupProps {
  facet: FilterFacet;
  selected: ReadonlyArray<string>;
  counts?: Record<string, number>;
  onToggle: (facetId: string, optionValue: string, next: boolean) => void;
}

function FilterFacetGroup({ facet, selected, counts, onToggle }: FilterFacetGroupProps) {
  const collapsible = facet.collapsible ?? true;
  const [open, setOpen] = useState(facet.defaultOpen ?? true);
  const isOpen = !collapsible || open;
  const selectedCount = selected.length;

  const headingClass =
    'text-text-muted flex items-center gap-[6px] font-mono text-[10px] tracking-[1.4px] uppercase';

  return (
    <section className="flex flex-col gap-1">
      {collapsible ? (
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            headingClass,
            'cursor-pointer rounded-xs px-1 py-[2px] outline-none',
            'focus-visible:ring-accent-dim focus-visible:ring-[3px]',
            'hover:text-text',
          )}
        >
          <span className="flex-1 text-left">{facet.label}</span>
          {selectedCount > 0 && (
            <Badge size="sm" variant="neutral">
              {selectedCount}
            </Badge>
          )}
          <span aria-hidden className="text-[10px] opacity-70">
            {isOpen ? '▾' : '▸'}
          </span>
        </button>
      ) : (
        <div className={cn(headingClass, 'px-1 py-[2px]')}>
          <span className="flex-1">{facet.label}</span>
          {selectedCount > 0 && (
            <Badge size="sm" variant="neutral">
              {selectedCount}
            </Badge>
          )}
        </div>
      )}
      {isOpen && (
        <ul className="m-0 flex list-none flex-col gap-[2px] p-0">
          {facet.options.map((option) => {
            const isSelected = selected.includes(option.value);
            const count = counts?.[option.value];
            return (
              <li key={option.value} className="flex items-center gap-2 px-1 py-[3px]">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(next) =>
                    onToggle(facet.id, option.value, next === true)
                  }
                  label={option.label}
                />
                {typeof count === 'number' && (
                  <span className="text-text-dim ml-auto font-mono text-[10px] tabular-nums">
                    {count}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
