import { act, renderHook } from '@testing-library/react-native';
import { subscribeToUsers } from '../../services/authService';
import type { User } from '../../domain/user';
import { useUserList } from './useUserList';

jest.mock('../../services/authService');
jest.mock('../../services/firebase', () => ({ auth: {}, db: {} }));
jest.mock('../../store/useAuthStore', () => ({
  useAuthStore: (selector: (s: { user: { workspaceId: string } | null }) => unknown) =>
    selector({ user: { workspaceId: 'ws-1' } }),
}));

const mockSubscribeToUsers = subscribeToUsers as jest.Mock;

const mockUsers: User[] = [
  { uid: 'u1', email: 'alice@test.com', name: 'Alice', role: 'admin', workspaceId: 'ws-1' },
  { uid: 'u2', email: 'bob@test.com', name: 'Bob', role: 'standard', workspaceId: 'ws-1' },
];

describe('useUserList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSubscribeToUsers.mockReturnValue(jest.fn());
  });

  it('returns empty users array and loading true initially', () => {
    const { result } = renderHook(() => useUserList());
    expect(result.current.users).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('populates users and sets loading false when subscription fires', () => {
    mockSubscribeToUsers.mockImplementation(
      (_workspaceId: string, onData: (users: User[]) => void) => {
        onData(mockUsers);
        return jest.fn();
      },
    );
    const { result } = renderHook(() => useUserList());
    expect(result.current.users).toHaveLength(2);
    expect(result.current.loading).toBe(false);
  });

  it('sets error message when subscription fires onError', () => {
    mockSubscribeToUsers.mockImplementation(
      (_workspaceId: string, _onData: unknown, onError: () => void) => {
        onError();
        return jest.fn();
      },
    );
    const { result } = renderHook(() => useUserList());
    expect(result.current.error).toBeTruthy();
    expect(result.current.loading).toBe(false);
  });

  it('clearError resets error to null', () => {
    mockSubscribeToUsers.mockImplementation(
      (_workspaceId: string, _onData: unknown, onError: () => void) => {
        onError();
        return jest.fn();
      },
    );
    const { result } = renderHook(() => useUserList());
    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });

  it('calls the unsubscribe function on unmount', () => {
    const unsubscribe = jest.fn();
    mockSubscribeToUsers.mockReturnValue(unsubscribe);
    const { unmount } = renderHook(() => useUserList());
    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
