import { fireEvent, render, screen, waitFor } from '../../test-utils';
import { login } from '../../services/authService';
import { Login } from './Login';

jest.mock('../../services/authService', () => ({
  login: jest.fn(),
}));

const mockedLogin = login as jest.Mock;

describe('Login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders email and password fields and the submit button', () => {
    render(<Login />);

    expect(screen.getByTestId('login-email-input')).toBeTruthy();
    expect(screen.getByTestId('login-password-input')).toBeTruthy();
    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('updates email and password as the user types', () => {
    render(<Login />);

    const emailInput = screen.getByTestId('login-email-input');
    const passwordInput = screen.getByTestId('login-password-input');

    fireEvent.changeText(emailInput, 'user@example.com');
    fireEvent.changeText(passwordInput, 'secret123');

    expect(emailInput.props.value).toBe('user@example.com');
    expect(passwordInput.props.value).toBe('secret123');
  });

  it('does not show a loading indicator until a submission is made', () => {
    render(<Login />);

    expect(screen.queryByTestId('login-loading-indicator')).toBeNull();
  });

  it('does not call login when submitting with empty fields', () => {
    render(<Login />);

    fireEvent.press(screen.getByText('Entrar'));

    expect(mockedLogin).not.toHaveBeenCalled();
  });

  it('calls authService.login with the typed credentials on submit', async () => {
    mockedLogin.mockResolvedValue({ uid: 'abc123', email: 'user@example.com' });
    render(<Login />);

    fireEvent.changeText(screen.getByTestId('login-email-input'), 'user@example.com');
    fireEvent.changeText(screen.getByTestId('login-password-input'), 'secret123');
    fireEvent.press(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith('user@example.com', 'secret123');
    });
  });

  it('does not crash when login rejects', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockedLogin.mockRejectedValue(new Error('auth/wrong-password'));
    render(<Login />);

    fireEvent.changeText(screen.getByTestId('login-email-input'), 'user@example.com');
    fireEvent.changeText(screen.getByTestId('login-password-input'), 'wrong');
    fireEvent.press(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
