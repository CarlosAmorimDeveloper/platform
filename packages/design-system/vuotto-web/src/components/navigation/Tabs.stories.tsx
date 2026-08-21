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

export const Overflow: Story = {
  render: function Render() {
    const [tab, setTab] = useState('a');
    return (
      <div style={{ maxWidth: 260 }}>
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((v) => ({
            value: v,
            label: `Aba ${v.toUpperCase()}`,
          }))}
        />
      </div>
    );
  },
};
