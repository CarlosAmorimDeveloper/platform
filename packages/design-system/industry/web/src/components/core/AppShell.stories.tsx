import type { Meta, StoryObj } from '@storybook/react';
import { AppShell } from './AppShell';
import { Sidebar } from './Sidebar';

const meta: Meta<typeof AppShell> = {
  title: 'Core/AppShell',
  component: AppShell,
};

export default meta;
type Story = StoryObj<typeof AppShell>;

export const Default: Story = {
  render: () => (
    <div style={{ height: 360, border: '1px solid var(--color-divider)' }}>
      <AppShell
        sidebar={
          <Sidebar
            brand="Industry"
            items={[
              { id: 'home', label: 'Início' },
              { id: 'projects', label: 'Projetos' },
            ]}
            current="home"
          />
        }
        header={<span>Barra superior</span>}
      >
        <p>Conteúdo da página.</p>
      </AppShell>
    </div>
  ),
};

export const WithoutHeader: Story = {
  render: () => (
    <div style={{ height: 360, border: '1px solid var(--color-divider)' }}>
      <AppShell sidebar={<Sidebar brand="Industry" items={[{ id: 'home', label: 'Início' }]} />}>
        <p>Sem cabeçalho.</p>
      </AppShell>
    </div>
  ),
};
