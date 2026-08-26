import type { Meta, StoryObj } from '@storybook/react';
import { SearchField } from './SearchField';

const meta: Meta<typeof SearchField> = {
  title: 'Core/SearchField',
  component: SearchField,
};

export default meta;
type Story = StoryObj<typeof SearchField>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <SearchField />
    </div>
  ),
};
