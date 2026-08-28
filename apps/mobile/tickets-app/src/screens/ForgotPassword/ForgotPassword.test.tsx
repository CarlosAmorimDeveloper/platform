import '@testing-library/react-native/extend-expect';
import { FirebaseError } from 'firebase/app';
import { Platform } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { act, fireEvent, render, screen, waitFor } from '../../test-utils';
import { sendPasswordReset } from '../../services/authService';
import type { AuthStackParamList } from '../../navigation/types';
import { ForgotPassword } from './ForgotPassword';

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
  sendPasswordReset: jest.fn(),
}));

const mockedSendPasswordReset = sendPasswordReset as jest.Mock;

type ForgotPasswordProps = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
} as unknown as ForgotPasswordProps['navigation'];
const mockRoute = {
  key: 'ForgotPassword',
  name: 'ForgotPassword',
} as unknown as ForgotPasswordProps['route'];

const ASYNC_TIMEOUT = { timeout: 30000 };

describe('ForgotPassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders email field', () => {
    render(<ForgotPassword navigation={mockNavigation} route={mockRoute} />);

    expect(screen.getByPlaceholderText('email@exemplo.com')).toBeTruthy();
    expect(screen.getByText('Enviar link')).toBeTruthy();
  });

  it('disables submit button when email is empty', () => {
    render(<ForgotPassword navigation={mockNavigation} route={mockRoute} />);

    expect(screen.getByText('Enviar link')).toBeDisabled();

    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'user@example.com');

    expect(screen.getByText('Enviar link')).toBeEnabled();
  });

  it('does not call sendPasswordReset when submitting with an empty email', () => {
    render(<ForgotPassword navigation={mockNavigation} route={mockRoute} />);

    fireEvent.press(screen.getByText('Enviar link'));

    expect(mockedSendPasswordReset).not.toHaveBeenCalled();
  });

  it('shows a loading indicator while the request is in flight', async () => {
    let resolveReset: () => void = () => {};
    mockedSendPasswordReset.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveReset = resolve;
        }),
    );
    render(<ForgotPassword navigation={mockNavigation} route={mockRoute} />);

    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'user@example.com');
    fireEvent.press(screen.getByText('Enviar link'));

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeTruthy();
    }, ASYNC_TIMEOUT);

    resolveReset();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).toBeNull();
    }, ASYNC_TIMEOUT);
  }, 40000);

  it('shows success snackbar on password reset sent', async () => {
    mockedSendPasswordReset.mockResolvedValue(undefined);
    render(<ForgotPassword navigation={mockNavigation} route={mockRoute} />);

    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'user@example.com');
    fireEvent.press(screen.getByText('Enviar link'));

    await waitFor(() => {
      expect(mockedSendPasswordReset).toHaveBeenCalledWith('user@example.com');
    });

    await waitFor(() => {
      expect(
        screen.getByText('Se este e-mail estiver cadastrado, você receberá um link em instantes.'),
      ).toBeTruthy();
    }, ASYNC_TIMEOUT);
  }, 40000);

  it('shows error snackbar on failure', async () => {
    mockedSendPasswordReset.mockRejectedValue(new FirebaseError('auth/invalid-email', ''));
    render(<ForgotPassword navigation={mockNavigation} route={mockRoute} />);

    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'not-an-email');
    fireEvent.press(screen.getByText('Enviar link'));

    await waitFor(() => {
      expect(screen.getByText('E-mail inválido.')).toBeTruthy();
    }, ASYNC_TIMEOUT);
  }, 40000);

  it('navigates back a moment after the reset link is sent', async () => {
    jest.useFakeTimers();
    mockedSendPasswordReset.mockResolvedValue(undefined);
    render(<ForgotPassword navigation={mockNavigation} route={mockRoute} />);

    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'user@example.com');
    await act(async () => {
      fireEvent.press(screen.getByText('Enviar link'));
    });

    expect(
      screen.getByText('Se este e-mail estiver cadastrado, você receberá um link em instantes.'),
    ).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockNavigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Login' }],
    });
    jest.useRealTimers();
  });

  it('resets the navigation stack to Login on "Voltar ao login" press', () => {
    render(<ForgotPassword navigation={mockNavigation} route={mockRoute} />);

    fireEvent.press(screen.getByText('Voltar ao login'));

    expect(mockNavigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  });

  it('navigates back when the AppBar back button is pressed', () => {
    render(<ForgotPassword navigation={mockNavigation} route={mockRoute} />);

    fireEvent.press(screen.getByLabelText('Voltar'));

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('renders on Android without throwing', () => {
    const originalOS = Platform.OS;
    Platform.OS = 'android';

    expect(() =>
      render(<ForgotPassword navigation={mockNavigation} route={mockRoute} />),
    ).not.toThrow();

    Platform.OS = originalOS;
  });
});
