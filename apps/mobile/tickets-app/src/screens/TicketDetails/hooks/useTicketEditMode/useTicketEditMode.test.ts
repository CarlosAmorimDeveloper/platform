import { act, renderHook } from '@testing-library/react-native';
import { updateTicket } from '../../../../services/ticketService';
import type { Ticket } from '../../../../domain/ticket';
import type { User } from '../../../../domain/user';
import { useTicketEditMode } from './useTicketEditMode';

jest.mock('../../../../services/ticketService');
jest.mock('../../../../services/firebase', () => ({ auth: {}, db: {} }));

const mockUpdateTicket = updateTicket as jest.Mock;

const mockTicket: Ticket = {
  id: 't1',
  title: 'Bug',
  description: 'desc',
  status: 'in_progress',
  priority: 'high',
  creatorId: 'u1',
  creatorName: 'Alice',
  createdAt: null,
  assigneeId: 'u2',
  assigneeName: 'Bob',
};

const mockUsers: User[] = [
  { uid: 'u1', email: 'alice@test.com', name: 'Alice', role: 'admin' },
  { uid: 'u2', email: 'bob@test.com', name: 'Bob', role: 'standard' },
];

describe('useTicketEditMode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateTicket.mockResolvedValue(undefined);
  });

  it('initial state: editing=false, saveVisible=false, mutationError=null', () => {
    const { result } = renderHook(() =>
      useTicketEditMode({ ticketId: 't1', users: mockUsers, ticket: mockTicket }),
    );
    expect(result.current.editing).toBe(false);
    expect(result.current.saveVisible).toBe(false);
    expect(result.current.mutationError).toBeNull();
  });

  it('onEditPress when not editing: sets editing=true and initializes drafts from ticket', () => {
    const { result } = renderHook(() =>
      useTicketEditMode({ ticketId: 't1', users: mockUsers, ticket: mockTicket }),
    );
    act(() => {
      result.current.onEditPress();
    });
    expect(result.current.editing).toBe(true);
    expect(result.current.draftStatus).toBe('in_progress');
    expect(result.current.draftPriority).toBe('high');
    expect(result.current.draftAssigneeId).toBe('u2');
  });

  it('onEditPress when editing: sets saveVisible=true', () => {
    const { result } = renderHook(() =>
      useTicketEditMode({ ticketId: 't1', users: mockUsers, ticket: mockTicket }),
    );
    act(() => {
      result.current.onEditPress(); // enter edit mode
    });
    act(() => {
      result.current.onEditPress(); // press again while editing
    });
    expect(result.current.saveVisible).toBe(true);
    expect(result.current.editing).toBe(true);
  });

  it('handleConfirmSave: calls updateTicket with correct fields', async () => {
    const { result } = renderHook(() =>
      useTicketEditMode({ ticketId: 't1', users: mockUsers, ticket: mockTicket }),
    );
    act(() => {
      result.current.onEditPress();
    });
    await act(async () => {
      await result.current.handleConfirmSave();
    });
    expect(mockUpdateTicket).toHaveBeenCalledWith('t1', {
      status: 'in_progress',
      priority: 'high',
      assigneeId: 'u2',
      assigneeName: 'Bob',
    });
    expect(result.current.editing).toBe(false);
    expect(result.current.saveVisible).toBe(false);
  });

  it('handleConfirmSave: sets mutationError on failure', async () => {
    mockUpdateTicket.mockRejectedValue(new Error('network failure'));
    const { result } = renderHook(() =>
      useTicketEditMode({ ticketId: 't1', users: mockUsers, ticket: mockTicket }),
    );
    act(() => {
      result.current.onEditPress();
    });
    await act(async () => {
      await result.current.handleConfirmSave();
    });
    expect(result.current.mutationError).toBe('network failure');
    expect(result.current.saveVisible).toBe(false);
  });

  it('handleCancelSave: resets editing and saveVisible', () => {
    const { result } = renderHook(() =>
      useTicketEditMode({ ticketId: 't1', users: mockUsers, ticket: mockTicket }),
    );
    act(() => {
      result.current.onEditPress(); // enter edit mode
    });
    act(() => {
      result.current.onEditPress(); // trigger saveVisible
    });
    act(() => {
      result.current.handleCancelSave();
    });
    expect(result.current.editing).toBe(false);
    expect(result.current.saveVisible).toBe(false);
  });

  it('clearMutationError: resets mutationError to null', async () => {
    mockUpdateTicket.mockRejectedValue(new Error('some error'));
    const { result } = renderHook(() =>
      useTicketEditMode({ ticketId: 't1', users: mockUsers, ticket: mockTicket }),
    );
    act(() => {
      result.current.onEditPress();
    });
    await act(async () => {
      await result.current.handleConfirmSave();
    });
    expect(result.current.mutationError).toBeTruthy();
    act(() => {
      result.current.clearMutationError();
    });
    expect(result.current.mutationError).toBeNull();
  });
});
