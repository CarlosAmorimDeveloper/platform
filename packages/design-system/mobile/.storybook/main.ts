import fs from 'fs';
import path from 'path';
import type { StorybookConfig } from '@storybook/react-vite';
import type { Plugin } from 'vite';

// ---------------------------------------------------------------------------
// Locate the react-native-vector-icons Fonts directory so Storybook can serve
// MaterialCommunityIcons.ttf as a static file at /fonts/. Using staticDirs
// instead of a base64 data URL avoids embedding ~1.5 MB of inline content in
// iframe.html, which can cause Chromatic to time out loading the preview iframe.
// ---------------------------------------------------------------------------
let fontStaticDir: { from: string; to: string } | null = null;
for (const root of [process.cwd(), path.resolve(process.cwd(), '../../..')]) {
  const candidate = path.join(root, 'node_modules/react-native-vector-icons/Fonts');
  if (fs.existsSync(candidate)) {
    fontStaticDir = { from: candidate, to: '/fonts' };
    break;
  }
}

// ---------------------------------------------------------------------------
// Stub: react-native codegen APIs absent from react-native-web
// ---------------------------------------------------------------------------
// react-native-safe-area-context imports 'react-native/Libraries/Utilities/codegenNativeComponent'.
// Vite's alias rewrites 'react-native' → 'react-native-web' before plugin resolveId runs,
// so we match the aliased form too. The returned component must forward props.children
// so SafeAreaProvider renders its subtree correctly.
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

// ---------------------------------------------------------------------------
// Stub: MaterialCommunityIcons for the web
// ---------------------------------------------------------------------------
// react-native-paper's MaterialCommunityIcon.js resolves icons via a dynamic
// require() cascade at module-evaluation time:
//   loadIconModule() → require('@react-native-vector-icons/...')
//                     → require('@expo/vector-icons/...')
//                     → require('react-native-vector-icons/MaterialCommunityIcons')
//                     → null (FallbackIcon, renders □)
//
// The require() calls are processed by esbuild during dep pre-bundling, NOT by
// the Vite plugin pipeline. We therefore need both:
//   1. A Vite plugin  → intercepts the imports for Rollup (production build)
//   2. An esbuild plugin → intercepts them during optimizeDeps pre-bundling (dev server)
//
// Both stubs render a <span> using the MaterialCommunityIcons web font (loaded
// via preview-head.html @font-face) to show the correct glyph for each icon name.
// The glyph map (icon name → unicode codepoint) is read from the installed
// react-native-vector-icons package at config-load time and inlined.

const ICON_MODULE_IDS = [
  '@react-native-vector-icons/material-design-icons',
  '@expo/vector-icons/MaterialCommunityIcons',
  'react-native-vector-icons/MaterialCommunityIcons',
];

function buildIconStub(glyphMapStr: string): string {
  return `import React from 'react';
const glyphs = ${glyphMapStr};
// Deliberately ignores the RN \`style\` prop to avoid passing any non-string keys
// (e.g. array indices from StyleSheet.create) to React DOM's setValueForStyles,
// which throws on indexed property assignment.
function MCIcons({ name, size, color, pointerEvents, testID }) {
  const code = glyphs[name];
  const char = code != null ? String.fromCodePoint(code) : '\\u25A1';
  return React.createElement('span', {
    'data-testid': testID,
    style: {
      fontFamily: 'MaterialCommunityIcons',
      fontSize: size || 24,
      color: color || 'black',
      lineHeight: 1,
      userSelect: 'none',
      pointerEvents: pointerEvents || 'none',
    }
  }, char);
}
MCIcons.displayName = 'MCIcons';
export default MCIcons;`;
}

function makeViteIconPlugin(stub: string): Plugin {
  return {
    name: 'react-native-vector-icons-web',
    resolveId(id) {
      if (ICON_MODULE_IDS.includes(id)) return '\0rnvi-mci';
    },
    load(id) {
      if (id === '\0rnvi-mci') return stub;
    },
  };
}

// ---------------------------------------------------------------------------
// Storybook config
// ---------------------------------------------------------------------------
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: { name: '@storybook/react-vite', options: {} },
  // Serve the Fonts directory as /fonts/ so preview-head.html can reference
  // MaterialCommunityIcons.ttf via a normal URL instead of a base64 data URI.
  // A data URI embeds ~1.5 MB inline in iframe.html, which can cause Chromatic
  // to time out while the preview iframe loads.
  staticDirs: fontStaticDir ? [fontStaticDir] : [],
  // react-docgen-typescript avoids invoking Babel, which would pick up
  // babel.config.js referencing metro-react-native-babel-preset.
  typescript: { reactDocgen: 'react-docgen-typescript' },

  async viteFinal(config) {
    const { mergeConfig } = await import('vite');

    // Read the glyph map from the installed react-native-vector-icons package.
    // The package is hoisted to the workspace root node_modules, so we try the
    // current directory first (in case CWD is already workspace root) then
    // walk up to the monorepo root.
    let glyphMapStr = '{}';
    for (const root of [process.cwd(), path.resolve(process.cwd(), '../../..')]) {
      const p = path.join(
        root,
        'node_modules/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json',
      );
      if (fs.existsSync(p)) {
        glyphMapStr = fs.readFileSync(p, 'utf-8');
        break;
      }
    }

    const iconStub = buildIconStub(glyphMapStr);

    // esbuild filter that matches all three icon library IDs
    const iconFilter =
      /@react-native-vector-icons\/|@expo\/vector-icons\/MaterialCommunityIcons|react-native-vector-icons\/MaterialCommunityIcons/;

    return mergeConfig(config, {
      plugins: [makeViteIconPlugin(iconStub), codegenStubPlugin],
      resolve: {
        alias: {
          // Render React Native components in the browser via react-native-web
          'react-native': 'react-native-web',
        },
      },
      optimizeDeps: {
        // Pre-bundle react-native-web so Rollup finds it from root node_modules
        // when react-native-paper (which lives there) imports it.
        include: ['react-native-web'],
        // react-native-safe-area-context: its specs/ import codegenNativeComponent;
        //   esbuild doesn't run Vite plugins, so the stub never fires unless excluded.
        // react-native-vector-icons: ships .js files with Flow type annotations
        //   (e.g. `: ?Spec`) that esbuild cannot parse with any standard loader.
        //   All imports are intercepted by rnVectorIconsPlugin / esbuild plugin below.
        exclude: ['react-native-safe-area-context', 'react-native-vector-icons'],
        esbuildOptions: {
          // esbuild plugin that handles icon imports during dep pre-bundling.
          // react-native-paper's MaterialCommunityIcon.js calls require() inside
          // loadIconModule() at module-evaluation time. esbuild resolves these
          // statically; without this plugin they become failing runtime require()
          // calls in the browser and icons fall back to □.
          plugins: [
            {
              name: 'vector-icons-esbuild-stub',
              setup(build: import('esbuild').PluginBuild) {
                build.onResolve({ filter: iconFilter }, () => ({
                  path: 'rnvi-mci',
                  namespace: 'rnvi',
                }));
                build.onLoad({ filter: /.*/, namespace: 'rnvi' }, () => ({
                  contents: iconStub,
                  loader: 'jsx',
                }));
              },
            },
          ],
        },
      },
    });
  },
};

export default config;
