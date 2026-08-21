import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Forms/Switch',
  component: Switch,
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: function Render() {
    const [on, setOn] = useState(true);
    return (
      <Switch
        checked={on}
        onChange={setOn}
        label="Sincronização automática"
        description="Só em Wi-Fi"
      />
    );
  },
};
