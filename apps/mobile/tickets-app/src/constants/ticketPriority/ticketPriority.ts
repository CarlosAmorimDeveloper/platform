import type { BadgeTone } from '@industry/mobile';

export type TicketPriority = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';

export const ALL_PRIORITIES: TicketPriority[] = ['very_low', 'low', 'medium', 'high', 'very_high'];

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  very_low: 'Muito Baixo',
  low: 'Baixo',
  medium: 'Médio',
  high: 'Alto',
  very_high: 'Muito Alto',
};

export const PRIORITY_TONES: Record<TicketPriority, BadgeTone> = {
  very_low: 'neutral',
  low: 'success',
  medium: 'accent',
  high: 'warning',
  very_high: 'danger',
};
