import { act, renderHook } from '@testing-library/react-native';
import { useCommentDeletion } from './useCommentDeletion';

describe('useCommentDeletion', () => {
  const deleteComment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    deleteComment.mockResolvedValue(undefined);
  });

  it('initial state: deleteCommentVisible=false, pendingCommentId=null, mutationError=null', () => {
    const { result } = renderHook(() => useCommentDeletion({ deleteComment }));
    expect(result.current.deleteCommentVisible).toBe(false);
    expect(result.current.pendingCommentId).toBeNull();
    expect(result.current.mutationError).toBeNull();
  });

  it('handleRequestDeleteComment: sets pendingCommentId and opens deleteCommentVisible', () => {
    const { result } = renderHook(() => useCommentDeletion({ deleteComment }));
    act(() => {
      result.current.handleRequestDeleteComment('c1');
    });
    expect(result.current.pendingCommentId).toBe('c1');
    expect(result.current.deleteCommentVisible).toBe(true);
  });

  it('handleDeleteComment: calls deleteComment with pendingCommentId, closes dialog', async () => {
    const { result } = renderHook(() => useCommentDeletion({ deleteComment }));
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

  it('handleDeleteComment: sets mutationError and still closes dialog on failure', async () => {
    deleteComment.mockRejectedValue(new Error('network error'));
    const { result } = renderHook(() => useCommentDeletion({ deleteComment }));
    act(() => {
      result.current.handleRequestDeleteComment('c2');
    });
    await act(async () => {
      await result.current.handleDeleteComment();
    });
    expect(result.current.mutationError).toBe('network error');
    expect(result.current.deleteCommentVisible).toBe(false);
    expect(result.current.pendingCommentId).toBeNull();
  });

  it('handleCancelDeleteComment: closes dialog and clears pendingCommentId', () => {
    const { result } = renderHook(() => useCommentDeletion({ deleteComment }));
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
    deleteComment.mockRejectedValue(new Error('some error'));
    const { result } = renderHook(() => useCommentDeletion({ deleteComment }));
    act(() => {
      result.current.handleRequestDeleteComment('c1');
    });
    await act(async () => {
      await result.current.handleDeleteComment();
    });
    expect(result.current.mutationError).toBeTruthy();
    act(() => {
      result.current.clearMutationError();
    });
    expect(result.current.mutationError).toBeNull();
  });
});
