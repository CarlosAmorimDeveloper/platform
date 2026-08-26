import type { TicketStatus } from '../../constants/ticketStatus';
import type { TicketPriority } from '../../constants/ticketPriority';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  creatorId: string;
  creatorName: string;
  createdAt: Date | null;
  assigneeId: string | null;
  assigneeName: string | null;
}

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: Date | null;
}

export function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
