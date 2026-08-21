import { useState } from 'react';
import { FlatList, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { fontFamily, fontSize, radii, space, vtColors } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon } from '../core/Icon';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export type SortDirection = 'asc' | 'desc';

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  /** Fixed column width in px; omit for `flex: 1`. */
  width?: number;
  /** Mono type — use for IDs, counts, dates. */
  mono?: boolean;
  /** Heading-coloured cell — use for the row's name column. */
  primary?: boolean;
  /** Enables the sort indicator + press handling for this column. */
  sortable?: boolean;
}

export type TableRow = Record<string, React.ReactNode> & { id?: string | number };

export interface TableProps {
  columns?: TableColumn[];
  rows?: TableRow[];
  onRowPress?: (row: TableRow, index: number) => void;
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
  /** Rendered instead of the list when `rows` is empty and not loading. Defaults to a generic `EmptyState`. */
  emptyState?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function rowId(row: TableRow, index: number): string | number {
  return row.id ?? index;
}

function CellCheckbox({
  checked,
  onPress,
  label,
}: {
  checked: boolean;
  onPress: () => void;
  label: string;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={{
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radii.xs,
        backgroundColor: checked ? vtColors.white : colors.surfaceInput,
        borderWidth: checked ? 0 : 1,
        borderColor: colors.lineStrong,
      }}
    >
      {checked && <Icon name="Check" size="xs" color={colors.textInverse} />}
    </Pressable>
  );
}

export function Table({
  columns = [],
  rows = [],
  onRowPress,
  dense = false,
  selectable = false,
  selectedIds,
  onSelectionChange,
  sortKey,
  sortDirection,
  onSortChange,
  loading = false,
  emptyState,
  style,
  testID,
}: TableProps) {
  const { colors } = useTheme();
  const [uncontrolledSort, setUncontrolledSort] = useState<{
    key: string;
    direction: SortDirection;
  } | null>(null);
  const activeSort =
    sortKey !== undefined ? { key: sortKey, direction: sortDirection ?? 'asc' } : uncontrolledSort;

  const pad = dense ? space[2] : space[4];
  const selected = selectedIds ?? [];
  const allIds = rows.map(rowId);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.includes(id));

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
    <View
      testID={testID}
      style={[
        {
          borderWidth: 1,
          borderColor: colors.lineHairline,
          borderRadius: radii.md,
          backgroundColor: colors.surfaceCard,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: colors.lineStrong,
          backgroundColor: colors.bgElevated,
        }}
      >
        {selectable && (
          <View style={{ width: 36, padding: pad, alignItems: 'flex-start' }}>
            <CellCheckbox
              checked={allSelected}
              onPress={toggleAll}
              label="Selecionar todas as linhas"
            />
          </View>
        )}
        {columns.map((c) => {
          const isActive = activeSort?.key === c.key;
          const content = (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                justifyContent:
                  c.align === 'right' ? 'flex-end' : c.align === 'center' ? 'center' : 'flex-start',
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamily.mono,
                  fontSize: fontSize.xs,
                  textTransform: 'uppercase',
                  color: colors.textTertiary,
                }}
              >
                {c.label}
              </Text>
              {c.sortable && (
                <Icon
                  name={isActive && activeSort.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'}
                  size="xs"
                  color={isActive ? colors.textSecondary : colors.textTertiary}
                />
              )}
            </View>
          );
          return (
            <View
              key={c.key}
              style={{ width: c.width, flex: c.width ? undefined : 1, padding: pad }}
            >
              {c.sortable ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Ordenar por ${c.label}${isActive ? `, ${activeSort.direction === 'asc' ? 'crescente' : 'decrescente'}` : ''}`}
                  onPress={() => toggleSort(c)}
                >
                  {content}
                </Pressable>
              ) : (
                content
              )}
            </View>
          );
        })}
      </View>

      {loading ? (
        <View style={{ padding: pad }}>
          <Skeleton lines={3} />
        </View>
      ) : rows.length === 0 ? (
        (emptyState ?? <EmptyState icon="Inbox" title="Nenhum resultado" />)
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(row, i) => String(rowId(row, i))}
          renderItem={({ item: row, index: i }) => {
            const id = rowId(row, i);
            const Row = onRowPress ? Pressable : View;
            return (
              <Row
                {...(onRowPress ? { onPress: () => onRowPress(row, i) } : {})}
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: i === rows.length - 1 ? 0 : 1,
                  borderBottomColor: colors.lineHairline,
                }}
              >
                {selectable && (
                  <View style={{ width: 36, padding: pad, alignItems: 'flex-start' }}>
                    <CellCheckbox
                      checked={selected.includes(id)}
                      onPress={() => toggleRow(id)}
                      label={`Selecionar linha ${i + 1}`}
                    />
                  </View>
                )}
                {columns.map((c) => (
                  <View
                    key={c.key}
                    style={{ width: c.width, flex: c.width ? undefined : 1, padding: pad }}
                  >
                    {typeof row[c.key] === 'string' || typeof row[c.key] === 'number' ? (
                      <Text
                        style={{
                          fontFamily: c.mono ? fontFamily.mono : fontFamily.sans,
                          fontSize: c.mono ? fontSize.sm : fontSize.md,
                          color: c.primary ? colors.textHeading : colors.textSecondary,
                          textAlign: c.align,
                        }}
                      >
                        {row[c.key]}
                      </Text>
                    ) : (
                      row[c.key]
                    )}
                  </View>
                ))}
              </Row>
            );
          }}
        />
      )}
    </View>
  );
}
