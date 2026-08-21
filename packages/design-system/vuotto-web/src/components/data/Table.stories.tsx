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
  { key: 'name', label: 'Formulário', primary: true, sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'count', label: 'Respostas', mono: true, align: 'right' as const, sortable: true },
  { key: 'updated', label: 'Atualizado', mono: true, align: 'right' as const },
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
    updated: '4 min',
  },
  {
    id: 2,
    name: 'Checklist de entrega',
    status: <Badge tone="warning">Rascunho</Badge>,
    count: '0',
    updated: '2 h',
  },
  {
    id: 3,
    name: 'Auditoria trimestral',
    status: <Badge tone="info">v2.4.0</Badge>,
    count: '318',
    updated: '1 d',
  },
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
