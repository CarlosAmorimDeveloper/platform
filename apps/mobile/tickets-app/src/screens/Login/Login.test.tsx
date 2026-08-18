import { FirebaseError } from 'firebase/app';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fireEvent, render, screen, waitFor } from '../../test-utils';
import { login } from '../../services/authService';
import type { User } from '../../domain/user';
import type { AuthStackParamList } from '../../navigation/types';
import { Login } from './Login';

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () =>
  jest.fn().mockImplementation(() => ({
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    emit: jest.fn(),
  })),
);
jest.mock('../../services/firebase', () => ({ auth: {}, db: {} }));
jest.mock('../../services/authService', () => ({
  ...jest.requireActual('../../services/authService'),
  login: jest.fn(),
}));

const mockedLogin = login as jest.Mock;

type LoginProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const mockNavigation = { navigate: jest.fn() } as unknown as LoginProps['navigation'];
const mockRoute = { key: 'Login', name: 'Login' } as unknown as LoginProps['route'];

const ASYNC_TIMEOUT = { timeout: 30000 };

const mockUser: User = {
  uid: 'abc123',
  email: 'user@example.com',
  name: 'User',
  role: 'standard',
  workspaceId: 'ws-1',
};

describe('Login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders email and password fields', () => {
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    expect(screen.getByPlaceholderText('email@exemplo.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('Sua senha')).toBeTruthy();
    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('does not call login when submitting with empty fields', () => {
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    fireEvent.press(screen.getByText('Entrar'));

    expect(mockedLogin).not.toHaveBeenCalled();
  });

  it('calls authService.login with the typed credentials on submit', async () => {
    mockedLogin.mockResolvedValue(mockUser);
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'user@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Sua senha'), 'secret123');
    fireEvent.press(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith('user@example.com', 'secret123');
    });
  });

  it('shows a loading indicator while the login request is in flight', async () => {
    let resolveLogin: (value: User) => void = () => {};
    mockedLogin.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogin = resolve;
        }),
    );
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'user@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Sua senha'), 'secret123');
    fireEvent.press(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeTruthy();
    }, ASYNC_TIMEOUT);

    resolveLogin(mockUser);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).toBeNull();
    }, ASYNC_TIMEOUT);
  }, 40000);

  it('shows error on invalid credentials', async () => {
    mockedLogin.mockRejectedValue(new FirebaseError('auth/wrong-password', ''));
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'user@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Sua senha'), 'wrong');
    fireEvent.press(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(screen.getByText('E-mail ou senha incorretos.')).toBeTruthy();
    }, ASYNC_TIMEOUT);
  }, 40000);

  it('navigates to Register on link press', () => {
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    fireEvent.press(screen.getByText('Criar conta'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });

  it('navigates to ForgotPassword on link press', () => {
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    fireEvent.press(screen.getByText('Esqueceu a senha?'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPassword');
  });
});
