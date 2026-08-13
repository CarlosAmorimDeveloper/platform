import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { login, register, sendPasswordReset } from './authService';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock('../firebase', () => ({
  auth: { currentUser: null },
}));

const mockedSignIn = signInWithEmailAndPassword as jest.Mock;
const mockedCreateUser = createUserWithEmailAndPassword as jest.Mock;
const mockedUpdateProfile = updateProfile as jest.Mock;
const mockedSendPasswordResetEmail = sendPasswordResetEmail as jest.Mock;

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
});
