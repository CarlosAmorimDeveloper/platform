import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Core/Tag',
  component: Tag,
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Filters: Story = {
  render: function Render() {
    const [active, setActive] = useState('Todos');
    const options = ['Todos', 'Publicados', 'Rascunhos'];
    return (
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {options.map((o) => (
          <Tag key={o} active={active === o} onPress={() => setActive(o)}>
            {o}
          </Tag>
        ))}
      </View>
    );
  },
};

export const Removable: Story = {
  render: function Render() {
    const [tags, setTags] = useState(['offline-first', 'webhook', 'schema']);
    return (
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {tags.map((t) => (
          <Tag key={t} onRemove={() => setTags((prev) => prev.filter((x) => x !== t))}>
            {t}
          </Tag>
        ))}
      </View>
    );
  },
};
