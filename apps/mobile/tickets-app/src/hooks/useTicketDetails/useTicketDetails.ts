import { useEffect, useState } from 'react';
import {
  subscribeToTicketById,
  subscribeToComments,
  addComment,
  deleteComment,
} from '../../services/ticketService';
import { useAuthStore } from '../../store/useAuthStore';
import type { Ticket, Comment } from '../../domain/ticket';

export function useTicketDetails(ticketId: string) {
  const user = useAuthStore((s) => s.user);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function setErrorFrom(err: unknown, fallback: string) {
    setError(err instanceof Error ? err.message : fallback);
  }

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToTicketById(
      ticketId,
      user.workspaceId,
      (t) => {
        setTicket(t);
        setLoading(false);
      },
      () => {
        setLoading(false);
        setError('Erro ao carregar o chamado.');
      },
    );
    return unsubscribe;
  }, [ticketId, user]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToComments(ticketId, user.workspaceId, setComments, () =>
      setError('Erro ao carregar comentários.'),
    );
    return unsubscribe;
  }, [ticketId, user]);

  async function handleAddComment(text: string) {
    if (!user) return;
    try {
      await addComment(ticketId, text, user);
    } catch (err: unknown) {
      setErrorFrom(err, 'Falha ao enviar comentário.');
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!user) return;
    try {
      await deleteComment(ticketId, commentId, user.workspaceId);
    } catch (err: unknown) {
      setErrorFrom(err, 'Falha ao apagar comentário.');
    }
  }

  return {
    ticket,
    comments,
    loading,
    error,
    clearError: () => setError(null),
    addComment: handleAddComment,
    deleteComment: handleDeleteComment,
  };
}
