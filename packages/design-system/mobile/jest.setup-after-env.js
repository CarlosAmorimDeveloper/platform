// Mock the ReactNative renderer shim to avoid loading the pre-built
// ReactNativeRenderer-dev (which has a hard version check against React 19.2.3
// but the workspace uses a newer React). We provide a no-op stub that satisfies
// the AnimatedProps._connectAnimatedView path.
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
