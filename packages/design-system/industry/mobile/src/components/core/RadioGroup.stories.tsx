import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Core/RadioGroup',
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const StringOptions: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('mensal');
      return (
        <RadioGroup
          label="Periodicidade"
          options={['mensal', 'anual']}
          value={value}
          onValueChange={setValue}
        />
      );
    }
    return <Demo />;
  },
};

export const ObjectOptions: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('br');
      return (
        <RadioGroup
          label="Região"
          options={[
            { value: 'br', label: 'Brasil' },
            { value: 'us', label: 'Estados Unidos' },
            { value: 'eu', label: 'Europa' },
          ]}
          value={value}
          onValueChange={setValue}
        />
      );
    }
    return <Demo />;
  },
};
