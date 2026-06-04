import { useEffect, useState } from 'react';
import { subscribeToTicketList } from '../../services/ticketService';
import { useAuthStore } from '../../store/useAuthStore';
import type { Ticket } from '../../domain/ticket';
import type { TicketStatus } from '../../constants/ticketStatus';

export function useTicketList(statusFilter?: TicketStatus) {
  const user = useAuthStore((s) => s.user);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToTicketList(
      user,
      (all) => {
        setTickets(statusFilter ? all.filter((t) => t.status === statusFilter) : all);
        setLoading(false);
      },
      () => {
        setLoading(false);
        setError('Erro ao carregar os chamados.');
      },
    );

    return unsubscribe;
  }, [user, statusFilter]);

  return { tickets, loading, error, clearError: () => setError(null) };
}
