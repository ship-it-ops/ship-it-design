'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';

/**
 * Tree — recursive expandable list. Pass a nested `items` tree; the component
 * handles expand/collapse and selection state. Both can be uncontrolled
 * (`defaultExpanded` / `defaultValue`) or controlled (`expanded` / `value` +
 * change callbacks).
 *
 * Implements the WAI-ARIA tree pattern with roving tabindex and the standard
 * keyboard model (Up/Down/Left/Right/Home/End/Enter/Space).
 */

const EMPTY_SET: ReadonlySet<string> = new Set();

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
  onExpandedChange?: (expanded: ReadonlySet<string>) => void;
  /** Controlled selected node id. */
  value?: string;
  /** Default selected (uncontrolled). */
  defaultValue?: string;
  /** Fires with the selected node id. */
  onValueChange?: (id: string) => void;
}

interface FlatItem {
  id: string;
  level: number;
  hasChildren: boolean;
  parentId: string | null;
}

function flattenVisible(
  items: ReadonlyArray<TreeItem>,
  expanded: ReadonlySet<string>,
  level: number,
  parentId: string | null,
  out: FlatItem[],
): void {
  for (const item of items) {
    const hasChildren = !!item.children && item.children.length > 0;
    out.push({ id: item.id, level, hasChildren, parentId });
    if (hasChildren && expanded.has(item.id)) {
      flattenVisible(item.children ?? [], expanded, level + 1, item.id, out);
    }
  }
}

