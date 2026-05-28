import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore';
import { LoadingIndicator, Snackbar } from '@ds/mobile';
import { colors, fontSizes, spacing } from '@ds/tokens';
import { db } from '../services/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { TicketCard, type TicketStatus } from '../components/TicketCard';
import type { TicketPriority } from '../constants/ticketPriority';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'TicketList'>;

interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  creatorName: string;
  createdAt: Timestamp | null;
}

function toTicket(doc: QueryDocumentSnapshot): Ticket {
  const data = doc.data();
  return {
    id: doc.id,
    title: (data.title ?? '') as string,
    status: (data.status ?? 'open') as TicketStatus,
    priority: (data.priority ?? 'medium') as TicketPriority,
    creatorName: (data.creator_name ?? '') as string,
    createdAt: (data.createdAt as Timestamp) ?? null,
  };
}

export function TicketList({ route, navigation }: Props) {
  const { status } = route.params;
  const user = useAuthStore((s) => s.user);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const col = collection(db, 'tickets');
    const q =
      user.role === 'admin'
        ? query(col, orderBy('createdAt', 'desc'))
        : query(col, where('creator_id', '==', user.uid), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setTickets(snap.docs.map(toTicket).filter((t) => !status || t.status === status));
        setLoading(false);
      },
      () => {
        setLoading(false);
        setErrorMessage('Erro ao carregar os chamados.');
      },
    );

    return unsubscribe;
  }, [user, status]);

  if (loading) {
    return (
      <View style={styles.center}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: spacing[4], marginHorizontal: spacing[1] }}>
            <TicketCard
              title={item.title}
              status={item.status}
              priority={item.priority}
              creatorName={item.creatorName}
              createdAt={item.createdAt}
              onPress={() => navigation.navigate('TicketDetails', { ticketId: item.id })}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Nenhum ticket encontrado.</Text>
          </View>
        }
        contentContainerStyle={tickets.length === 0 ? styles.fillHeight : styles.list}
      />
      <Snackbar
        visible={errorMessage !== null}
        onDismiss={() => setErrorMessage(null)}
        message={errorMessage ?? ''}
        variant="error"
        position="top"
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
  fillHeight: { flex: 1 },
  list: { paddingVertical: spacing[2] },
  emptyText: { color: `${colors.neutral[500]}`, fontSize: fontSizes.base },
});
