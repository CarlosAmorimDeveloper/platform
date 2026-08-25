import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  async viteFinal(baseConfig) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(baseConfig, {
      resolve: {
        alias: {
          'react-native': 'react-native-web',
        },
        extensions: [
          '.web.js',
          '.web.ts',
          '.web.tsx',
          '.web.jsx',
          '.mjs',
          '.js',
          '.ts',
          '.jsx',
          '.tsx',
          '.json',
        ],
      },
    });
  },
};

export default config;
