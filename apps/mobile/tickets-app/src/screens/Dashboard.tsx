import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { LoadingIndicator, FAB, Card, PieChart } from '@ds/mobile';
import { db } from '../services/firebase';
import { useAuthStore } from '../store/useAuthStore';
import type { TicketStatus } from '../components/TicketCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';
import { colors, fontSizes, spacing, radii } from '@ds/tokens';
import { ALL_STATUSES, STATUS_LABELS, STATUS_COLORS } from '../constants/ticketStatus';

type Props = NativeStackScreenProps<AppStackParamList, 'Dashboard'>;

interface Ticket {
  id: string;
  status: TicketStatus;
}

function toTicket(doc: QueryDocumentSnapshot): Ticket {
  const data = doc.data();
  return {
    id: doc.id,
    status: (data.status ?? 'open') as TicketStatus,
  };
}

function StatusStatCard({
  status,
  count,
  onPress,
}: {
  status: TicketStatus;
  count: number;
  onPress: () => void;
}) {
  return (
    <Card onPress={onPress} style={styles.statCard}>
      <View style={styles.statContent}>
        <Text style={styles.statCount}>{count}</Text>
        <View style={[styles.statBadge, { backgroundColor: STATUS_COLORS[status] + '20' }]}>
          <Text style={[styles.statLabel, { color: STATUS_COLORS[status] }]}>
            {STATUS_LABELS[status]}
          </Text>
        </View>
      </View>
    </Card>
  );
}

export function Dashboard({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const col = collection(db, 'tickets');
    const q =
      user.role === 'admin'
        ? query(col, orderBy('createdAt', 'desc'))
        : query(col, where('creator_id', '==', user.uid), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snap) => {
      setTickets(snap.docs.map(toTicket));
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tickets.length > 0 && (
        <PieChart
          slices={ALL_STATUSES.map((s) => ({
            label: STATUS_LABELS[s],
            value: tickets.filter((t) => t.status === s).length,
            color: STATUS_COLORS[s],
          }))}
        />
      )}
      <View style={styles.statsRow}>
        {ALL_STATUSES.map((s) => (
          <StatusStatCard
            key={s}
            status={s}
            count={tickets.filter((t) => t.status === s).length}
            onPress={() => navigation.navigate('TicketList', { status: s })}
          />
        ))}
      </View>
      <FAB
        onPress={() => navigation.navigate('NewTicket')}
        style={styles.fab}
        accessibilityLabel="New ticket"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: `${colors.neutral[100]}`,
    padding: spacing[4],
    gap: spacing[3],
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: { position: 'absolute', right: spacing[6], bottom: spacing[8] },
  statsRow: { flexDirection: 'row', gap: spacing[2] },
  statCard: { flex: 1 },
  statContent: { alignItems: 'center', gap: spacing[1], paddingVertical: spacing[2] },
  statCount: { fontSize: fontSizes['2xl'], fontWeight: 'bold', color: `${colors.neutral[900]}` },
  statBadge: { paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: radii.xl },
  statLabel: { fontSize: fontSizes.xs, fontWeight: '600' },
});
