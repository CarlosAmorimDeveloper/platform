import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Tooltip } from './Tooltip';
import { Button } from './Button';

const meta: Meta<typeof Tooltip> = {
  title: 'Core/Tooltip',
  component: Tooltip,
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <View style={{ padding: 80 }}>
      <Tooltip label="Excluir item">
        <Button>Ação</Button>
      </Tooltip>
    </View>
  ),
};
