import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { SearchField } from './SearchField';

const meta: Meta<typeof SearchField> = {
  title: 'Core/SearchField',
  component: SearchField,
  parameters: { svgKnownIssue: true },
};

export default meta;
type Story = StoryObj<typeof SearchField>;

export const Default: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <SearchField />
    </View>
  ),
};
