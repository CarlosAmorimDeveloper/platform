import React from 'react';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { ActivityIndicator } from 'react-native';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { useTicketDetails } from '../../hooks/useTicketDetails';
import { useUserList } from '../../hooks/useUserList';
import { useAuthStore } from '../../store/useAuthStore';
import { deleteTicket } from '../../services/ticketService';
import { STATUS_LABELS } from '../../constants/ticketStatus';
import { PRIORITY_LABELS } from '../../constants/ticketPriority';
import type { Comment, Ticket } from '../../domain/ticket';
import type { User } from '../../domain/user';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { TicketDetails } from './TicketDetails';

jest.mock('../../hooks/useTicketDetails');
jest.mock('../../hooks/useUserList');
jest.mock('../../store/useAuthStore');
jest.mock('../../services/ticketService');
jest.mock('../../services/firebase', () => ({ auth: {}, db: {} }));
jest.mock('react-native/Libraries/Components/Keyboard/Keyboard', () => {
  const mockKeyboard = {
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    isVisible: jest.fn(() => false),
    dismiss: jest.fn(),
  };
  return { ...mockKeyboard, default: mockKeyboard, __esModule: true };
});

const mockUseTicketDetails = useTicketDetails as jest.Mock;
const mockUseUserList = useUserList as jest.Mock;
const mockUseAuthStore = useAuthStore as unknown as jest.Mock;
const mockDeleteTicket = deleteTicket as jest.Mock;

type Props = NativeStackScreenProps<AppStackParamList, 'TicketDetails'>;

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
} as unknown as Props['navigation'];

function makeRoute(ticketId: string): Props['route'] {
  return { key: 'TicketDetails', name: 'TicketDetails', params: { ticketId } } as Props['route'];
}

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
  name: 'User',
  role: 'standard',
  workspaceId: 'ws-1',
};

function makeTicket(overrides: Partial<Ticket> = {}): Ticket {
  return {
    id: 't1',
    title: 'Impressora não liga',
    description: 'A impressora do 2º andar não liga.',
    status: 'open',
    priority: 'high',
    creatorId: 'user-1',
    creatorName: 'User',
    createdAt: null,
    assigneeId: null,
    assigneeName: null,
    ...overrides,
  };
}

function makeComment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: 'c1',
    text: 'Já verifiquei o cabo de energia.',
    authorId: 'user-1',
    authorName: 'User',
    createdAt: null,
    ...overrides,
  };
}

