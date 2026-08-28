import { act, waitFor } from '@testing-library/react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { render, screen, fireEvent } from '../../test-utils';
import { createUser } from '../../services/authService';
import type { User } from '../../domain/user';
import type { AppStackParamList } from '../../navigation/types';
import { CreateUser } from './CreateUser';

jest.mock('../../services/authService');
jest.mock('../../services/firebase', () => ({ auth: {}, db: {} }));

let mockCurrentUser: User | null = null;

jest.mock('../../store/useAuthStore', () => ({
  useAuthStore: (selector: (state: { user: User | null }) => unknown) =>
    selector({ user: mockCurrentUser }),
}));

const mockCreateUser = createUser as jest.Mock;

type Props = NativeStackScreenProps<AppStackParamList, 'CreateUser'>;

const adminUser: User = {
  uid: 'admin-1',
  email: 'admin@test.com',
  name: 'Admin',
  role: 'admin',
  workspaceId: 'ws-1',
};

const standardUser: User = {
  uid: 'user-1',
  email: 'user@test.com',
  name: 'Bob',
  role: 'standard',
  workspaceId: 'ws-1',
};

function renderCreateUser() {
  const goBack = jest.fn();
  const navigation = { goBack, navigate: jest.fn() } as unknown as Props['navigation'];
  const route = {
    key: 'CreateUser',
    name: 'CreateUser',
    params: undefined,
  } as unknown as Props['route'];
  render(<CreateUser navigation={navigation} route={route} />);
  return { goBack };
}

describe('CreateUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentUser = null;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('redirects non-admin users back immediately', () => {
    mockCurrentUser = standardUser;
    const { goBack } = renderCreateUser();

    expect(goBack).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Criar Usuário')).toBeNull();
  });

  it('renders name, email, password and role fields for admin', () => {
    mockCurrentUser = adminUser;
    renderCreateUser();

    expect(screen.getByPlaceholderText('Nome completo')).toBeTruthy();
    expect(screen.getByPlaceholderText('email@exemplo.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('Mínimo 6 caracteres')).toBeTruthy();
    expect(screen.getByText('Perfil')).toBeTruthy();
    expect(screen.getAllByText('Criar Usuário')).toHaveLength(2);
  });

  it('shows password validation error for short password', () => {
    mockCurrentUser = adminUser;
    renderCreateUser();

    fireEvent.changeText(screen.getByPlaceholderText('Mínimo 6 caracteres'), '123');

    expect(screen.getByText('Mínimo de 6 caracteres')).toBeTruthy();
  });

  it('disables submit button when fields are invalid', () => {
    mockCurrentUser = adminUser;
    renderCreateUser();

    fireEvent.press(screen.getAllByText('Criar Usuário').at(-1)!);

    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('navigates back when the AppBar back button is pressed', () => {
    mockCurrentUser = adminUser;
    const { goBack } = renderCreateUser();

    fireEvent.press(screen.getByLabelText('Voltar'));

    expect(goBack).toHaveBeenCalledTimes(1);
  });

  it('navigates back when Cancelar is pressed', () => {
    mockCurrentUser = adminUser;
    const { goBack } = renderCreateUser();

    fireEvent.press(screen.getByText('Cancelar'));

    expect(goBack).toHaveBeenCalledTimes(1);
  });

  it('updates the selected role', async () => {
    mockCurrentUser = adminUser;
    renderCreateUser();

    fireEvent.press(screen.getByText('Padrão'));
    fireEvent.press(await screen.findByText('Administrador'));

    fireEvent.changeText(screen.getByPlaceholderText('Nome completo'), 'Alice');
    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'alice@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('Mínimo 6 caracteres'), 'secret1');
    mockCreateUser.mockResolvedValue(undefined);

    await act(async () => {
      fireEvent.press(screen.getAllByText('Criar Usuário').at(-1)!);
    });

    expect(mockCreateUser).toHaveBeenCalledWith(
      'Alice',
      'alice@test.com',
      'secret1',
      'admin',
      adminUser,
    );
  });

  it('shows error snackbar on user creation failure', async () => {
    mockCurrentUser = adminUser;
    mockCreateUser.mockRejectedValue(new Error('Falha de rede'));
    renderCreateUser();

    fireEvent.changeText(screen.getByPlaceholderText('Nome completo'), 'Alice');
    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'alice@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('Mínimo 6 caracteres'), 'secret1');

    await act(async () => {
      fireEvent.press(screen.getAllByText('Criar Usuário').at(-1)!);
    });

    expect(screen.getByText('Falha de rede')).toBeTruthy();
  });

  it('shows a generic error message when creation fails with a non-Error value', async () => {
    mockCurrentUser = adminUser;
    mockCreateUser.mockRejectedValue('network down');
    renderCreateUser();

    fireEvent.changeText(screen.getByPlaceholderText('Nome completo'), 'Alice');
    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'alice@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('Mínimo 6 caracteres'), 'secret1');

    await act(async () => {
      fireEvent.press(screen.getAllByText('Criar Usuário').at(-1)!);
    });

    expect(screen.getByText('Falha ao criar usuário')).toBeTruthy();
  });

  it('shows a loading indicator while the request is in flight', async () => {
    mockCurrentUser = adminUser;
    let resolveCreateUser: () => void = () => {};
    mockCreateUser.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveCreateUser = resolve;
        }),
    );
    renderCreateUser();

    fireEvent.changeText(screen.getByPlaceholderText('Nome completo'), 'Alice');
    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'alice@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('Mínimo 6 caracteres'), 'secret1');
    fireEvent.press(screen.getAllByText('Criar Usuário').at(-1)!);

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeTruthy();
    });

    await act(async () => {
      resolveCreateUser();
    });
  });

  it('shows success snackbar after user creation', async () => {
    jest.useFakeTimers();
    mockCurrentUser = adminUser;
    mockCreateUser.mockResolvedValue(undefined);
    renderCreateUser();

    fireEvent.changeText(screen.getByPlaceholderText('Nome completo'), 'Alice');
    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'alice@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('Mínimo 6 caracteres'), 'secret1');

    await act(async () => {
      fireEvent.press(screen.getAllByText('Criar Usuário').at(-1)!);
    });

    expect(mockCreateUser).toHaveBeenCalledWith(
      'Alice',
      'alice@test.com',
      'secret1',
      'standard',
      adminUser,
    );
    expect(screen.getByText('Usuário criado com sucesso!')).toBeTruthy();

    act(() => {
      jest.runOnlyPendingTimers();
    });
  });
});
