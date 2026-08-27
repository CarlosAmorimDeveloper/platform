import { act, renderHook } from '@testing-library/react-native';
import { deleteTicket } from '../../../../services/ticketService';
import { useTicketDeletion } from './useTicketDeletion';

jest.mock('../../../../services/ticketService');
jest.mock('../../../../services/firebase', () => ({ auth: {}, db: {} }));
jest.mock('../../../../store/useAuthStore', () => ({
  useAuthStore: (selector: (s: { user: { workspaceId: string } | null }) => unknown) =>
    selector({ user: { workspaceId: 'ws-1' } }),
}));

const mockDeleteTicket = deleteTicket as jest.Mock;

describe('useTicketDeletion', () => {
  const navigation = { goBack: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteTicket.mockResolvedValue(undefined);
  });

  it('initial state: deleteVisible=false, mutationError=null', () => {
    const { result } = renderHook(() =>
      useTicketDeletion({ ticketId: 't1', navigation: navigation as never }),
    );
    expect(result.current.deleteVisible).toBe(false);
    expect(result.current.mutationError).toBeNull();
  });

  it('handleDelete: calls deleteTicket and navigates back', async () => {
    const { result } = renderHook(() =>
      useTicketDeletion({ ticketId: 't1', navigation: navigation as never }),
    );
    await act(async () => {
      await result.current.handleDelete();
    });
    expect(mockDeleteTicket).toHaveBeenCalledWith('t1', 'ws-1');
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('handleDelete: sets mutationError and closes dialog on failure', async () => {
    mockDeleteTicket.mockRejectedValue(new Error('network error'));
    const { result } = renderHook(() =>
      useTicketDeletion({ ticketId: 't1', navigation: navigation as never }),
    );
    act(() => {
      result.current.setDeleteVisible(true);
    });
    await act(async () => {
      await result.current.handleDelete();
    });
    expect(result.current.mutationError).toBe('network error');
    expect(result.current.deleteVisible).toBe(false);
    expect(navigation.goBack).not.toHaveBeenCalled();
  });

  it('clearMutationError: resets mutationError to null', async () => {
    mockDeleteTicket.mockRejectedValue(new Error('some error'));
    const { result } = renderHook(() =>
      useTicketDeletion({ ticketId: 't1', navigation: navigation as never }),
    );
    await act(async () => {
      await result.current.handleDelete();
    });
    expect(result.current.mutationError).toBeTruthy();
    act(() => {
      result.current.clearMutationError();
    });
    expect(result.current.mutationError).toBeNull();
  });
});
