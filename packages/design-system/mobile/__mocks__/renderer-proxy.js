'use strict';

// Safe mock for RendererProxy that avoids loading the pre-built
// ReactNativeRenderer-dev (which has a hard version check against React 19.2.3
// but the workspace uses a newer React). All methods are no-ops or return safe
// defaults so that Animated components can render in Jest without native setup.

module.exports = {
  findNodeHandle: jest.fn(() => -1),
  findHostInstance_DEPRECATED: jest.fn(() => null),
  dispatchCommand: jest.fn(),
  sendAccessibilityEvent: jest.fn(),
  getNodeFromInternalInstanceHandle: jest.fn(() => null),
  getPublicInstanceFromInternalInstanceHandle: jest.fn(() => null),
  getPublicInstanceFromRootTag: jest.fn(() => null),
  isChildPublicInstance: jest.fn(() => false),
  renderElement: jest.fn(),
  unmountComponentAtNodeAndRemoveContainer: jest.fn(),
  unstable_batchedUpdates: jest.fn((fn) => fn()),
};
