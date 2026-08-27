import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Core/Sidebar',
  component: Sidebar,
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 232, height: 320 }}>
      <Sidebar
        brand="Industry"
        current="projects"
        items={[
          { section: 'Workspace' },
          { id: 'home', label: 'Início' },
          { id: 'projects', label: 'Projetos' },
          { section: 'Conta' },
          { id: 'settings', label: 'Configurações' },
        ]}
        footer={<span style={{ fontSize: 12, opacity: 0.5 }}>v1.0.0</span>}
      />
    </div>
  ),
};
