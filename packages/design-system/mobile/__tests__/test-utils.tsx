import React from 'react';
import type { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import type { RenderOptions } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '../src/theme';

function AllProviders({ children }: { children: ReactElement }) {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </SafeAreaProvider>
  );
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders as React.ComponentType, ...options });
}

export { customRender as render };
export * from '@testing-library/react-native';
