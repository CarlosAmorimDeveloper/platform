import { Text } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { fireEvent, render, screen } from '../../test-utils';
import { AuthProvider, useAuth } from './AuthContext';

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('../../services/firebase', () => ({
  auth: { fake: 'auth-instance' },
}));

const mockedOnAuthStateChanged = onAuthStateChanged as jest.Mock;
const mockedSignOut = signOut as jest.Mock;

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
    mockedOnAuthStateChanged.mockImplementation(() => jest.fn());

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId('loading').props.children).toBe('true');
  });

  it('resolves to no user when there is no session', () => {
    mockedOnAuthStateChanged.mockImplementation((_auth, callback) => {
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
    mockedOnAuthStateChanged.mockImplementation((_auth, callback) => {
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

  it('falls back to no email when the firebase user has none', () => {
    mockedOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback({ uid: 'abc123', email: null });
      return jest.fn();
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId('user-email').props.children).toBe('none');
  });

  it('unsubscribes from the auth listener on unmount', () => {
    const unsubscribe = jest.fn();
    mockedOnAuthStateChanged.mockImplementation(() => unsubscribe);

    const { unmount } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it('logout calls firebase signOut with the auth instance', () => {
    mockedOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback({ uid: 'abc123', email: 'user@example.com' });
      return jest.fn();
    });
    mockedSignOut.mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );
    fireEvent.press(screen.getByTestId('logout-trigger'));

    expect(mockedSignOut).toHaveBeenCalledWith({ fake: 'auth-instance' });
  });

  it('throws when useAuth is called outside an AuthProvider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<Consumer />)).toThrow('useAuth must be used within an AuthProvider');

    consoleErrorSpy.mockRestore();
  });
});
