import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Core/Breadcrumbs',
  component: Breadcrumbs,
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: () => (
    <Breadcrumbs
      items={[
        { label: 'Início', href: '/' },
        { label: 'Projetos', href: '/projetos' },
        { label: 'Detalhes' },
      ]}
    />
  ),
};

export const TwoLevels: Story = {
  render: () => <Breadcrumbs items={[{ label: 'Início', href: '/' }, { label: 'Perfil' }]} />,
};
