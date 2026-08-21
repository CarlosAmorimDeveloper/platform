import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: function Render() {
    const [tab, setTab] = useState('resp');
    return (
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'resp', label: 'Respostas', count: 1284 },
          { value: 'set', label: 'Configurações' },
        ]}
      />
    );
  },
};
