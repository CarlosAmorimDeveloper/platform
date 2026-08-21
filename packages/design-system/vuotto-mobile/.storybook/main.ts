import type { StorybookConfig } from '@storybook/react-vite';
import type { Plugin } from 'vite';

// react-native-svg's Fabric components import 'codegenNativeComponent' from
// react-native — Vite's alias rewrites that to react-native-web, which
// doesn't ship the path at all (unlike @ds/mobile's case, where it's
// react-native-safe-area-context hitting the same gap). Same stub, same
// reason: this is a Fabric-only codegen helper with no runtime behavior
// react-native-web needs, so a component that forwards children is enough.
const codegenStubPlugin: Plugin = {
  name: 'react-native-codegen-stub',
  resolveId(id) {
    if (id.endsWith('/codegenNativeComponent')) {
      return '\0react-native-codegen-stub';
    }
  },
  load(id) {
    if (id === '\0react-native-codegen-stub') {
      return `export default function codegenNativeComponent(name) {
  function NativeComponent(props) { return props.children ?? null; }
  NativeComponent.displayName = name;
  return NativeComponent;
}`;
    }
  },
};

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: { reactDocgen: 'react-docgen-typescript' },

  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      plugins: [codegenStubPlugin],
      resolve: {
        alias: {
          'react-native': 'react-native-web',
        },
      },
      optimizeDeps: {
        include: ['react-native-web'],
        // esbuild's dependency pre-bundler doesn't run Vite plugins, so
        // `codegenStubPlugin` never fires for these unless they're excluded
        // from it and left to Vite's normal (plugin-aware) resolution.
        exclude: ['react-native-svg', 'react-native-safe-area-context'],
      },
    });
  },
};

export default config;
