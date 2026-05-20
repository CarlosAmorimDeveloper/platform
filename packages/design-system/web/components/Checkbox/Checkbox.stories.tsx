import type { Meta, StoryObj } from '@storybook/react';
import type React from 'react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function CheckboxWithState(args: Partial<React.ComponentProps<typeof Checkbox>>) {
  const [checked, setChecked] = useState(args.checked ?? false);
  return (
    <Checkbox
      label={args.label ?? ''}
      checked={checked}
      onChange={setChecked}
      disabled={args.disabled}
      indeterminate={args.indeterminate}
      sx={args.sx}
    />
  );
}

export const Default: Story = {
  render: (args) => <CheckboxWithState {...args} />,
  args: { label: 'Aceito os termos' },
};

export const Checked: Story = {
  render: (args) => <CheckboxWithState {...args} />,
  args: { label: 'Aceito os termos', checked: true },
};

export const Indeterminate: Story = {
  render: (args) => <CheckboxWithState {...args} />,
  args: { label: 'Selecionar todos', indeterminate: true },
};

export const Disabled: Story = {
  render: (args) => <CheckboxWithState {...args} />,
  args: { label: 'Opção desativada', disabled: true },
};
