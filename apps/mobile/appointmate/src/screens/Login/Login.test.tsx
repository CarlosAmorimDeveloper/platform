import { fireEvent, render, screen } from '../../test-utils';
import { Login } from './Login';

describe('Login', () => {
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

  it('does not crash when submitting with empty fields', () => {
    render(<Login />);

    expect(() => fireEvent.press(screen.getByText('Entrar'))).not.toThrow();
    expect(screen.queryByTestId('login-loading-indicator')).toBeNull();
  });
});
