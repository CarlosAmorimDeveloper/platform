import type { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import type { RenderOptions } from '@testing-library/react-native';

// NOTE: tickets-app's version of this file wraps renders in NavigationContainer,
// SafeAreaProvider, and PaperProvider. This app doesn't wire up navigation or the
// design system's theme provider yet (see Tasks 3 and 4), so there's nothing to
// wrap with here. Extend `render` with an AllProviders wrapper once those land.
function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(ui, options);
}

export { customRender as render };
export * from '@testing-library/react-native';
