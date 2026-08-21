import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table, type SortDirection } from './Table';
import { Badge } from '../core/Badge';

const meta: Meta<typeof Table> = {
  title: 'Data/Table',
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table>;

const columns = [
  { key: 'name', label: 'Formulário', primary: true, sortable: true, width: 160 },
  { key: 'status', label: 'Status', width: 110 },
  {
    key: 'count',
    label: 'Respostas',
    mono: true,
    align: 'right' as const,
    sortable: true,
    width: 90,
  },
];

const rows = [
  {
    id: 1,
    name: 'Inspeção de campo',
    status: (
      <Badge tone="success" dot>
        Publicado
      </Badge>
    ),
    count: '1.284',
  },
  {
    id: 2,
    name: 'Checklist de entrega',
    status: <Badge tone="warning">Rascunho</Badge>,
    count: '0',
  },
  { id: 3, name: 'Auditoria trimestral', status: <Badge tone="info">v2.4.0</Badge>, count: '318' },
];

export const Default: Story = {
  args: { columns, rows },
};

export const Sortable: Story = {
  render: function Render() {
    const [sort, setSort] = useState<{ key: string; direction: SortDirection }>({
      key: 'name',
      direction: 'asc',
    });
    return (
      <Table
        columns={columns}
        rows={rows}
        sortKey={sort.key}
        sortDirection={sort.direction}
        onSortChange={(key, direction) => setSort({ key, direction })}
      />
    );
  },
};

export const Selectable: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<(string | number)[]>([]);
    return (
      <Table
        columns={columns}
        rows={rows}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
      />
    );
  },
};

export const Loading: Story = {
  args: { columns, rows: [], loading: true },
};

export const Empty: Story = {
  args: { columns, rows: [] },
};
