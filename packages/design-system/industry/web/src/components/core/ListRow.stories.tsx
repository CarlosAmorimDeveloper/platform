import type { Meta, StoryObj } from '@storybook/react';
import { ListRow } from './ListRow';
import { Icon } from './Icon';

const meta: Meta<typeof ListRow> = {
  title: 'Core/ListRow',
  component: ListRow,
};

export default meta;
type Story = StoryObj<typeof ListRow>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <ListRow title="Relatório de vendas" meta="Atualizado há 2h" />
      <ListRow
        lead={<Icon name="folder" />}
        title="Contratos"
        meta="12 arquivos"
        trail={<Icon name="chevron-right" size="sm" />}
      />
    </div>
  ),
};
