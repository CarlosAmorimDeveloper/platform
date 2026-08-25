'use strict';

// Proxy to AnimatedMock so that useNativeDriver: true animations are replaced
// with immediate JS-side animations.  This prevents react-native's pre-built
// ReactNativeRenderer-dev (19.2.3) from being loaded and throwing an
// "Incompatible React versions" error when the workspace react is newer.
module.exports = require('react-native/Libraries/Animated/AnimatedMock');
