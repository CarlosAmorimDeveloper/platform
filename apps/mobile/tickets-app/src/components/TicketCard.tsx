import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@ds/mobile';

export type TicketStatus = 'open' | 'in_progress' | 'done';

interface Props {
  title: string;
  status: TicketStatus;
  onPress: () => void;
}

const STATUS_COLORS: Record<TicketStatus, string> = {
  open: '#ef4444',
  in_progress: '#f59e0b',
  done: '#22c55e',
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  done: 'Done',
};

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
