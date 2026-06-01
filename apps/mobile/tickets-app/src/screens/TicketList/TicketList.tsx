import { View, Text, FlatList } from 'react-native';
import { LoadingIndicator, Snackbar } from '@ds/mobile';
import { useTicketList } from '../../hooks/useTicketList';
import { TicketCard } from '../../components/TicketCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { styles } from './TicketList.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'TicketList'>;

export function TicketList({ route, navigation }: Props) {
  const { status } = route.params;
  const { tickets, loading, error, clearError } = useTicketList(status);

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
          <View style={styles.ticketItem}>
            <TicketCard
              title={item.title}
              status={item.status}
              priority={item.priority}
              creatorName={item.creatorName}
              createdAt={item.createdAt}
              assigneeName={item.assigneeName}
              onPress={() => navigation.replace('TicketDetails', { ticketId: item.id })}
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
        visible={error !== null}
        onDismiss={clearError}
        message={error ?? ''}
        variant="error"
        position="top"
      />
    </View>
  );
}
