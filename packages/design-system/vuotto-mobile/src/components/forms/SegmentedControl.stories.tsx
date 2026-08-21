import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from './SegmentedControl';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Forms/SegmentedControl',
  component: SegmentedControl,
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState('d');
    return (
      <SegmentedControl
        value={value}
        onChange={setValue}
        options={[
          { value: 'd', label: 'Desktop', icon: 'Monitor' },
          { value: 'm', label: 'Mobile', icon: 'Smartphone' },
        ]}
      />
    );
  },
};
