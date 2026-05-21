import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@ds/mobile';
import { fontSizes, spacing, radii } from '@ds/tokens';
import { STATUS_COLORS, STATUS_LABELS, type TicketStatus } from '../constants/ticketStatus';
import { PRIORITY_COLORS, PRIORITY_LABELS, type TicketPriority } from '../constants/ticketPriority';

export type { TicketStatus } from '../constants/ticketStatus';

interface Props {
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  onPress: () => void;
}

export function TicketCard({ title, status, priority, onPress }: Props) {
  return (
    <Card title={title} onPress={onPress}>
      <View style={[styles.badge, { backgroundColor: STATUS_COLORS[status] + '20' }]}>
        <Text style={[styles.badgeText, { color: STATUS_COLORS[status] }]}>
          {STATUS_LABELS[status]}
        </Text>
      </View>
      <View style={[styles.badge, { backgroundColor: PRIORITY_COLORS[priority] + '20' }]}>
        <Text style={[styles.badgeText, { color: PRIORITY_COLORS[priority] }]}>
          {PRIORITY_LABELS[priority]}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: spacing[1],
    borderRadius: radii.xl,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: fontSizes.xs, fontWeight: '600' },
});
