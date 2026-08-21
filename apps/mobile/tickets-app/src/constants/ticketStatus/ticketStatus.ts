import type { BadgeTone } from '@vuotto/mobile';

export type TicketStatus = 'open' | 'in_progress' | 'done';

export const ALL_STATUSES: TicketStatus[] = ['open', 'in_progress', 'done'];

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Aberto',
  in_progress: 'Em Progresso',
  done: 'Concluído',
};

export const STATUS_TONES: Record<TicketStatus, BadgeTone> = {
  open: 'info',
  in_progress: 'warning',
  done: 'success',
};
