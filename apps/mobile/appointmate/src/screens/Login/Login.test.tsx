import { FirebaseError } from 'firebase/app';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fireEvent, render, screen, waitFor } from '../../test-utils';
import { login } from '../../services/authService';
import type { AuthStackParamList } from '../../navigation/types';
import { Login } from './Login';

jest.mock('../../services/authService', () => ({
  login: jest.fn(),
}));

const mockedLogin = login as jest.Mock;

type LoginProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const mockNavigation = { navigate: jest.fn() } as unknown as LoginProps['navigation'];
const mockRoute = { key: 'Login', name: 'Login' } as unknown as LoginProps['route'];

// This environment's Jest/react-test-renderer combo is slow to flush
// re-renders across the KeyboardAvoidingView/Paper/Navigation/SafeArea
// provider tree — the state-transition assertions below need more room
// than the 5s Jest default to avoid flaking (paired with a longer
// per-test timeout, passed as each affected it()'s third argument).
const ASYNC_TIMEOUT = { timeout: 15000 };

describe('Login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders email and password fields and the submit button', () => {
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    expect(screen.getByTestId('login-email-input')).toBeTruthy();
    expect(screen.getByTestId('login-password-input')).toBeTruthy();
    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('updates email and password as the user types', () => {
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    const emailInput = screen.getByTestId('login-email-input');
    const passwordInput = screen.getByTestId('login-password-input');

    fireEvent.changeText(emailInput, 'user@example.com');
    fireEvent.changeText(passwordInput, 'secret123');

    expect(emailInput.props.value).toBe('user@example.com');
    expect(passwordInput.props.value).toBe('secret123');
  });

  it('does not show a loading indicator until a submission is made', () => {
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    expect(screen.queryByTestId('login-loading-indicator')).toBeNull();
  });

  it('does not call login when submitting with empty fields', () => {
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    fireEvent.press(screen.getByText('Entrar'));

    expect(mockedLogin).not.toHaveBeenCalled();
  });

  it('calls authService.login with the typed credentials on submit', async () => {
    mockedLogin.mockResolvedValue({ uid: 'abc123', email: 'user@example.com' });
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    fireEvent.changeText(screen.getByTestId('login-email-input'), 'user@example.com');
    fireEvent.changeText(screen.getByTestId('login-password-input'), 'secret123');
    fireEvent.press(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith('user@example.com', 'secret123');
    });
  });

  it('navigates to Register when "Criar conta" is pressed', () => {
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    fireEvent.press(screen.getByText('Criar conta'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });

  it('navigates to ForgotPassword when "Esqueceu a senha?" is pressed', () => {
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    fireEvent.press(screen.getByText('Esqueceu a senha?'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPassword');
  });

  it('shows a loading indicator while the login request is in flight', async () => {
    let resolveLogin: (value: { uid: string; email: string }) => void = () => {};
    mockedLogin.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogin = resolve;
        }),
    );
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    fireEvent.changeText(screen.getByTestId('login-email-input'), 'user@example.com');
    fireEvent.changeText(screen.getByTestId('login-password-input'), 'secret123');
    fireEvent.press(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(screen.getByTestId('login-loading-indicator')).toBeTruthy();
    });

    resolveLogin({ uid: 'abc123', email: 'user@example.com' });

    await waitFor(() => {
      expect(screen.queryByTestId('login-loading-indicator')).toBeNull();
    }, ASYNC_TIMEOUT);
  }, 20000);

  it('shows a friendly error message when login fails', async () => {
    mockedLogin.mockRejectedValue(new FirebaseError('auth/wrong-password', ''));
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    fireEvent.changeText(screen.getByTestId('login-email-input'), 'user@example.com');
    fireEvent.changeText(screen.getByTestId('login-password-input'), 'wrong');
    fireEvent.press(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(screen.getByText('E-mail ou senha incorretos.')).toBeTruthy();
    }, ASYNC_TIMEOUT);
  }, 20000);

  it('hides the loading indicator after a failed login', async () => {
    mockedLogin.mockRejectedValue(new FirebaseError('auth/wrong-password', ''));
    render(<Login navigation={mockNavigation} route={mockRoute} />);

    fireEvent.changeText(screen.getByTestId('login-email-input'), 'user@example.com');
    fireEvent.changeText(screen.getByTestId('login-password-input'), 'wrong');
    fireEvent.press(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(screen.queryByTestId('login-loading-indicator')).toBeNull();
    }, ASYNC_TIMEOUT);
  }, 20000);
});
