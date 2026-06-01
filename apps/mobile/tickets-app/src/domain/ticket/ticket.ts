import type { QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
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
  createdAt: Timestamp | null;
  assigneeId: string | null;
  assigneeName: string | null;
}

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp | null;
}

export function toTicket(doc: QueryDocumentSnapshot): Ticket {
  const data = doc.data();
  return {
    id: doc.id,
    title: (data.title ?? '') as string,
    description: (data.description ?? '') as string,
    status: (data.status ?? 'open') as TicketStatus,
    priority: (data.priority ?? 'medium') as TicketPriority,
    creatorId: (data.creator_id ?? '') as string,
    creatorName: (data.creator_name ?? '') as string,
    createdAt: (data.createdAt as Timestamp) ?? null,
    assigneeId: (data.assignee_id as string) ?? null,
    assigneeName: (data.assignee_name as string) ?? null,
  };
}

export function formatDate(ts: Timestamp | null): string {
  if (!ts) return '';
  return ts.toDate().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
