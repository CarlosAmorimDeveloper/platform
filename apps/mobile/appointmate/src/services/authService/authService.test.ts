import { signInWithEmailAndPassword } from 'firebase/auth';
import { login } from './authService';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('../firebase', () => ({
  auth: { currentUser: null },
}));

const mockedSignIn = signInWithEmailAndPassword as jest.Mock;

describe('authService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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
