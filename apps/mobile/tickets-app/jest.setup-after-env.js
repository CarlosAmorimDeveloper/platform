jest.mock('react-native/Libraries/Renderer/shims/ReactNative', () => ({
  default: {
    findNodeHandle: jest.fn(() => -1),
    findHostInstance_DEPRECATED: jest.fn(() => null),
    dispatchCommand: jest.fn(),
    sendAccessibilityEvent: jest.fn(),
    render: jest.fn(),
    unmountComponentAtNodeAndRemoveContainer: jest.fn(),
    unstable_batchedUpdates: jest.fn((fn) => fn()),
    isChildPublicInstance: jest.fn(() => false),
  },
}));