function mockTicketDetailsReturn(overrides: Partial<ReturnType<typeof useTicketDetails>> = {}) {
  return {
    ticket: makeTicket(),
    comments: [],
    loading: false,
    error: null,
    clearError: jest.fn(),
    updateTicket: jest.fn().mockResolvedValue(undefined),
    deleteTicket: jest.fn().mockResolvedValue(undefined),
    addComment: jest.fn().mockResolvedValue(undefined),
    deleteComment: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function setUser(user: User) {
  mockUseAuthStore.mockImplementation((selector: (s: { user: User }) => unknown) =>
    selector({ user }),
  );
}

describe('TicketDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTicketDetails.mockReturnValue(mockTicketDetailsReturn());
    mockUseUserList.mockReturnValue({
      users: [],
      loading: false,
      error: null,
      clearError: jest.fn(),
    });
    mockDeleteTicket.mockResolvedValue(undefined);
    setUser(adminUser);
  });

  it('shows loading indicator while fetching ticket', () => {
    mockUseTicketDetails.mockReturnValue(mockTicketDetailsReturn({ ticket: null, loading: true }));

    render(<TicketDetails navigation={mockNavigation} route={makeRoute('t1')} />);

    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('shows not found message when ticket is null', () => {
    mockUseTicketDetails.mockReturnValue(mockTicketDetailsReturn({ ticket: null, loading: false }));

    render(<TicketDetails navigation={mockNavigation} route={makeRoute('t1')} />);

    expect(screen.getByText('Chamado não encontrado.')).toBeTruthy();
  });

  it('renders ticket title, description and metadata', () => {
    mockUseTicketDetails.mockReturnValue(
      mockTicketDetailsReturn({
        ticket: makeTicket({
          title: 'Impressora não liga',
          description: 'A impressora do 2º andar não liga.',
          creatorName: 'Bruna',
        }),
      }),
    );

    render(<TicketDetails navigation={mockNavigation} route={makeRoute('t1')} />);

    expect(screen.getByText('Impressora não liga')).toBeTruthy();
    expect(screen.getByText('A impressora do 2º andar não liga.')).toBeTruthy();
    expect(screen.getByText('Criado por: Bruna')).toBeTruthy();
  });

  it('renders status and priority badges', () => {
    mockUseTicketDetails.mockReturnValue(
      mockTicketDetailsReturn({
        ticket: makeTicket({ status: 'in_progress', priority: 'high' }),
      }),
    );

    render(<TicketDetails navigation={mockNavigation} route={makeRoute('t1')} />);

    expect(screen.getByText(STATUS_LABELS.in_progress)).toBeTruthy();
    expect(screen.getByText(PRIORITY_LABELS.high)).toBeTruthy();
  });

  it('renders comments list', () => {
    mockUseTicketDetails.mockReturnValue(
      mockTicketDetailsReturn({
        comments: [
          makeComment({ id: 'c1', text: 'Primeiro comentário', authorName: 'Bruna' }),
          makeComment({ id: 'c2', text: 'Segundo comentário', authorName: 'Caio' }),
        ],
      }),
    );

    render(<TicketDetails navigation={mockNavigation} route={makeRoute('t1')} />);

    expect(screen.getByText('Primeiro comentário')).toBeTruthy();
    expect(screen.getByText('Segundo comentário')).toBeTruthy();
  });

  it('admin can enter edit mode via header button', () => {
    setUser(adminUser);
    mockUseTicketDetails.mockReturnValue(mockTicketDetailsReturn({ comments: [] }));

    render(<TicketDetails navigation={mockNavigation} route={makeRoute('t1')} />);

    expect(screen.queryByText('Responsável')).toBeNull();

    fireEvent.press(screen.getByLabelText('Editar chamado'));

    expect(screen.getByText('Responsável')).toBeTruthy();
  });

  it('admin can delete ticket via header button', async () => {
    setUser(adminUser);
    mockUseTicketDetails.mockReturnValue(
      mockTicketDetailsReturn({ ticket: makeTicket({ id: 't1' }), comments: [] }),
    );

    render(<TicketDetails navigation={mockNavigation} route={makeRoute('t1')} />);

    expect(mockDeleteTicket).not.toHaveBeenCalled();

    fireEvent.press(screen.getByLabelText('Apagar chamado'));

    expect(screen.getByText('Apagar ticket')).toBeTruthy();
    expect(mockDeleteTicket).not.toHaveBeenCalled();

    fireEvent.press(screen.getByText('Apagar'));

    await waitFor(() => {
      expect(mockDeleteTicket).toHaveBeenCalledWith('t1', 'ws-1');
    });
    await waitFor(() => {
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  it('standard user does not see the admin header edit/delete button', () => {
    setUser(standardUser);
    mockUseTicketDetails.mockReturnValue(mockTicketDetailsReturn({ comments: [] }));

    render(<TicketDetails navigation={mockNavigation} route={makeRoute('t1')} />);

    expect(screen.queryByLabelText('Editar chamado')).toBeNull();
    expect(screen.queryByLabelText('Apagar chamado')).toBeNull();
  });

  it('user can add a comment', async () => {
    const mockAddComment = jest.fn().mockResolvedValue(undefined);
    setUser(standardUser);
    mockUseTicketDetails.mockReturnValue(
      mockTicketDetailsReturn({ comments: [], addComment: mockAddComment }),
    );

    render(<TicketDetails navigation={mockNavigation} route={makeRoute('t1')} />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Escreva um comentário...'),
      'Novo comentário de teste',
    );
    fireEvent.press(screen.getByText('Enviar'));

    await waitFor(() => {
      expect(mockAddComment).toHaveBeenCalledWith('Novo comentário de teste');
    });
  });

  it('user can delete own comment', async () => {
    const mockDeleteComment = jest.fn().mockResolvedValue(undefined);
    setUser(standardUser);
    mockUseTicketDetails.mockReturnValue(
      mockTicketDetailsReturn({
        comments: [makeComment({ id: 'c1', authorId: standardUser.uid })],
        deleteComment: mockDeleteComment,
      }),
    );

    render(<TicketDetails navigation={mockNavigation} route={makeRoute('t1')} />);

    fireEvent.press(screen.getByText('Apagar'));

    expect(screen.getByText('Apagar comentário')).toBeTruthy();
    expect(mockDeleteComment).not.toHaveBeenCalled();

    const confirmButtons = screen.getAllByText('Apagar');
    const dialogConfirmButton = confirmButtons[confirmButtons.length - 1];
    if (!dialogConfirmButton) throw new Error('Delete comment dialog confirm button not found');
    fireEvent.press(dialogConfirmButton);

    await waitFor(() => {
      expect(mockDeleteComment).toHaveBeenCalledWith('c1');
    });
  });
});
