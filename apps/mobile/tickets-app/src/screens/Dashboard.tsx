import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { TicketCard, type TicketStatus } from '../components/TicketCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'Dashboard'>;

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
        <ActivityIndicator size="large" />
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
            <Text style={styles.emptyText}>No tickets yet.</Text>
          </View>
        }
        contentContainerStyle={tickets.length === 0 ? styles.fillHeight : styles.list}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NewTicket')}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fillHeight: { flex: 1 },
  list: { paddingVertical: 8 },
  emptyText: { color: '#888', fontSize: 16 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabIcon: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
