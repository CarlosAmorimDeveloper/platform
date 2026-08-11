// https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../../..');

const config = getDefaultConfig(projectRoot);

// Watch all files within the monorepo
config.watchFolders = [monorepoRoot];

// Resolve from app-local node_modules first, then monorepo root.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Force a single instance of react and react-native across the entire monorepo
// bundle. Both are pinned to the app-local node_modules.
//
// WHY resolveRequest and not extraNodeModules:
//   extraNodeModules is only a last-resort fallback — Metro checks it AFTER
//   nodeModulesPaths succeeds. If the specifier already exists anywhere in
//   node_modules it is found there first and extraNodeModules is never reached.
//   resolveRequest is called BEFORE nodeModulesPaths and intercepts
//   unconditionally.
//
// WHY pin react to app-local (not root):
//   react-native 0.81.5 ships a renderer built against React 19.1.0 and does
//   an exact version check: throws if React.version !== "19.1.0". The monorepo
//   root has react 19.2.5 (for the web app). Pinning to app-local ensures
//   the renderer sees exactly 19.1.0 from every import site.
//
// WHY 'react/*' and 'react-native/*' matter:
//   The automatic JSX transform imports 'react/jsx-runtime' and
//   'react/jsx-dev-runtime' as separate specifiers.
//   Codegen-transformed native components import
//   'react-native/Libraries/NativeComponent/NativeComponentRegistry' to
//   register their view configs. react-native-safe-area-context is hoisted to
//   the monorepo root, so without interception its transformed output resolves
//   react-native from the root copy and registers in the root's
//   ReactNativeViewConfigRegistry Map. The renderer (app-local react-native)
//   reads a different Map and never finds the entry, producing "View config
//   getter callback must be a function (received undefined)". Pinning both to
//   app-local makes registration and lookup use the same Map.
const appLocalNodeModules = path.resolve(projectRoot, 'node_modules');
const _originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react' || moduleName.startsWith('react/')) {
    return {
      type: 'sourceFile',
      filePath: require.resolve(moduleName, { paths: [appLocalNodeModules] }),
    };
  }
  if (moduleName === 'react-native' || moduleName.startsWith('react-native/')) {
    return {
      type: 'sourceFile',
      filePath: require.resolve(moduleName, { paths: [appLocalNodeModules] }),
    };
  }
  if (moduleName === 'react-native-paper' || moduleName.startsWith('react-native-paper/')) {
    return {
      type: 'sourceFile',
      filePath: require.resolve(moduleName, { paths: [appLocalNodeModules] }),
    };
  }
  if (_originalResolveRequest) {
    return _originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
