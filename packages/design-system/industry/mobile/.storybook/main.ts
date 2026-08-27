import type { StorybookConfig } from '@storybook/react-vite';
import type { Plugin } from 'vite';
import type { PluginBuild } from 'esbuild';

const CODEGEN_STUB_SOURCE = `export default function codegenNativeComponent(name) {
  function NativeComponent(props) { return props.children ?? null; }
  NativeComponent.displayName = name;
  return NativeComponent;
}`;

// react-native-svg's Fabric components import 'codegenNativeComponent' from
// react-native — Vite's alias rewrites that to react-native-web, which
// doesn't ship the path at all (unlike @ds/mobile's case, where it's
// react-native-safe-area-context hitting the same gap). Same stub, same
// reason: this is a Fabric-only codegen helper with no runtime behavior
// react-native-web needs, so a component that forwards children is enough.
//
// This needs BOTH a Vite plugin (for Rollup's production build) and an
// esbuild plugin (for the dev server's dependency pre-bundling) — esbuild
// doesn't run Vite's resolveId/load hooks. Intercepting the import this way,
// rather than excluding react-native-svg from optimizeDeps entirely, matters:
// excluding the whole package also skips esbuild's CJS→ESM conversion for
// every other file inside it, including transform.js (a PEG.js-generated
// `module.exports = { parse }` file) — importers doing `import { parse }`
// against that raw CommonJS then fail in the browser with "does not provide
// an export named 'parse'".
const codegenStubPlugin: Plugin = {
  name: 'react-native-codegen-stub',
  resolveId(id) {
    if (id.endsWith('/codegenNativeComponent')) {
      return '\0react-native-codegen-stub';
    }
  },
  load(id) {
    if (id === '\0react-native-codegen-stub') {
      return CODEGEN_STUB_SOURCE;
    }
  },
};

const codegenStubEsbuildPlugin = {
  name: 'react-native-codegen-stub-esbuild',
  setup(build: PluginBuild) {
    build.onResolve({ filter: /\/codegenNativeComponent$/ }, () => ({
      path: 'react-native-codegen-stub',
      namespace: 'react-native-codegen-stub',
    }));
    build.onLoad({ filter: /.*/, namespace: 'react-native-codegen-stub' }, () => ({
      contents: CODEGEN_STUB_SOURCE,
      loader: 'js' as const,
    }));
  },
};

// react-native-svg/lib/module/fabric/NativeSvg{Renderable,View}Module.js call
// `TurboModuleRegistry.getEnforcing(...)` — react-native-web has no
// TurboModuleRegistry export at all. Both files are only reached via
// `require()` inside rarely-used geometry-introspection methods (getBBox,
// getCTM, toDataURL, ...) that lucide-react-native's icon rendering never
// calls, so a no-op stub is safe: it only needs to satisfy the static
// resolution these `require()` calls still trigger during bundling, not
// behave like the real native module.
const FABRIC_SVG_MODULE_STUB_SOURCE = `const noop = () => null;
export default {
  toDataURL: noop, getBBox: noop, getCTM: noop, getScreenCTM: noop,
  isPointInFill: noop, isPointInStroke: noop, getTotalLength: noop, getPointAtLength: noop,
};`;
const FABRIC_SVG_MODULE_FILTER = /\/fabric\/NativeSvg(Renderable|View)Module(\.js)?$/;

const fabricSvgModuleStubPlugin: Plugin = {
  name: 'react-native-svg-fabric-module-stub',
  resolveId(id) {
    if (FABRIC_SVG_MODULE_FILTER.test(id)) {
      return '\0react-native-svg-fabric-module-stub';
    }
  },
  load(id) {
    if (id === '\0react-native-svg-fabric-module-stub') {
      return FABRIC_SVG_MODULE_STUB_SOURCE;
    }
  },
};

const fabricSvgModuleStubEsbuildPlugin = {
  name: 'react-native-svg-fabric-module-stub-esbuild',
  setup(build: PluginBuild) {
    build.onResolve({ filter: FABRIC_SVG_MODULE_FILTER }, () => ({
      path: 'react-native-svg-fabric-module-stub',
      namespace: 'react-native-svg-fabric-module-stub',
    }));
    build.onLoad({ filter: /.*/, namespace: 'react-native-svg-fabric-module-stub' }, () => ({
      contents: FABRIC_SVG_MODULE_STUB_SOURCE,
      loader: 'js' as const,
    }));
  },
};

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: { reactDocgen: 'react-docgen-typescript' },

  async viteFinal(baseConfig) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(baseConfig, {
      plugins: [codegenStubPlugin, fabricSvgModuleStubPlugin],
      resolve: {
        alias: {
          'react-native': 'react-native-web',
        },
        // Metro resolves a `.web.js`/`.web.tsx` sibling over the default
        // file automatically (platform-extension resolution) — Vite has no
        // such behavior built in, so without this, react-native-svg and
        // react-native-safe-area-context both silently fall back to their
        // native (Fabric/TurboModule) entry points instead of the real,
        // DOM-based web implementations they ship alongside them. That's
        // why icons/SVG shapes were rendering as nothing: the native entry
        // point's leaf components got replaced by the codegen stub below,
        // which renders empty since the native `<Path>`/`<Circle>` etc.
        // have no children — the stub was never meant to be the thing
        // actually drawing shapes, it's a fallback for code the .web
        // files were supposed to make unreachable.
        extensions: [
          '.web.js',
          '.web.ts',
          '.web.tsx',
          '.web.jsx',
          '.mjs',
          '.js',
          '.mts',
          '.ts',
          '.jsx',
          '.tsx',
          '.json',
        ],
      },
      optimizeDeps: {
        include: ['react-native-web'],
        // react-native-safe-area-context has no esbuild-side interception
        // set up for it (only the codegenNativeComponent import matters
        // there, and it's low-traffic enough to just skip pre-bundling
        // entirely rather than plumb an esbuild plugin for it too).
        // react-native-svg stays pre-bundled (not excluded) — see the two
        // esbuild plugins below for why.
        exclude: ['react-native-safe-area-context'],
        esbuildOptions: {
          plugins: [codegenStubEsbuildPlugin, fabricSvgModuleStubEsbuildPlugin],
        },
      },
    });
  },
};

export default config;
