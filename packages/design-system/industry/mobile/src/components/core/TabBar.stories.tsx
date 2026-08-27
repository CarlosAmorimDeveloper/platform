import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { TabBar } from './TabBar';

const meta: Meta<typeof TabBar> = {
  title: 'Core/TabBar',
  component: TabBar,
};

export default meta;
type Story = StoryObj<typeof TabBar>;

export const Default: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <TabBar
        current="home"
        items={[
          { id: 'home', label: 'Início' },
          { id: 'search', label: 'Buscar' },
          { id: 'profile', label: 'Perfil' },
        ]}
      />
    </View>
  ),
};
