import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';

const meta: Meta<typeof DataTable> = {
  title: 'Core/DataTable',
  component: DataTable,
  parameters: { svgKnownIssue: true },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

const ROWS = [
  { id: 1, name: 'Ana Silva', role: 'Engenheira' },
  { id: 2, name: 'Bruno Costa', role: 'Designer' },
  { id: 3, name: 'Carla Nunes', role: 'Product Manager' },
];

export const Default: Story = {
  render: () => (
    <DataTable
      columns={[
        { key: 'name', label: 'Nome' },
        { key: 'role', label: 'Cargo' },
      ]}
      rows={ROWS}
    />
  ),
};

export const WithPagination: Story = {
  render: () => (
    <DataTable
      columns={[
        { key: 'name', label: 'Nome' },
        { key: 'role', label: 'Cargo' },
      ]}
      rows={ROWS}
      page={2}
      pageCount={5}
      total={48}
    />
  ),
};
