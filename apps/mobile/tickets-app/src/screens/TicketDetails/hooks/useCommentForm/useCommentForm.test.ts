import { act, renderHook } from '@testing-library/react-native';
import { useCommentForm } from './useCommentForm';

describe('useCommentForm', () => {
  it('initial state: commentText empty, sendingComment false', () => {
    const addComment = jest.fn();
    const { result } = renderHook(() => useCommentForm({ addComment }));
    expect(result.current.commentText).toBe('');
    expect(result.current.sendingComment).toBe(false);
  });

  it('handleAddComment calls addComment with trimmed text', async () => {
    const addComment = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useCommentForm({ addComment }));
    act(() => {
      result.current.setCommentText('  hello world  ');
    });
    await act(async () => {
      await result.current.handleAddComment();
    });
    expect(addComment).toHaveBeenCalledWith('hello world');
  });

  it('handleAddComment clears commentText after sending', async () => {
    const addComment = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useCommentForm({ addComment }));
    act(() => {
      result.current.setCommentText('a comment');
    });
    await act(async () => {
      await result.current.handleAddComment();
    });
    expect(result.current.commentText).toBe('');
  });

  it('handleAddComment does not call addComment when text is empty', async () => {
    const addComment = jest.fn();
    const { result } = renderHook(() => useCommentForm({ addComment }));
    await act(async () => {
      await result.current.handleAddComment();
    });
    expect(addComment).not.toHaveBeenCalled();
  });

  it('handleAddComment sets sendingComment=true during send, false after', async () => {
    let resolveSend!: () => void;
    const addComment = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSend = resolve;
        }),
    );
    const { result } = renderHook(() => useCommentForm({ addComment }));
    act(() => {
      result.current.setCommentText('test');
    });

    let sendPromise: Promise<void>;
    act(() => {
      sendPromise = result.current.handleAddComment();
    });
    expect(result.current.sendingComment).toBe(true);

    await act(async () => {
      resolveSend();
      await sendPromise;
    });
    expect(result.current.sendingComment).toBe(false);
  });
});
