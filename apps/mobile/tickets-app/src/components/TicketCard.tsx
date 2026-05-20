import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: STATUS_COLORS[status] }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.badge, { backgroundColor: STATUS_COLORS[status] + '20' }]}>
        <Text style={[styles.badgeText, { color: STATUS_COLORS[status] }]}>
          {STATUS_LABELS[status]}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  title: { fontSize: 15, fontWeight: '500', flex: 1, marginRight: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600' },
});
