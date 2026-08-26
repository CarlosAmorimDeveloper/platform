import { Text } from 'react-native';
import { logout, subscribeToAuthChanges } from '../../services/authService';
import { fireEvent, render, screen } from '../../test-utils';
import { AuthProvider, useAuth } from './AuthContext';

jest.mock('../../services/authService', () => ({
  subscribeToAuthChanges: jest.fn(),
  logout: jest.fn(),
}));

const mockedSubscribeToAuthChanges = subscribeToAuthChanges as jest.Mock;
const mockedLogout = logout as jest.Mock;

function Consumer() {
  const { user, loading, logout } = useAuth();
  return (
    <>
      <Text testID="loading">{String(loading)}</Text>
      <Text testID="user-uid">{user?.uid ?? 'none'}</Text>
      <Text testID="user-email">{user?.email ?? 'none'}</Text>
      <Text testID="logout-trigger" onPress={logout}>
        logout
      </Text>
    </>
  );
}

describe('AuthContext', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('starts in a loading state before the auth listener resolves', () => {
    mockedSubscribeToAuthChanges.mockImplementation(() => jest.fn());

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId('loading').props.children).toBe('true');
  });

  it('resolves to no user when there is no session', () => {
    mockedSubscribeToAuthChanges.mockImplementation((callback) => {
      callback(null);
      return jest.fn();
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId('loading').props.children).toBe('false');
    expect(screen.getByTestId('user-uid').props.children).toBe('none');
  });

  it('resolves to the current user uid and email when there is a session', () => {
    mockedSubscribeToAuthChanges.mockImplementation((callback) => {
      callback({ uid: 'abc123', email: 'user@example.com' });
      return jest.fn();
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId('user-uid').props.children).toBe('abc123');
    expect(screen.getByTestId('user-email').props.children).toBe('user@example.com');
  });

  it('unsubscribes from the auth listener on unmount', () => {
    const unsubscribe = jest.fn();
    mockedSubscribeToAuthChanges.mockImplementation(() => unsubscribe);

    const { unmount } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it('logout delegates to authService.logout', () => {
    mockedSubscribeToAuthChanges.mockImplementation((callback) => {
      callback({ uid: 'abc123', email: 'user@example.com' });
      return jest.fn();
    });
    mockedLogout.mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    fireEvent.press(screen.getByTestId('logout-trigger'));

    expect(mockedLogout).toHaveBeenCalled();
  });

  it('throws when useAuth is called outside an AuthProvider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<Consumer />)).toThrow('useAuth must be used within an AuthProvider');

    consoleErrorSpy.mockRestore();
  });
});
