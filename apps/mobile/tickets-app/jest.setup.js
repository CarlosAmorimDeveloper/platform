// Suppress RN internal warnings in test output
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// AsyncStorage is a native module — provide a no-op mock for all test suites
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));
