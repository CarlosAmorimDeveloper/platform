import { useEffect, useState } from 'react';
import {
  subscribeToTicketById,
  subscribeToComments,
  updateTicket,
  deleteTicket,
  addComment,
  deleteComment,
} from '../../services/ticketService';
import { useAuthStore } from '../../store/useAuthStore';
import type { Ticket, Comment } from '../../domain/ticket';
import type { TicketStatus } from '../../constants/ticketStatus';
import type { TicketPriority } from '../../constants/ticketPriority';

interface UpdateTicketParams {
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId?: string | null;
  assigneeName?: string | null;
}

export function useTicketDetails(ticketId: string) {
  const user = useAuthStore((s) => s.user);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  async function handleUpdateTicket({
    status,
    priority,
    assigneeId,
    assigneeName,
  }: UpdateTicketParams) {
    if (!user) return;
    try {
      await updateTicket(
        ticketId,
        { status, priority, assigneeId, assigneeName },
        user.workspaceId,
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar o chamado.');
    }
  }

  async function handleDeleteTicket() {
    if (!user) return;
    try {
      await deleteTicket(ticketId, user.workspaceId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao apagar o chamado.');
    }
  }

  async function handleAddComment(text: string) {
    if (!user) return;
    try {
      await addComment(ticketId, text, user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao enviar comentário.');
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!user) return;
    try {
      await deleteComment(ticketId, commentId, user.workspaceId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao apagar comentário.');
    }
  }

  return {
    ticket,
    comments,
    loading,
    error,
    clearError: () => setError(null),
    updateTicket: handleUpdateTicket,
    deleteTicket: handleDeleteTicket,
    addComment: handleAddComment,
    deleteComment: handleDeleteComment,
  };
}
