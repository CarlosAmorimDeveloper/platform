import { colors } from '@ds/tokens';

export type TicketStatus = 'open' | 'in_progress' | 'done';

export const ALL_STATUSES: TicketStatus[] = ['open', 'in_progress', 'done'];

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Aberto',
  in_progress: 'Em Progresso',
  done: 'Concluído',
};

export const STATUS_COLORS: Record<TicketStatus, string> = {
  open: `${colors.primary[500]}`,
  in_progress: `${colors.warning[500]}`,
  done: `${colors.success[500]}`,
};
