import { FlatList, Pressable, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { accentRamp, alpha, color, control, space } from '@industry/tokens';
import { Icon } from './Icon';

export interface Column<Row extends Record<string, ReactNode> = Record<string, ReactNode>> {
  key: string;
  label?: ReactNode;
  width?: number;
  /** Set false for a column that cannot be sorted. */
  sortable?: boolean;
  /** Custom cell renderer — return a badge, a link, formatted text. */
  render?: (row: Row) => ReactNode;
}

export interface DataTableProps<Row extends Record<string, ReactNode> = Record<string, ReactNode>> {
  columns?: Column<Row>[];
  rows?: Row[];
  sort?: { key: string; dir: 'asc' | 'desc' };
  onSort?: (key: string) => void;
  page?: number;
  pageCount?: number;
  onPage?: (page: number) => void;
  /** Record count shown at the left of the pager. */
  total?: number;
  /** Row above the table — search, filters, actions. */
  toolbar?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Sorting, filtering and paging are controlled — the table renders, you own the data. */
export function DataTable<Row extends Record<string, ReactNode> = Record<string, ReactNode>>({
  columns = [],
  rows = [],
  sort,
  onSort,
  page = 1,
  pageCount = 1,
  onPage,
  total,
  toolbar,
  style,
}: DataTableProps<Row>) {
  return (
    <View style={style}>
      {toolbar ? <View style={{ paddingBottom: space[3] }}>{toolbar}</View> : null}
      <View
        style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: color.divider }}
      >
        {columns.map((column) => (
          <View
            key={column.key}
            style={{
              width: column.width,
              flex: column.width ? undefined : 1,
              paddingVertical: space[2],
              paddingHorizontal: space[3],
            }}
          >
            {column.sortable === false ? (
              <ColumnLabel>{column.label}</ColumnLabel>
            ) : (
              <SortHeader
                columnKey={column.key}
                active={sort?.key === column.key}
                direction={sort?.key === column.key ? sort.dir : undefined}
                onPress={onSort ? () => onSort(column.key) : undefined}
              >
                {column.label}
              </SortHeader>
            )}
          </View>
        ))}
      </View>
      <FlatList
        data={rows}
        keyExtractor={(row, index) => String((row.id as string | number | undefined) ?? index)}
        renderItem={({ item: row }) => (
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: alpha(color.text, 8),
            }}
          >
            {columns.map((column) => (
              <View
                key={column.key}
                style={{
                  width: column.width,
                  flex: column.width ? undefined : 1,
                  padding: space[3],
                }}
              >
                {column.render ? (
                  <Cell>{column.render(row)}</Cell>
                ) : (
                  <Text style={{ fontSize: 15, color: color.text }}>{row[column.key]}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      />
      {pageCount > 1 ? (
        <Pagination page={page} pageCount={pageCount} total={total} onPage={onPage} />
      ) : null}
    </View>
  );
}

function Cell({ children }: { children?: ReactNode }) {
  return typeof children === 'string' || typeof children === 'number' ? (
    <Text style={{ fontSize: 15, color: color.text }}>{children}</Text>
  ) : (
    <>{children}</>
  );
}

function ColumnLabel({ children }: { children?: ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 11,
        letterSpacing: 0.9,
        textTransform: 'uppercase',
        color: alpha(color.text, 60),
      }}
    >
      {children}
    </Text>
  );
}

function SortHeader({
  columnKey,
  active,
  direction,
  onPress,
  children,
}: {
  columnKey: string;
  active: boolean;
  direction?: 'asc' | 'desc';
  onPress?: () => void;
  children?: ReactNode;
}) {
  return (
    <Pressable
      testID={`sort-header-${columnKey}`}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
    >
      <Text
        style={{
          fontSize: 11,
          letterSpacing: 0.9,
          textTransform: 'uppercase',
          color: active ? accentRamp['200'] : alpha(color.text, 60),
        }}
      >
        {children}
      </Text>
      {active ? (
        <Icon
          name={direction === 'desc' ? 'ChevronDown' : 'ChevronUp'}
          size="xs"
          color={accentRamp['200']}
        />
      ) : null}
    </Pressable>
  );
}

function Pagination({
  page,
  pageCount,
  total,
  onPage,
}: {
  page: number;
  pageCount: number;
  total?: number;
  onPage?: (page: number) => void;
}) {
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', gap: space[2], paddingTop: space[3] }}
    >
      <Text style={{ flex: 1, fontSize: 13, color: alpha(color.text, 55) }}>
        {total != null ? `${total} registros` : `Página ${page} de ${pageCount}`}
      </Text>
      <PagerButton disabled={page <= 1} onPress={onPage ? () => onPage(page - 1) : undefined}>
        Anterior
      </PagerButton>
      {Array.from({ length: pageCount }).map((_, index) => (
        <PagerButton
          key={index}
          current={page === index + 1}
          onPress={onPage ? () => onPage(index + 1) : undefined}
        >
          {String(index + 1)}
        </PagerButton>
      ))}
      <PagerButton
        disabled={page >= pageCount}
        onPress={onPage ? () => onPage(page + 1) : undefined}
      >
        Próxima
      </PagerButton>
    </View>
  );
}

function PagerButton({
  current,
  disabled,
  onPress,
  children,
}: {
  current?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children?: ReactNode;
}) {
  return (
    <Pressable
      testID={`pager-btn-${children}`}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: current }}
      onPress={onPress}
      style={{
        minWidth: control.heightSm,
        minHeight: control.heightSm,
        paddingHorizontal: space[2],
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: current ? color.accent : 'transparent',
        borderWidth: 1,
        borderColor: current ? color.accent : color.divider,
        opacity: disabled ? 0.35 : 1,
      }}
    >
      <Text style={{ fontSize: 14, color: current ? color.bg : color.text }}>{children}</Text>
    </Pressable>
  );
}
