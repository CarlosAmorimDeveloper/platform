import type { Preview, Decorator } from '@storybook/react';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '../src/theme';

const withProviders: Decorator = (Story) => (
  <SafeAreaProvider>
    <PaperProvider theme={theme}>
      <Story />
    </PaperProvider>
  </SafeAreaProvider>
);

const preview: Preview = {
  decorators: [withProviders],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
