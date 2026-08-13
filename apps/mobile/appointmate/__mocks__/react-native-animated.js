'use strict';

// Routes Animated to AnimatedMock so useNativeDriver:true doesn't trigger
// the native renderer version check.
module.exports = require('react-native/Libraries/Animated/AnimatedMock');
