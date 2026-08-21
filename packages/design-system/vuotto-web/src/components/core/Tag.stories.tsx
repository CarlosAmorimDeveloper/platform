import { useState } from 'react';
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
      <div style={{ display: 'flex', gap: 8 }}>
        {options.map((o) => (
          <Tag key={o} active={active === o} onClick={() => setActive(o)}>
            {o}
          </Tag>
        ))}
      </div>
    );
  },
};

export const Removable: Story = {
  render: function Render() {
    const [tags, setTags] = useState(['offline-first', 'webhook', 'schema']);
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {tags.map((t) => (
          <Tag key={t} onRemove={() => setTags((prev) => prev.filter((x) => x !== t))}>
            {t}
          </Tag>
        ))}
      </div>
    );
  },
};
