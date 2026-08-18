import { act } from '@testing-library/react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { render, screen, fireEvent } from '../../test-utils';
import { createTicket } from '../../services/ticketService';
import { subscribeToUsers } from '../../services/authService';
import type { User } from '../../domain/user';
import type { AppStackParamList } from '../../navigation/types';
import { NewTicket } from './NewTicket';

jest.mock('../../services/ticketService');
jest.mock('../../services/authService');
jest.mock('../../services/firebase', () => ({ auth: {}, db: {} }));

let mockCurrentUser: User | null = null;

jest.mock('../../store/useAuthStore', () => ({
  useAuthStore: (selector: (state: { user: User | null }) => unknown) =>
    selector({ user: mockCurrentUser }),
}));

const mockCreateTicket = createTicket as jest.Mock;
const mockSubscribeToUsers = subscribeToUsers as jest.Mock;

type Props = NativeStackScreenProps<AppStackParamList, 'NewTicket'>;

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

const workspaceUsers: User[] = [
  { uid: 'u2', email: 'alice@test.com', name: 'Alice', role: 'standard', workspaceId: 'ws-1' },
];

function renderNewTicket() {
  const goBack = jest.fn();
  const navigation = { goBack, navigate: jest.fn() } as unknown as Props['navigation'];
  const route = {
    key: 'NewTicket',
    name: 'NewTicket',
    params: undefined,
  } as unknown as Props['route'];
  render(<NewTicket navigation={navigation} route={route} />);
  return { goBack };
}

describe('NewTicket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentUser = standardUser;
    mockSubscribeToUsers.mockImplementation(
      (_workspaceId: string, onData: (users: User[]) => void) => {
        onData(workspaceUsers);
        return jest.fn();
      },
    );
  });

  it('renders title, description and priority fields', () => {
    renderNewTicket();

    expect(screen.getByPlaceholderText('Título do chamado')).toBeTruthy();
    expect(screen.getByPlaceholderText('Descreva o problema...')).toBeTruthy();
    expect(screen.getByText('Prioridade')).toBeTruthy();
    expect(screen.queryByText('Responsável')).toBeNull();
  });

  it('disables save button when title is empty', () => {
    renderNewTicket();

    fireEvent.press(screen.getByText('Salvar Ticket'));

    expect(mockCreateTicket).not.toHaveBeenCalled();
  });

  it('shows error snackbar on ticket creation failure', async () => {
    mockCreateTicket.mockRejectedValue(new Error('Falha de rede'));
    renderNewTicket();

    fireEvent.changeText(screen.getByPlaceholderText('Título do chamado'), 'Impressora quebrada');

    await act(async () => {
      fireEvent.press(screen.getByText('Salvar Ticket'));
    });

    expect(screen.getByText('Falha de rede')).toBeTruthy();
  });

  it('navigates back after successful ticket creation without an assignee', async () => {
    mockCreateTicket.mockResolvedValue(undefined);
    const { goBack } = renderNewTicket();

    fireEvent.changeText(screen.getByPlaceholderText('Título do chamado'), 'Impressora quebrada');

    await act(async () => {
      fireEvent.press(screen.getByText('Salvar Ticket'));
    });

    expect(mockCreateTicket).toHaveBeenCalledWith(
      {
        title: 'Impressora quebrada',
        description: '',
        priority: 'medium',
        assigneeId: null,
        assigneeName: null,
      },
      standardUser,
    );
    expect(goBack).toHaveBeenCalledTimes(1);
  });

  it('creates a ticket with the selected assignee when an admin picks one', async () => {
    mockCurrentUser = adminUser;
    mockCreateTicket.mockResolvedValue(undefined);
    const { goBack } = renderNewTicket();

    fireEvent.press(screen.getByText('Nenhum'));
    fireEvent.press(await screen.findByText('Alice'));
    fireEvent.changeText(screen.getByPlaceholderText('Título do chamado'), 'Impressora quebrada');

    await act(async () => {
      fireEvent.press(screen.getByText('Salvar Ticket'));
    });

    expect(mockCreateTicket).toHaveBeenCalledWith(
      {
        title: 'Impressora quebrada',
        description: '',
        priority: 'medium',
        assigneeId: 'u2',
        assigneeName: 'Alice',
      },
      adminUser,
    );
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
