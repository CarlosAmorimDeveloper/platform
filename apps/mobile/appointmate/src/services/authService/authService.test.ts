import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { login, logout, register, sendPasswordReset, subscribeToAuthChanges } from './authService';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('../firebase', () => ({
  auth: { currentUser: null },
}));

const mockedSignIn = signInWithEmailAndPassword as jest.Mock;
const mockedCreateUser = createUserWithEmailAndPassword as jest.Mock;
const mockedUpdateProfile = updateProfile as jest.Mock;
const mockedSendPasswordResetEmail = sendPasswordResetEmail as jest.Mock;
const mockedOnAuthStateChanged = onAuthStateChanged as jest.Mock;
const mockedSignOut = signOut as jest.Mock;

describe('authService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('calls signInWithEmailAndPassword with the given credentials', async () => {
      mockedSignIn.mockResolvedValue({ user: { uid: 'abc123', email: 'user@example.com' } });

      await login('user@example.com', 'secret123');

      expect(mockedSignIn).toHaveBeenCalledWith(expect.anything(), 'user@example.com', 'secret123');
    });

    it('returns the authenticated user uid and email', async () => {
      mockedSignIn.mockResolvedValue({ user: { uid: 'abc123', email: 'user@example.com' } });

      const result = await login('user@example.com', 'secret123');

      expect(result).toEqual({ uid: 'abc123', email: 'user@example.com' });
    });

    it('falls back to the provided email when the firebase user has no email', async () => {
      mockedSignIn.mockResolvedValue({ user: { uid: 'abc123', email: null } });

      const result = await login('user@example.com', 'secret123');

      expect(result.email).toBe('user@example.com');
    });

    it('propagates errors thrown by signInWithEmailAndPassword', async () => {
      const error = new Error('auth/wrong-password');
      mockedSignIn.mockRejectedValue(error);

      await expect(login('user@example.com', 'wrong')).rejects.toThrow(error);
    });
  });

  describe('register', () => {
    it('calls createUserWithEmailAndPassword with the given credentials', async () => {
      const fakeUser = { uid: 'abc123', email: 'user@example.com' };
      mockedCreateUser.mockResolvedValue({ user: fakeUser });
      mockedUpdateProfile.mockResolvedValue(undefined);

      await register('Ada Lovelace', 'user@example.com', 'secret123');

      expect(mockedCreateUser).toHaveBeenCalledWith(
        expect.anything(),
        'user@example.com',
        'secret123',
      );
    });

    it('sets the display name on the created user, trimmed', async () => {
      const fakeUser = { uid: 'abc123', email: 'user@example.com' };
      mockedCreateUser.mockResolvedValue({ user: fakeUser });
      mockedUpdateProfile.mockResolvedValue(undefined);

      await register('  Ada Lovelace  ', 'user@example.com', 'secret123');

      expect(mockedUpdateProfile).toHaveBeenCalledWith(fakeUser, { displayName: 'Ada Lovelace' });
    });

    it('returns the authenticated user uid and email', async () => {
      mockedCreateUser.mockResolvedValue({ user: { uid: 'abc123', email: 'user@example.com' } });
      mockedUpdateProfile.mockResolvedValue(undefined);

      const result = await register('Ada Lovelace', 'user@example.com', 'secret123');

      expect(result).toEqual({ uid: 'abc123', email: 'user@example.com' });
    });

    it('falls back to the provided email when the firebase user has no email', async () => {
      mockedCreateUser.mockResolvedValue({ user: { uid: 'abc123', email: null } });
      mockedUpdateProfile.mockResolvedValue(undefined);

      const result = await register('Ada Lovelace', 'user@example.com', 'secret123');

      expect(result.email).toBe('user@example.com');
    });

    it('propagates errors thrown by createUserWithEmailAndPassword', async () => {
      const error = new Error('auth/email-already-in-use');
      mockedCreateUser.mockRejectedValue(error);

      await expect(register('Ada Lovelace', 'user@example.com', 'secret123')).rejects.toThrow(
        error,
      );
      expect(mockedUpdateProfile).not.toHaveBeenCalled();
    });
  });

  describe('sendPasswordReset', () => {
    it('calls sendPasswordResetEmail with the given email', async () => {
      mockedSendPasswordResetEmail.mockResolvedValue(undefined);

      await sendPasswordReset('user@example.com');

      expect(mockedSendPasswordResetEmail).toHaveBeenCalledWith(
        expect.anything(),
        'user@example.com',
      );
    });

    it('propagates errors thrown by sendPasswordResetEmail', async () => {
      const error = new Error('auth/user-not-found');
      mockedSendPasswordResetEmail.mockRejectedValue(error);

      await expect(sendPasswordReset('user@example.com')).rejects.toThrow(error);
    });
  });

  describe('subscribeToAuthChanges', () => {
    it('maps a signed-in firebase user to uid/email', () => {
      mockedOnAuthStateChanged.mockImplementation((_auth, callback) => {
        callback({ uid: 'abc123', email: 'user@example.com' });
        return jest.fn();
      });
      const onChange = jest.fn();

      subscribeToAuthChanges(onChange);

      expect(onChange).toHaveBeenCalledWith({ uid: 'abc123', email: 'user@example.com' });
    });

    it('falls back to a null email when the firebase user has none', () => {
      mockedOnAuthStateChanged.mockImplementation((_auth, callback) => {
        callback({ uid: 'abc123', email: null });
        return jest.fn();
      });
      const onChange = jest.fn();

      subscribeToAuthChanges(onChange);

      expect(onChange).toHaveBeenCalledWith({ uid: 'abc123', email: null });
    });

    it('calls back with null when there is no session', () => {
      mockedOnAuthStateChanged.mockImplementation((_auth, callback) => {
        callback(null);
        return jest.fn();
      });
      const onChange = jest.fn();

      subscribeToAuthChanges(onChange);

      expect(onChange).toHaveBeenCalledWith(null);
    });

    it('returns the unsubscribe function from onAuthStateChanged', () => {
      const unsubscribe = jest.fn();
      mockedOnAuthStateChanged.mockImplementation(() => unsubscribe);

      const result = subscribeToAuthChanges(jest.fn());

      expect(result).toBe(unsubscribe);
    });
  });

  describe('logout', () => {
    it('calls signOut with the auth instance', async () => {
      mockedSignOut.mockResolvedValue(undefined);

      await logout();

      expect(mockedSignOut).toHaveBeenCalledWith(expect.anything());
    });

    it('propagates errors thrown by signOut', async () => {
      const error = new Error('network-error');
      mockedSignOut.mockRejectedValue(error);

      await expect(logout()).rejects.toThrow(error);
    });
  });
});
