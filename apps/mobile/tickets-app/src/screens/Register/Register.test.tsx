import '@testing-library/react-native/extend-expect';
import { FirebaseError } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fireEvent, render, screen, waitFor } from '../../test-utils';
import { register } from '../../services/authService';
import type { User } from '../../domain/user';
import type { AuthStackParamList } from '../../navigation/types';
import { Register } from './Register';

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
  register: jest.fn(),
}));

const mockedRegister = register as jest.Mock;
const mockedGetItem = AsyncStorage.getItem as jest.Mock;

type RegisterProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const mockNavigation = { navigate: jest.fn() } as unknown as RegisterProps['navigation'];
const mockRoute = { key: 'Register', name: 'Register' } as unknown as RegisterProps['route'];

const ASYNC_TIMEOUT = { timeout: 30000 };

const mockUser: User = {
  uid: 'abc123',
  email: 'new@example.com',
  name: 'New User',
  role: 'admin',
  workspaceId: 'ws-1',
};

describe('Register', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders name, email and password fields', async () => {
    render(<Register navigation={mockNavigation} route={mockRoute} />);

    expect(screen.getByPlaceholderText('Seu nome completo')).toBeTruthy();
    expect(screen.getByPlaceholderText('email@exemplo.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('Mínimo 6 caracteres')).toBeTruthy();
    expect(screen.getByText('Cadastrar')).toBeTruthy();

    await waitFor(() => {
      expect(mockedGetItem).toHaveBeenCalledWith('first_user_registered');
    });
  });

  it('shows password validation error for short password', async () => {
    render(<Register navigation={mockNavigation} route={mockRoute} />);

    fireEvent.changeText(screen.getByPlaceholderText('Mínimo 6 caracteres'), '123');

    expect(screen.getByText('Mínimo de 6 caracteres')).toBeTruthy();

    await waitFor(() => {
      expect(mockedGetItem).toHaveBeenCalledWith('first_user_registered');
    });
  });

  it('shows admin notice for first user', async () => {
    mockedGetItem.mockResolvedValueOnce(null);
    render(<Register navigation={mockNavigation} route={mockRoute} />);

    await waitFor(() => {
      expect(
        screen.getByText('Esta será a primeira conta criada e terá perfil de Administrador.'),
      ).toBeTruthy();
    });
  });

  it('does not show admin notice when a user is already registered', async () => {
    mockedGetItem.mockResolvedValueOnce('true');
    render(<Register navigation={mockNavigation} route={mockRoute} />);

    await waitFor(() => {
      expect(mockedGetItem).toHaveBeenCalledWith('first_user_registered');
    });

    expect(
      screen.queryByText('Esta será a primeira conta criada e terá perfil de Administrador.'),
    ).toBeNull();
  });

  it('disables submit button when fields are invalid', async () => {
    render(<Register navigation={mockNavigation} route={mockRoute} />);

    expect(screen.getByText('Cadastrar')).toBeDisabled();

    fireEvent.changeText(screen.getByPlaceholderText('Seu nome completo'), 'Jane Doe');
    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'jane@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Mínimo 6 caracteres'), '123');

    expect(screen.getByText('Cadastrar')).toBeDisabled();

    await waitFor(() => {
      expect(mockedGetItem).toHaveBeenCalledWith('first_user_registered');
    });
  });

  it('enables submit button and calls authService.register when fields are valid', async () => {
    mockedRegister.mockResolvedValue(mockUser);
    render(<Register navigation={mockNavigation} route={mockRoute} />);

    fireEvent.changeText(screen.getByPlaceholderText('Seu nome completo'), 'Jane Doe');
    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'jane@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Mínimo 6 caracteres'), 'secret123');

    expect(screen.getByText('Cadastrar')).toBeEnabled();

    fireEvent.press(screen.getByText('Cadastrar'));

    await waitFor(() => {
      expect(mockedRegister).toHaveBeenCalledWith('Jane Doe', 'jane@example.com', 'secret123');
    });
  });

  it('shows a loading indicator while the registration request is in flight', async () => {
    let resolveRegister: (value: User) => void = () => {};
    mockedRegister.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRegister = resolve;
        }),
    );
    render(<Register navigation={mockNavigation} route={mockRoute} />);

    fireEvent.changeText(screen.getByPlaceholderText('Seu nome completo'), 'Jane Doe');
    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'jane@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Mínimo 6 caracteres'), 'secret123');
    fireEvent.press(screen.getByText('Cadastrar'));

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeTruthy();
    }, ASYNC_TIMEOUT);

    resolveRegister(mockUser);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).toBeNull();
    }, ASYNC_TIMEOUT);
  }, 40000);

  it('shows an error message when registration fails', async () => {
    mockedRegister.mockRejectedValue(new FirebaseError('auth/email-already-in-use', ''));
    render(<Register navigation={mockNavigation} route={mockRoute} />);

    fireEvent.changeText(screen.getByPlaceholderText('Seu nome completo'), 'Jane Doe');
    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'jane@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Mínimo 6 caracteres'), 'secret123');
    fireEvent.press(screen.getByText('Cadastrar'));

    await waitFor(() => {
      expect(screen.getByText('Este e-mail já está cadastrado.')).toBeTruthy();
    }, ASYNC_TIMEOUT);
  }, 40000);

  it('navigates back to Login on button press', async () => {
    render(<Register navigation={mockNavigation} route={mockRoute} />);

    fireEvent.press(screen.getByText('Voltar para o login'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');

    await waitFor(() => {
      expect(mockedGetItem).toHaveBeenCalledWith('first_user_registered');
    });
  });
});
