import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState('daily');
    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        options={[
          { value: 'daily', label: 'Diário', meta: '06:00' },
          { value: 'weekly', label: 'Semanal' },
        ]}
      />
    );
  },
};
