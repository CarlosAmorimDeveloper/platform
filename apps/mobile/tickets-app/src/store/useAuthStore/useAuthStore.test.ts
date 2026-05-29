import { signOut } from 'firebase/auth';
import { useAuthStore } from './useAuthStore';
import type { User } from '../../domain/user';

jest.mock('firebase/auth', () => ({ signOut: jest.fn().mockResolvedValue(undefined) }));
jest.mock('../../services/firebase', () => ({ auth: {} }));

const mockSignOut = signOut as jest.Mock;

const initialState = { user: null as User | null, isAuthenticated: false };

const mockUser: User = { uid: 'u1', email: 'alice@test.com', name: 'Alice', role: 'admin' };

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState(initialState);
    jest.clearAllMocks();
  });

  it('has null user and isAuthenticated false by default', () => {
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });

  it('setUser stores the user and sets isAuthenticated to true', () => {
    useAuthStore.getState().setUser(mockUser);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('setUser(null) clears user and sets isAuthenticated to false', () => {
    useAuthStore.setState({ user: mockUser, isAuthenticated: true });
    useAuthStore.getState().setUser(null);
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('logout calls firebase signOut', async () => {
    await useAuthStore.getState().logout();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
