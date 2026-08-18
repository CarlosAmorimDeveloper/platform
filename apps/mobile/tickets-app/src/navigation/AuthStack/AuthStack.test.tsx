import { fireEvent, render, screen, waitFor } from '../../test-utils';
import { AuthStack } from './AuthStack';

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () =>
  jest.fn().mockImplementation(() => ({
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    emit: jest.fn(),
  })),
);

jest.mock('../../services/firebase', () => ({ auth: {}, db: {} }));

describe('AuthStack', () => {
  it('renders Login as the initial route', () => {
    render(<AuthStack />);

    expect(screen.getByPlaceholderText('email@exemplo.com')).toBeTruthy();
    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('renders Register route', async () => {
    render(<AuthStack />);

    fireEvent.press(screen.getByText('Criar conta'));

    expect(screen.getByText('Cadastrar')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Seu nome completo')).toBeTruthy();
    });
  });

  it('renders ForgotPassword route', () => {
    render(<AuthStack />);

    fireEvent.press(screen.getByText('Esqueceu a senha?'));

    expect(screen.getByText('Enviar link')).toBeTruthy();
  });
});
