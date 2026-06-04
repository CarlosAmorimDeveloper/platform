import { useState } from 'react';
import { deleteTicket } from '../../../../services/ticketService';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../../../navigation/types';

interface UseTicketDeletionParams {
  ticketId: string;
  workspaceId: string;
  navigation: NativeStackNavigationProp<AppStackParamList, 'TicketDetails'>;
  deleteComment: (id: string) => Promise<void>;
}

interface UseTicketDeletionResult {
  deleteVisible: boolean;
  setDeleteVisible: (v: boolean) => void;
  deleteCommentVisible: boolean;
  pendingCommentId: string | null;
  handleRequestDeleteComment: (commentId: string) => void;
  handleDelete: () => Promise<void>;
  handleDeleteComment: () => Promise<void>;
  handleCancelDeleteComment: () => void;
  mutationError: string | null;
  clearMutationError: () => void;
}

export function useTicketDeletion({
  ticketId,
  workspaceId,
  navigation,
  deleteComment,
}: UseTicketDeletionParams): UseTicketDeletionResult {
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteCommentVisible, setDeleteCommentVisible] = useState(false);
  const [pendingCommentId, setPendingCommentId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  function handleRequestDeleteComment(commentId: string) {
    setPendingCommentId(commentId);
    setDeleteCommentVisible(true);
  }

  async function handleDelete() {
    try {
      await deleteTicket(ticketId, workspaceId);
      navigation.goBack();
    } catch (err: unknown) {
      setDeleteVisible(false);
      setMutationError(err instanceof Error ? err.message : 'Falha ao apagar o chamado.');
    }
  }

  async function handleDeleteComment() {
    if (!pendingCommentId) return;
    try {
      await deleteComment(pendingCommentId);
    } catch {
      // error captured by hook via error state
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
    deleteVisible,
    setDeleteVisible,
    deleteCommentVisible,
    pendingCommentId,
    handleRequestDeleteComment,
    handleDelete,
    handleDeleteComment,
    handleCancelDeleteComment,
    mutationError,
    clearMutationError,
  };
}
