import type { Preview, Decorator } from '@storybook/react';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '../src/theme';

// SafeAreaProvider só renderiza children quando insets != null.
// Em ambiente browser o NativeSafeAreaProvider (stub no-op) nunca dispara
// onInsetsChange, então insets ficaria null para sempre. initialMetrics
// garante que insets comece preenchido e os filhos sejam renderizados.
const INITIAL_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, bottom: 0, right: 0 },
};

const withProviders: Decorator = (Story) => (
  <SafeAreaProvider initialMetrics={INITIAL_METRICS}>
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
