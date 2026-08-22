export default {
  // Resolves to null by default (not just an unimplemented jest.fn()) —
  // @vuotto/mobile's useTheme() calls getItem() on every render to read the
  // stored theme preference, and an unresolved mock crashes with "Cannot
  // read properties of undefined (reading 'then')".
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
  getAllKeys: jest.fn().mockResolvedValue([]),
  multiGet: jest.fn().mockResolvedValue([]),
  multiSet: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
};
