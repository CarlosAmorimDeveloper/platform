import { useState } from 'react';

interface UseCommentDeletionParams {
  deleteComment: (id: string) => Promise<void>;
}

interface UseCommentDeletionResult {
  deleteCommentVisible: boolean;
  pendingCommentId: string | null;
  handleRequestDeleteComment: (commentId: string) => void;
  handleDeleteComment: () => Promise<void>;
  handleCancelDeleteComment: () => void;
  mutationError: string | null;
  clearMutationError: () => void;
}

export function useCommentDeletion({
  deleteComment,
}: UseCommentDeletionParams): UseCommentDeletionResult {
  const [deleteCommentVisible, setDeleteCommentVisible] = useState(false);
  const [pendingCommentId, setPendingCommentId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  function handleRequestDeleteComment(commentId: string) {
    setPendingCommentId(commentId);
    setDeleteCommentVisible(true);
  }

  async function handleDeleteComment() {
    if (!pendingCommentId) return;
    try {
      await deleteComment(pendingCommentId);
    } catch (err: unknown) {
      setMutationError(err instanceof Error ? err.message : 'Falha ao apagar o comentário.');
    } finally {
      setDeleteCommentVisible(false);
      setPendingCommentId(null);
    }
  }

  function handleCancelDeleteComment() {
    setDeleteCommentVisible(false);
    setPendingCommentId(null);
  }

  function clearMutationError() {
    setMutationError(null);
  }

  return {
    deleteCommentVisible,
    pendingCommentId,
    handleRequestDeleteComment,
    handleDeleteComment,
    handleCancelDeleteComment,
    mutationError,
    clearMutationError,
  };
}
