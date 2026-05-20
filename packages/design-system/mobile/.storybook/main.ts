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
      // Must return a component function, not null — callers do:
      //   export default codegenNativeComponent('RNCSafeAreaProvider')
      // and React renders the result. Returning null causes error #130.
      return 'export default function codegenNativeComponent() { return function NativeComponent() { return null; }; }';
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
      optimizeDeps: {
        // Pre-bundle react-native-web so Rollup finds it from root node_modules
        // (react-native-paper lives there and traverses up the tree).
        include: ['react-native-web'],
        // Keep safe-area-context out of esbuild pre-bundling.
        // Its specs/ files import codegenNativeComponent via the react-native alias;
        // esbuild doesn't run Vite plugins so the virtual-module stub never fires
        // and the aliased path is treated as a literal file that doesn't exist.
        // Excluding it forces resolution through Vite's plugin pipeline at request
        // time, where codegenStubPlugin can intercept the import correctly.
        exclude: ['react-native-safe-area-context'],
      },
    });
  },
};

export default config;
