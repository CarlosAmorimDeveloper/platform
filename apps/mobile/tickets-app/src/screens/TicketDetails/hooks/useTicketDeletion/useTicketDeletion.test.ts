import { act, renderHook } from '@testing-library/react-native';
import { deleteTicket } from '../../../../services/ticketService';
import { useTicketDeletion } from './useTicketDeletion';

jest.mock('../../../../services/ticketService');
jest.mock('../../../../services/firebase', () => ({ auth: {}, db: {} }));

const mockDeleteTicket = deleteTicket as jest.Mock;

describe('useTicketDeletion', () => {
  const navigation = { goBack: jest.fn() };
  const deleteComment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteTicket.mockResolvedValue(undefined);
    deleteComment.mockResolvedValue(undefined);
  });

  it('initial state: deleteVisible=false, deleteCommentVisible=false, pendingCommentId=null, mutationError=null', () => {
    const { result } = renderHook(() =>
      useTicketDeletion({
        ticketId: 't1',
        workspaceId: 'ws-1',
        navigation: navigation as never,
        deleteComment,
      }),
    );
    expect(result.current.deleteVisible).toBe(false);
    expect(result.current.deleteCommentVisible).toBe(false);
    expect(result.current.pendingCommentId).toBeNull();
    expect(result.current.mutationError).toBeNull();
  });

  it('handleRequestDeleteComment: sets pendingCommentId and opens deleteCommentVisible', () => {
    const { result } = renderHook(() =>
      useTicketDeletion({
        ticketId: 't1',
        workspaceId: 'ws-1',
        navigation: navigation as never,
        deleteComment,
      }),
    );
    act(() => {
      result.current.handleRequestDeleteComment('c1');
    });
    expect(result.current.pendingCommentId).toBe('c1');
    expect(result.current.deleteCommentVisible).toBe(true);
  });

  it('handleDelete: calls deleteTicket and navigates back', async () => {
    const { result } = renderHook(() =>
      useTicketDeletion({
        ticketId: 't1',
        workspaceId: 'ws-1',
        navigation: navigation as never,
        deleteComment,
      }),
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
      useTicketDeletion({
        ticketId: 't1',
        workspaceId: 'ws-1',
        navigation: navigation as never,
        deleteComment,
      }),
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

  it('handleDeleteComment: calls deleteComment with pendingCommentId, closes dialog', async () => {
    const { result } = renderHook(() =>
      useTicketDeletion({
        ticketId: 't1',
        workspaceId: 'ws-1',
        navigation: navigation as never,
        deleteComment,
      }),
    );
    act(() => {
      result.current.handleRequestDeleteComment('c2');
    });
    await act(async () => {
      await result.current.handleDeleteComment();
    });
    expect(deleteComment).toHaveBeenCalledWith('c2');
    expect(result.current.deleteCommentVisible).toBe(false);
    expect(result.current.pendingCommentId).toBeNull();
  });

  it('handleCancelDeleteComment: closes dialog and clears pendingCommentId', () => {
    const { result } = renderHook(() =>
      useTicketDeletion({
        ticketId: 't1',
        workspaceId: 'ws-1',
        navigation: navigation as never,
        deleteComment,
      }),
    );
    act(() => {
      result.current.handleRequestDeleteComment('c3');
    });
    act(() => {
      result.current.handleCancelDeleteComment();
    });
    expect(result.current.deleteCommentVisible).toBe(false);
    expect(result.current.pendingCommentId).toBeNull();
  });

  it('clearMutationError: resets mutationError to null', async () => {
    mockDeleteTicket.mockRejectedValue(new Error('some error'));
    const { result } = renderHook(() =>
      useTicketDeletion({
        ticketId: 't1',
        workspaceId: 'ws-1',
        navigation: navigation as never,
        deleteComment,
      }),
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
