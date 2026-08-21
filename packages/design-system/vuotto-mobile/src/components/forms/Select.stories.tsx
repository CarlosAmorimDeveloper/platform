import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Forms/Select',
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState<string | undefined>();
    return (
      <Select
        value={value}
        onChange={setValue}
        options={['Texto curto', 'Texto longo', 'Escolha única']}
      />
    );
  },
};
