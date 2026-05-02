import { forwardRef, useCallback, type HTMLAttributes, type ReactNode } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';

/**
 * Tree — recursive expandable list. Pass a nested `items` tree; the component
 * handles expand/collapse and selection state. Both can be uncontrolled
 * (`defaultExpanded` / `defaultSelected`) or controlled (`expanded` /
 * `selected` + change callbacks).
 *
 * Implements the simple `aria-tree` pattern: `role="tree"` on the container,
 * `role="treeitem"` on each row, `aria-level`, `aria-expanded`, `aria-selected`.
 */

export interface TreeItem {
  id: string;
  label: ReactNode;
  /** Leading glyph or icon node. */
  icon?: ReactNode;
  /** Trailing badge / hint. */
  trailing?: ReactNode;
  children?: ReadonlyArray<TreeItem>;
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  /** Tree data. */
  items: ReadonlyArray<TreeItem>;
  /** Controlled set of expanded node ids. */
  expanded?: ReadonlySet<string>;
  /** Default expanded ids (uncontrolled). */
  defaultExpanded?: ReadonlyArray<string>;
  /** Fires with the new expanded set whenever a node toggles. */
  onExpandedChange?: (expanded: Set<string>) => void;
  /** Controlled selected node id. */
  selected?: string;
  /** Default selected (uncontrolled). */
  defaultSelected?: string;
  /** Fires with the selected node id. */
  onSelect?: (id: string) => void;
}

export const Tree = forwardRef<HTMLUListElement, TreeProps>(function Tree(
  {
    items,
    expanded: expandedProp,
    defaultExpanded,
    onExpandedChange,
    selected: selectedProp,
    defaultSelected,
    onSelect,
    className,
    ...props
  },
  ref,
) {
  const [expanded, setExpanded] = useControllableState<Set<string>>({
    value: expandedProp instanceof Set ? expandedProp : (expandedProp as Set<string> | undefined),
    defaultValue: defaultExpanded ? new Set(defaultExpanded) : new Set<string>(),
    onChange: onExpandedChange,
  });

  const [selected, setSelected] = useControllableState<string>({
    value: selectedProp,
    defaultValue: defaultSelected,
    onChange: onSelect,
  });

  const toggle = useCallback(
    (id: string) => {
      setExpanded((prev) => {
        const next = new Set(prev ?? []);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [setExpanded],
  );

  return (
    <ul
      ref={ref}
      role="tree"
      className={cn('flex flex-col gap-px text-[12px]', className)}
      {...props}
    >
      {items.map((item) => (
        <TreeItemRow
          key={item.id}
          item={item}
          level={1}
          expanded={expanded ?? new Set()}
          selected={selected}
          onToggle={toggle}
          onSelect={(id) => setSelected(id)}
        />
      ))}
    </ul>
  );
});

Tree.displayName = 'Tree';

interface TreeItemRowProps {
  item: TreeItem;
  level: number;
  expanded: ReadonlySet<string>;
  selected: string | undefined;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}

function TreeItemRow({ item, level, expanded, selected, onToggle, onSelect }: TreeItemRowProps) {
  const hasChildren = !!item.children && item.children.length > 0;
  const isExpanded = hasChildren && expanded.has(item.id);
  const isSelected = selected === item.id;

  return (
    <li role="none">
      <div
        role="treeitem"
        aria-level={level}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        tabIndex={isSelected ? 0 : -1}
        onClick={() => {
          onSelect(item.id);
          if (hasChildren) onToggle(item.id);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(item.id);
            if (hasChildren) onToggle(item.id);
          } else if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
            e.preventDefault();
            onToggle(item.id);
          } else if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
            e.preventDefault();
            onToggle(item.id);
          }
        }}
        style={{ paddingLeft: 4 + (level - 1) * 16 }}
        className={cn(
          'flex cursor-pointer items-center gap-[6px] rounded-xs py-[5px] pr-2 outline-none',
          'focus-visible:ring-accent-dim focus-visible:ring-[3px]',
          isSelected ? 'bg-accent-dim text-accent' : 'text-text hover:bg-panel-2',
        )}
      >
        <span aria-hidden className="text-text-dim grid w-3 place-items-center text-[10px]">
          {hasChildren ? (isExpanded ? '▾' : '▸') : ''}
        </span>
        {item.icon && (
          <span aria-hidden className="text-[12px] opacity-80">
            {item.icon}
          </span>
        )}
        <span className="flex-1 truncate">{item.label}</span>
        {item.trailing}
      </div>
      {hasChildren && isExpanded && (
        <ul role="group" className="flex flex-col gap-px">
          {item.children!.map((child) => (
            <TreeItemRow
              key={child.id}
              item={child}
              level={level + 1}
              expanded={expanded}
              selected={selected}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
