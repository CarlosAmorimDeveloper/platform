import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '../core/IconButton';
import { Menu } from './Menu';

const meta: Meta<typeof Menu> = {
  title: 'Feedback/Menu',
  component: Menu,
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: function Render() {
    const [visible, setVisible] = useState(false);
    return (
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={<IconButton icon="ListFilter" label="Filtrar" onPress={() => setVisible(true)} />}
        items={[
          { label: 'Últimos 7 dias', onPress: () => setVisible(false) },
          { label: 'Últimos 30 dias', onPress: () => setVisible(false) },
          { label: 'Todos', onPress: () => setVisible(false) },
        ]}
      />
    );
  },
};
