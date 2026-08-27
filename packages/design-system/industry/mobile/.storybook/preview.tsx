import type { Preview } from '@storybook/react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { color } from '@industry/tokens';

const preview: Preview = {
  decorators: [
    (Story) => (
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 390, height: 844 },
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
        }}
      >
        <View style={{ flex: 1, backgroundColor: color.bg }}>
          <Story />
        </View>
      </SafeAreaProvider>
    ),
  ],
};

export default preview;
