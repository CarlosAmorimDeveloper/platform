import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { IconButton } from '../core/IconButton';

const meta: Meta<typeof Tooltip> = {
  title: 'Feedback/Tooltip',
  component: Tooltip,
  argTypes: {
    side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: (args) => (
    <View style={{ padding: 60 }}>
      <Tooltip {...args}>
        <IconButton icon="Search" label="Buscar" />
      </Tooltip>
    </View>
  ),
  args: { label: 'Pressione e segure', side: 'top' },
};
