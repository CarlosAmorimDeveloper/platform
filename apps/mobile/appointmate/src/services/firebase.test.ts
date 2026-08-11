jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({ app: true })),
}));

jest.mock('@firebase/auth', () => ({
  initializeAuth: jest.fn(() => ({ auth: true })),
  getReactNativePersistence: jest.fn((storage) => ({ persistence: true })),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({ db: true })),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  default: { getItem: jest.fn() },
}));

describe('Firebase service', () => {
  it('should import auth and db without throwing an error', () => {
    const { auth, db } = require('./firebase');
    expect(auth).toBeDefined();
    expect(db).toBeDefined();
  });

  it('should export firebaseConfig with all required properties', () => {
    const { firebaseConfig } = require('./firebase');
    expect(firebaseConfig).toHaveProperty('apiKey');
    expect(firebaseConfig).toHaveProperty('authDomain');
    expect(firebaseConfig).toHaveProperty('projectId');
    expect(firebaseConfig).toHaveProperty('storageBucket');
    expect(firebaseConfig).toHaveProperty('messagingSenderId');
    expect(firebaseConfig).toHaveProperty('appId');
    expect(firebaseConfig).toHaveProperty('measurementId');
  });
});
