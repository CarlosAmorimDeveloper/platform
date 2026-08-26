import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';
import { Icon } from './Icon';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Core/SegmentedControl',
  component: SegmentedControl,
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const TextOnly: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('dia');
      return (
        <SegmentedControl
          name="periodo"
          options={['dia', 'semana', 'mes']}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    }
    return <Demo />;
  },
};

export const WithIcons: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('grid');
      return (
        <SegmentedControl
          name="visualizacao"
          options={[
            { value: 'grid', label: 'Grade', icon: <Icon name="grid-2x2" size="sm" /> },
            { value: 'list', label: 'Lista', icon: <Icon name="list" size="sm" /> },
          ]}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    }
    return <Demo />;
  },
};
