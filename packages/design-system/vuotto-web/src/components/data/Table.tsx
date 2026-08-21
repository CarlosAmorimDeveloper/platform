import { useState } from 'react';
import type { HTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Icon } from '../core/Icon';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export type SortDirection = 'asc' | 'desc';

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  width?: string | number;
  /** Mono type — use for IDs, counts, dates. */
  mono?: boolean;
  /** Heading-coloured cell — use for the row's name column. */
  primary?: boolean;
  /**
   * Enables the sort indicator + click handling for this column. Table only
   * tracks *which* column/direction is active and reports it via
   * `onSortChange` — it does not sort `rows` itself, since the data is
   * frequently already sorted server-side.
   */
  sortable?: boolean;
}

export type TableRow = Record<string, ReactNode> & { id?: string | number };

/**
 * Data table with mono uppercase headers and hairline rows.
 * @startingPoint section="Data" subtitle="Form responses table" viewport="700x300"
 */
export interface TableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  columns?: TableColumn[];
  rows?: TableRow[];
  onRowClick?: (row: TableRow, index: number) => void;
  dense?: boolean;
  /** Renders a leading checkbox column; selection state is controlled. */
  selectable?: boolean;
  selectedIds?: (string | number)[];
  onSelectionChange?: (ids: (string | number)[]) => void;
  sortKey?: string;
  sortDirection?: SortDirection;
  onSortChange?: (key: string, direction: SortDirection) => void;
  /** Renders `Skeleton` rows instead of `rows`. */
  loading?: boolean;
  /** Rendered instead of the body when `rows` is empty and not loading. Defaults to a generic `EmptyState`. */
  emptyState?: ReactNode;
  /** Caps the scroll container's height, keeping the header sticky above it. */
  maxHeight?: string | number;
  style?: CSSProperties;
}

function rowId(row: TableRow, index: number): string | number {
  return row.id ?? index;
}

function HeaderCheckbox({
  checked,
  indeterminate,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
  label: string;
}) {
  const on = checked || indeterminate;
  return (
    <input
      type="checkbox"
      checked={checked}
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={label}
      onChange={onChange}
      ref={(node) => {
        if (node) node.indeterminate = indeterminate;
      }}
      style={{
        appearance: 'none',
        WebkitAppearance: 'none',
        width: 16,
        height: 16,
        margin: 0,
        borderRadius: 'var(--radius-xs)',
        background: on ? 'var(--vt-white)' : 'var(--surface-input)',
        border: `1px solid ${on ? 'transparent' : 'var(--line-strong)'}`,
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center',
      }}
    />
  );
}

export function Table({
  columns = [],
  rows = [],
  onRowClick,
  dense = false,
  selectable = false,
  selectedIds,
  onSelectionChange,
  sortKey,
  sortDirection,
  onSortChange,
  loading = false,
  emptyState,
  maxHeight,
  style,
  ...rest
}: TableProps) {
  const [hover, setHover] = useState(-1);
  const [uncontrolledSort, setUncontrolledSort] = useState<{
    key: string;
    direction: SortDirection;
  } | null>(null);
  const activeSort =
    sortKey !== undefined ? { key: sortKey, direction: sortDirection ?? 'asc' } : uncontrolledSort;

  const pad = dense ? '8px 14px' : '14px 16px';
  const selected = selectedIds ?? [];
  const allIds = rows.map(rowId);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.includes(id));
  const someSelected = !allSelected && allIds.some((id) => selected.includes(id));
  const colCount = columns.length + (selectable ? 1 : 0);

  function toggleSort(column: TableColumn) {
    if (!column.sortable) return;
    const nextDirection: SortDirection =
      activeSort?.key === column.key && activeSort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange?.(column.key, nextDirection);
    if (sortKey === undefined) setUncontrolledSort({ key: column.key, direction: nextDirection });
  }

  function toggleAll() {
    onSelectionChange?.(allSelected ? [] : allIds);
  }

  function toggleRow(id: string | number) {
    onSelectionChange?.(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id],
    );
  }

  return (
    <div
      style={{
        border: '1px solid var(--line-hairline)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-card)',
        backdropFilter: 'var(--glass-blur)',
        boxShadow: 'var(--shadow-inset-top)',
        overflow: maxHeight ? 'auto' : 'hidden',
        maxHeight,
        ...style,
      }}
      {...rest}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {selectable && (
              <th
                style={{
                  width: 40,
                  padding: pad,
                  borderBottom: '1px solid var(--line-strong)',
                  position: maxHeight ? 'sticky' : 'static',
                  top: 0,
                  background: 'var(--bg-elevated)',
                  zIndex: 1,
                }}
              >
                <HeaderCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  label="Selecionar todas as linhas"
                />
              </th>
            )}
            {columns.map((c) => {
              const isActive = activeSort?.key === c.key;
              return (
                <th
                  key={c.key}
                  aria-sort={
                    isActive
                      ? activeSort.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : c.sortable
                        ? 'none'
                        : undefined
                  }
                  style={{
                    textAlign: c.align || 'left',
                    padding: pad,
                    font: 'var(--label-mono)',
                    letterSpacing: 'var(--tracking-label)',
                    textTransform: 'uppercase',
                    color: 'var(--text-tertiary)',
                    borderBottom: '1px solid var(--line-strong)',
                    whiteSpace: 'nowrap',
                    width: c.width,
                    position: maxHeight ? 'sticky' : 'static',
                    top: 0,
                    background: 'var(--bg-elevated)',
                    zIndex: 1,
                    cursor: c.sortable ? 'pointer' : 'default',
                  }}
                  onClick={c.sortable ? () => toggleSort(c) : undefined}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      justifyContent:
                        c.align === 'right'
                          ? 'flex-end'
                          : c.align === 'center'
                            ? 'center'
                            : 'flex-start',
                    }}
                  >
                    {c.label}
                    {c.sortable && (
                      <Icon
                        name={
                          isActive && activeSort.direction === 'desc'
                            ? 'chevron-down'
                            : 'chevron-up'
                        }
                        size="xs"
                        color={isActive ? 'var(--text-secondary)' : 'var(--text-tertiary)'}
                      />
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={colCount} style={{ padding: pad }}>
                <Skeleton lines={3} />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={colCount} style={{ padding: 0 }}>
                {emptyState ?? <EmptyState icon="inbox" title="Nenhum resultado" />}
              </td>
            </tr>
          ) : (
            rows.map((r, i) => {
              const id = rowId(r, i);
              return (
                <tr
                  key={id}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(-1)}
                  onClick={onRowClick ? () => onRowClick(r, i) : undefined}
                  style={{
                    background: hover === i ? 'var(--glass-2)' : 'transparent',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background var(--motion-hover)',
                  }}
                >
                  {selectable && (
                    <td
                      style={{
                        padding: pad,
                        borderBottom:
                          i === rows.length - 1 ? 'none' : '1px solid var(--line-hairline)',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <HeaderCheckbox
                        checked={selected.includes(id)}
                        indeterminate={false}
                        onChange={() => toggleRow(id)}
                        label={`Selecionar linha ${i + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      style={{
                        padding: pad,
                        textAlign: c.align || 'left',
                        borderBottom:
                          i === rows.length - 1 ? 'none' : '1px solid var(--line-hairline)',
                        font: c.mono
                          ? 'var(--weight-regular) var(--text-sm)/1.4 var(--font-mono)'
                          : 'var(--weight-regular) var(--text-md)/1.4 var(--font-sans)',
                        color: c.primary ? 'var(--text-heading)' : 'var(--text-secondary)',
                        verticalAlign: 'middle',
                      }}
                    >
                      {r[c.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
