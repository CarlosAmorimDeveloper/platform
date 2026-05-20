'use strict';

// Load the real AnimatedProps but patch __makeNative to be a no-op.
// This prevents the native renderer (react-native's pre-built 19.2.3) from
// being loaded in Jest, which would otherwise throw an "Incompatible React
// versions" error when the workspace react is a newer minor version.
const AnimatedProps = jest.requireActual('react-native/Libraries/Animated/nodes/AnimatedProps');

const OriginalAnimatedProps = AnimatedProps.default ?? AnimatedProps;

// Patch __makeNative on the prototype to be a no-op in tests
if (OriginalAnimatedProps && OriginalAnimatedProps.prototype) {
  OriginalAnimatedProps.prototype.__makeNative = function () {
    // no-op: skip native driver setup to avoid loading the RN renderer
  };
}

module.exports = AnimatedProps;
