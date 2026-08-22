import { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, LoadingIndicator, useTheme, useToast } from '@vuotto/mobile';
import { useTicketList } from '../../hooks/useTicketList';
import { STATUS_LABELS } from '../../constants/ticketStatus';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { styles } from './TicketList.styles';
import { TicketCard } from './components/TicketCard';

type Props = NativeStackScreenProps<AppStackParamList, 'TicketList'>;

export function TicketList({ route, navigation }: Props) {
  const { colors } = useTheme();
  const toast = useToast();
  const { status } = route.params;
  const { tickets, loading, error, clearError } = useTicketList(status);

  useEffect(() => {
    if (!error) return;
    toast.show({ tone: 'danger', title: error });
    clearError();
  }, [error, toast, clearError]);

  const appBar = (
    <AppBar
      title={status ? STATUS_LABELS[status] : 'Todos os chamados'}
      onBackPress={() => navigation.goBack()}
    />
  );

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={styles.flex}>
        {appBar}
        <View style={styles.center}>
          <LoadingIndicator />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.flex}>
      {appBar}
      <View style={[styles.container, { backgroundColor: colors.bgCanvas }]}>
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
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Nenhum ticket encontrado.
              </Text>
            </View>
          }
          contentContainerStyle={tickets.length === 0 ? styles.fillHeight : styles.list}
        />
      </View>
    </SafeAreaView>
  );
}
