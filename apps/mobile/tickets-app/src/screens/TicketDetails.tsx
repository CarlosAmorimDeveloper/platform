import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { LoadingIndicator, Button, Snackbar } from '@ds/mobile';
import { db } from '../services/firebase';
import { useAuthStore } from '../store/useAuthStore';
import type { TicketStatus } from '../components/TicketCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'TicketDetails'>;

interface TicketData {
  title: string;
  description: string;
  status: TicketStatus;
}

const ALL_STATUSES: TicketStatus[] = ['open', 'in_progress', 'done'];

const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  done: 'Done',
};

const STATUS_COLORS: Record<TicketStatus, string> = {
  open: '#ef4444',
  in_progress: '#f59e0b',
  done: '#22c55e',
};

export function TicketDetails({ route }: Props) {
  const { ticketId } = route.params;
  const user = useAuthStore((s) => s.user);
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'tickets', ticketId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setTicket({
          title: data.title as string,
          description: data.description as string,
          status: (data.status ?? 'open') as TicketStatus,
        });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [ticketId]);

  async function handleStatusChange(newStatus: TicketStatus) {
    try {
      await updateDoc(doc(db, 'tickets', ticketId), { status: newStatus });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <LoadingIndicator />
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.center}>
        <Text>Ticket not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{ticket.title}</Text>
      <Text style={styles.description}>{ticket.description}</Text>

      <Text style={styles.sectionLabel}>Status</Text>

      {user?.role === 'admin' ? (
        <View style={styles.statusRow}>
          {ALL_STATUSES.map((s) => (
            <Button
              key={s}
              variant={ticket.status === s ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => handleStatusChange(s)}
            >
              {STATUS_LABELS[s]}
            </Button>
          ))}
        </View>
      ) : (
        <View
          style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[ticket.status] + '20' }]}
        >
          <Text style={[styles.statusBadgeText, { color: STATUS_COLORS[ticket.status] }]}>
            {STATUS_LABELS[ticket.status]}
          </Text>
        </View>
      )}

      <Snackbar
        visible={errorMessage !== null}
        onDismiss={() => setErrorMessage(null)}
        message={errorMessage ?? ''}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  description: { fontSize: 16, color: '#6b7280', lineHeight: 24 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginTop: 8 },
  statusRow: { flexDirection: 'row', gap: 8 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusBadgeText: { fontSize: 14, fontWeight: '600' },
});
