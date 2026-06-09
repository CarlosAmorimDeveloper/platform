import { colors } from '@ds/tokens';

export type TicketPriority = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';

export const ALL_PRIORITIES: TicketPriority[] = ['very_low', 'low', 'medium', 'high', 'very_high'];

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  very_low: 'Muito Baixo',
  low: 'Baixo',
  medium: 'Médio',
  high: 'Alto',
  very_high: 'Muito Alto',
};

export const PRIORITY_COLORS: Record<TicketPriority, string> = {
  very_low: colors.neutral[400],
  low: colors.success[500],
  medium: colors.primary[500],
  high: colors.warning[500],
  very_high: colors.error[500],
};
