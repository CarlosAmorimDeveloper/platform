import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Core/Breadcrumbs',
  component: Breadcrumbs,
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Breadcrumbs
        items={[
          { label: 'Início', onPress: () => {} },
          { label: 'Projetos', onPress: () => {} },
          { label: 'Detalhes' },
        ]}
      />
    </View>
  ),
};
