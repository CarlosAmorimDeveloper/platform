import type { StorybookConfig } from '@storybook/react-vite';
import type { Plugin } from 'vite';

// Virtual module that stubs react-native codegen APIs absent from react-native-web.
// Libraries like react-native-safe-area-context import these paths; in a browser
// context the native-component registration is a no-op.
// Vite's alias resolver runs before plugin resolveId hooks, so by the time
// our plugin sees the import, 'react-native' is already 'react-native-web'.
// Match both forms to be safe.
const codegenStubPlugin: Plugin = {
  name: 'react-native-codegen-stub',
  resolveId(id) {
    if (id.endsWith('/codegenNativeComponent')) {
      return '\0react-native-codegen-stub';
    }
  },
  load(id) {
    if (id === '\0react-native-codegen-stub') {
      return 'export default function codegenNativeComponent() { return null; }';
    }
  },
};

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Use TypeScript-based prop extraction so react-docgen's Babel parser
  // never loads babel.config.js (which references metro-react-native-babel-preset)
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      plugins: [codegenStubPlugin],
      resolve: {
        alias: {
          // Renders RN components in the browser via react-native-web
          'react-native': 'react-native-web',
        },
      },
      // react-native-web lives in this package's local node_modules (not hoisted).
      // Pre-bundling it here ensures Vite can resolve it when react-native-paper
      // (which lives in the root node_modules) imports it.
      optimizeDeps: {
        include: ['react-native-web'],
      },
    });
  },
};

export default config;
