'use strict';
// Stub for react-native codegen APIs not present in react-native-web.
// react-native-safe-area-context (and other libraries) import this to register
// native view specs; in a browser context the registration is a no-op.
exports.__esModule = true;
exports.default = function codegenNativeComponent(name, _options) {
  function NativeComponent(props) {
    return props.children ?? null;
  }
  NativeComponent.displayName = name;
  return NativeComponent;
};
