import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { doc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { LoadingIndicator, Button, Snackbar, Dialog } from '@ds/mobile';
import { db } from '../services/firebase';
import { useAuthStore } from '../store/useAuthStore';
import {
  ALL_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  type TicketStatus,
} from '../constants/ticketStatus';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'TicketDetails'>;

interface TicketData {
  title: string;
  description: string;
  status: TicketStatus;
}

export function TicketDetails({ route, navigation }: Props) {
  const { ticketId } = route.params;
  const user = useAuthStore((s) => s.user);
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);

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

  async function handleDelete() {
    try {
      await deleteDoc(doc(db, 'tickets', ticketId));
      navigation.goBack();
    } catch (err: unknown) {
      setDeleteVisible(false);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to delete ticket');
    }
  }

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
        <>
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
          <Button variant="danger" onPress={() => setDeleteVisible(true)}>
            Apagar ticket
          </Button>
        </>
      ) : (
        <View
          style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[ticket.status] + '20' }]}
        >
          <Text style={[styles.statusBadgeText, { color: STATUS_COLORS[ticket.status] }]}>
            {STATUS_LABELS[ticket.status]}
          </Text>
        </View>
      )}

      <Dialog
        visible={deleteVisible}
        onDismiss={() => setDeleteVisible(false)}
        title="Apagar ticket"
        actions={[
          <Button key="cancel" variant="ghost" onPress={() => setDeleteVisible(false)}>
            Cancelar
          </Button>,
          <Button key="confirm" variant="danger" onPress={handleDelete}>
            Apagar
          </Button>,
        ]}
      >
        <Text>Esta ação não pode ser desfeita.</Text>
      </Dialog>
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
