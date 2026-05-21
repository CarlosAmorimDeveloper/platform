import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@ds/mobile';
import { STATUS_COLORS, STATUS_LABELS, type TicketStatus } from '../constants/ticketStatus';

export type { TicketStatus } from '../constants/ticketStatus';

interface Props {
  title: string;
  status: TicketStatus;
  onPress: () => void;
}

export function TicketCard({ title, status, onPress }: Props) {
  return (
    <Card title={title} onPress={onPress}>
      <View style={[styles.badge, { backgroundColor: STATUS_COLORS[status] + '20' }]}>
        <Text style={[styles.badgeText, { color: STATUS_COLORS[status] }]}>
          {STATUS_LABELS[status]}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  badgeText: { fontSize: 12, fontWeight: '600' },
});