export const Tree = forwardRef<HTMLUListElement, TreeProps>(function Tree(
  {
    items,
    expanded: expandedProp,
    defaultExpanded,
    onExpandedChange,
    value: valueProp,
    defaultValue,
    onValueChange,
    className,
    onKeyDown,
    ...props
  },
  ref,
) {
  const [expanded, setExpanded] = useControllableState<ReadonlySet<string>>({
    value: expandedProp,
    defaultValue: defaultExpanded ? new Set(defaultExpanded) : undefined,
    onChange: onExpandedChange,
  });

  const [value, setValue] = useControllableState<string>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });

  const expandedSet = expanded ?? EMPTY_SET;

  const flatVisible = useMemo<FlatItem[]>(() => {
    const out: FlatItem[] = [];
    flattenVisible(items, expandedSet, 1, null, out);
    return out;
  }, [items, expandedSet]);

  // Roving tabindex: track which item is the focus target.
  const [activeId, setActiveId] = useState<string | null>(null);

  // If activeId is no longer visible (parent collapsed), reset to a sensible default.
  useEffect(() => {
    if (activeId && !flatVisible.some((f) => f.id === activeId)) {
      setActiveId(null);
    }
  }, [activeId, flatVisible]);

  // The "tab stop" is: explicit activeId if visible, else the selected value if
  // visible, else the first visible item.
  const tabStopId = useMemo<string | null>(() => {
    if (activeId && flatVisible.some((f) => f.id === activeId)) return activeId;
    if (value && flatVisible.some((f) => f.id === value)) return value;
    return flatVisible[0]?.id ?? null;
  }, [activeId, flatVisible, value]);

  const listRef = useRef<HTMLUListElement | null>(null);
  const setRefs = useCallback(
    (node: HTMLUListElement | null) => {
      listRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLUListElement | null>).current = node;
    },
    [ref],
  );

  const focusItem = useCallback((id: string) => {
    const root = listRef.current;
    if (!root) return;
    const el = root.querySelector<HTMLElement>(`[data-treeitem-id="${CSS.escape(id)}"]`);
    el?.focus();
  }, []);

  const moveActive = useCallback(
    (id: string) => {
      setActiveId(id);
      // Focus on next paint so the DOM reflects any expansion change.
      queueMicrotask(() => focusItem(id));
    },
    [focusItem],
  );

  const toggle = useCallback(
    (id: string) => {
      setExpanded((prev) => {
        const next = new Set(prev ?? EMPTY_SET);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [setExpanded],
  );

  const expand = useCallback(
    (id: string) => {
      setExpanded((prev) => {
        const base = prev ?? EMPTY_SET;
        if (base.has(id)) return base;
        const next = new Set(base);
        next.add(id);
        return next;
      });
    },
    [setExpanded],
  );

  const collapse = useCallback(
    (id: string) => {
      setExpanded((prev) => {
        const base = prev ?? EMPTY_SET;
        if (!base.has(id)) return base;
        const next = new Set(base);
        next.delete(id);
        return next;
      });
    },
    [setExpanded],
  );

  const selectItem = useCallback(
    (id: string) => {
      setValue(id);
    },
    [setValue],
  );

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLUListElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (flatVisible.length === 0) return;

      const currentId = tabStopId;
      const currentIndex = currentId ? flatVisible.findIndex((f) => f.id === currentId) : -1;
      const current = currentIndex >= 0 ? flatVisible[currentIndex] : undefined;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const next = flatVisible[Math.min(flatVisible.length - 1, currentIndex + 1)];
          if (next) moveActive(next.id);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prev = flatVisible[Math.max(0, currentIndex - 1)];
          if (prev) moveActive(prev.id);
          break;
        }
        case 'ArrowRight': {
          if (!current) return;
          e.preventDefault();
          if (current.hasChildren) {
            if (!expandedSet.has(current.id)) {
              expand(current.id);
            } else {
              // Move to first child (the next item in the flat visible list).
              const child = flatVisible[currentIndex + 1];
              if (child && child.parentId === current.id) moveActive(child.id);
            }
          }
          break;
        }
        case 'ArrowLeft': {
          if (!current) return;
          e.preventDefault();
          if (current.hasChildren && expandedSet.has(current.id)) {
            collapse(current.id);
          } else if (current.parentId) {
            moveActive(current.parentId);
          }
          break;
        }
        case 'Home': {
          e.preventDefault();
          const first = flatVisible[0];
          if (first) moveActive(first.id);
          break;
        }
        case 'End': {
          e.preventDefault();
          const last = flatVisible[flatVisible.length - 1];
          if (last) moveActive(last.id);
          break;
        }
        case 'Enter':
        case ' ': {
          if (!current) return;
          e.preventDefault();
          selectItem(current.id);
          if (current.hasChildren) toggle(current.id);
          break;
        }
        default:
          break;
      }
    },
    [
      collapse,
      expand,
      expandedSet,
      flatVisible,
      moveActive,
      onKeyDown,
      selectItem,
      tabStopId,
      toggle,
    ],
  );

  return (
    <ul
      ref={setRefs}
      role="tree"
      className={cn('flex flex-col gap-px text-[12px]', className)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {items.map((item) => (
        <TreeItemRow
          key={item.id}
          item={item}
          level={1}
          expanded={expandedSet}
          selected={value}
          tabStopId={tabStopId}
          onFocusItem={setActiveId}
          onActivate={(id) => {
            setActiveId(id);
            selectItem(id);
          }}
          onToggle={toggle}
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
  tabStopId: string | null;
  onFocusItem: (id: string) => void;
  onActivate: (id: string) => void;
  onToggle: (id: string) => void;
}

function TreeItemRow({
  item,
  level,
  expanded,
  selected,
  tabStopId,
  onFocusItem,
  onActivate,
  onToggle,
}: TreeItemRowProps) {
  const hasChildren = !!item.children && item.children.length > 0;
  const isExpanded = hasChildren && expanded.has(item.id);
  const isSelected = selected === item.id;
  const isTabStop = tabStopId === item.id;

  return (
    <li role="none">
      {/* Keyboard activation lives on the parent <ul> via the APG roving-tabindex
          model, so this row's onClick has no per-element keydown handler. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        role="treeitem"
        data-treeitem-id={item.id}
        aria-level={level}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        tabIndex={isTabStop ? 0 : -1}
        onFocus={(e) => {
          if (e.target === e.currentTarget) onFocusItem(item.id);
        }}
        onClick={() => {
          onActivate(item.id);
          if (hasChildren) onToggle(item.id);
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
          {(item.children ?? []).map((child) => (
            <TreeItemRow
              key={child.id}
              item={child}
              level={level + 1}
              expanded={expanded}
              selected={selected}
              tabStopId={tabStopId}
              onFocusItem={onFocusItem}
              onActivate={onActivate}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
