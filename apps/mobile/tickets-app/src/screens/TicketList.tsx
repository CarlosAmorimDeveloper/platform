import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { LoadingIndicator } from '@ds/mobile';
import { colors, fontSizes, spacing } from '@ds/tokens';
import { db } from '../services/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { TicketCard, type TicketStatus } from '../components/TicketCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'TicketList'>;

interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
}

function toTicket(doc: QueryDocumentSnapshot): Ticket {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title as string,
    status: (data.status ?? 'open') as TicketStatus,
  };
}

export function TicketList({ route, navigation }: Props) {
  const { status } = route.params;
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
      setTickets(snap.docs.map(toTicket).filter((t) => t.status === status));
      setLoading(false);
    });

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
          <TicketCard
            title={item.title}
            status={item.status}
            onPress={() => navigation.navigate('TicketDetails', { ticketId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Nenhum ticket encontrado.</Text>
          </View>
        }
        contentContainerStyle={tickets.length === 0 ? styles.fillHeight : styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: `${colors.neutral[100]}` },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fillHeight: { flex: 1 },
  list: { paddingVertical: spacing[2] },
  emptyText: { color: `${colors.neutral[500]}`, fontSize: fontSizes.base },
});
