import { View, Text, StyleSheet } from 'react-native';
import type { Timestamp } from 'firebase/firestore';
import { Card } from '@ds/mobile';
import { colors, fontSizes, spacing, radii } from '@ds/tokens';
import { STATUS_COLORS, STATUS_LABELS, type TicketStatus } from '../constants/ticketStatus';
import { PRIORITY_COLORS, PRIORITY_LABELS, type TicketPriority } from '../constants/ticketPriority';

export type { TicketStatus } from '../constants/ticketStatus';

function formatDate(ts: Timestamp | null): string {
  if (!ts) return '';
  return ts.toDate().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface Props {
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  creatorName: string;
  createdAt: Timestamp | null;
  onPress: () => void;
}

export function TicketCard({ title, status, priority, creatorName, createdAt, onPress }: Props) {
  return (
    <Card title={title} onPress={onPress}>
      <View style={[styles.badge, { backgroundColor: PRIORITY_COLORS[priority] + '20' }]}>
        <Text style={[styles.badgeText, { color: PRIORITY_COLORS[priority] }]}>
          {PRIORITY_LABELS[priority]}
        </Text>
      </View>
      <Text style={styles.meta}>
        Criado por: {creatorName}
        {createdAt ? ` · ${formatDate(createdAt)}` : ''}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  badgeRow: { flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: spacing[1],
    borderRadius: radii.xl,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: fontSizes.xs, fontWeight: '600' },
  meta: { fontSize: fontSizes.xs, color: `${colors.neutral[500]}`, marginTop: spacing[1] },
});
