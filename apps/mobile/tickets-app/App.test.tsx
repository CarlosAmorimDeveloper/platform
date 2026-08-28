import { act, render, screen } from '@testing-library/react-native';
import { Alert, Text } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import App from './App';

jest.mock('./src/services/firebase', () => ({ auth: {}, db: {} }));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

function MockAuthStack() {
  return <Text>Login</Text>;
}
function MockAppStack() {
  return <Text>Dashboard</Text>;
}

// App.tsx's own responsibility is picking loading vs. AuthStack vs. AppStack
// from the resolved auth state — stand in for the stacks themselves so this
// file doesn't also need to mock their full descendant dependency tree
// (ticket/user Firestore listeners, etc.).
jest.mock('./src/navigation/AuthStack', () => ({ AuthStack: MockAuthStack }));
jest.mock('./src/navigation/AppStack', () => ({ AppStack: MockAppStack }));

const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
const mockGetDoc = getDoc as jest.Mock;

function fireAuthChange(user: { uid: string; email: string | null } | null) {
  const callback = mockOnAuthStateChanged.mock.calls[0]?.[1];
  return act(async () => {
    await callback?.(user);
  });
}

function renderApp() {
  const result = render(<App />);
  return {
    ...result,
    // react-navigation's internal async effects can throw an AggregateError
    // during RTL's automatic between-test cleanup — see the identical
    // safeUnmount workaround in AppStack.test.tsx.
    safeUnmount: () => {
      try {
        result.unmount();
      } catch {
        // no-op
      }
    },
  };
}

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAuthStateChanged.mockImplementation(() => jest.fn());
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('shows a spinner while resolving the initial auth state', () => {
    const { safeUnmount } = renderApp();
    expect(screen.UNSAFE_getByProps({ accessibilityRole: 'progressbar' })).toBeTruthy();
    safeUnmount();
  });

  it('renders the auth stack when there is no signed-in user', async () => {
    const { safeUnmount } = renderApp();

    await fireAuthChange(null);

    expect(screen.getByText('Login')).toBeTruthy();
    safeUnmount();
  });

  it('renders the app stack once the user profile loads', async () => {
    mockGetDoc.mockResolvedValue({
      data: () => ({ role: 'standard', name: 'Ana', workspace_id: 'ws-1' }),
    });

    const { safeUnmount } = renderApp();
    await fireAuthChange({ uid: 'user-1', email: 'ana@test.com' });

    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.queryByText('Login')).toBeNull();
    safeUnmount();
  });

  it('falls back to defaults when the user document has no data', async () => {
    mockGetDoc.mockResolvedValue({ data: () => undefined });

    const { safeUnmount } = renderApp();

    await expect(fireAuthChange({ uid: 'user-1', email: 'ana@test.com' })).resolves.not.toThrow();
    safeUnmount();
  });

  it('alerts and signs the user out locally when the profile fetch fails', async () => {
    mockGetDoc.mockRejectedValue(new Error('network down'));

    const { safeUnmount } = renderApp();
    await fireAuthChange({ uid: 'user-1', email: 'ana@test.com' });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Erro de conexão',
      'Não foi possível carregar seu perfil. Verifique sua conexão e tente novamente.',
    );
    expect(screen.getByText('Login')).toBeTruthy();
    safeUnmount();
  });

  it('unsubscribes from the auth listener on unmount', () => {
    const unsubscribe = jest.fn();
    mockOnAuthStateChanged.mockImplementation(() => unsubscribe);

    const { safeUnmount } = renderApp();
    safeUnmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it('falls back to an empty name and email when neither the document nor the auth user has one', async () => {
    mockGetDoc.mockResolvedValue({ data: () => ({ role: 'standard' }) });

    const { safeUnmount } = renderApp();

    await expect(fireAuthChange({ uid: 'user-1', email: null })).resolves.not.toThrow();
    safeUnmount();
  });

  it('reads the user document keyed by uid', async () => {
    mockGetDoc.mockResolvedValue({ data: () => ({ role: 'standard', name: 'Ana' }) });

    const { safeUnmount } = renderApp();
    await fireAuthChange({ uid: 'user-1', email: 'ana@test.com' });

    expect(doc).toHaveBeenCalledWith({}, 'users', 'user-1');
    safeUnmount();
  });
});
