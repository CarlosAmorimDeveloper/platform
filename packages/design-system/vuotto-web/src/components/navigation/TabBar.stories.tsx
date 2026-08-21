import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TabBar } from './TabBar';

const meta: Meta<typeof TabBar> = {
  title: 'Navigation/TabBar',
  component: TabBar,
};

export default meta;
type Story = StoryObj<typeof TabBar>;

export const Default: Story = {
  render: function Render() {
    const [tab, setTab] = useState('forms');
    return (
      <TabBar
        value={tab}
        onChange={setTab}
        items={[
          { value: 'forms', label: 'Formulários', icon: 'list-checks' },
          { value: 'sync', label: 'Fila', icon: 'refresh-cw' },
          { value: 'profile', label: 'Perfil', icon: 'user' },
        ]}
      />
    );
  },
};
