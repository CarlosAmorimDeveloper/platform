import { View, Text, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LoadingIndicator, FAB, Card, PieChart, Snackbar } from '@ds/mobile';
import { colors } from '@ds/tokens';
import { useTicketList } from '../../hooks/useTicketList';
import { formatDate } from '../../domain/ticket';
import type { Ticket } from '../../domain/ticket';
import type { TicketStatus } from '../../constants/ticketStatus';
import { ALL_STATUSES, STATUS_LABELS, STATUS_COLORS } from '../../constants/ticketStatus';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { styles } from './Dashboard.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'Dashboard'>;

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
    <View style={styles.statCardWrapper}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.statBadge, { backgroundColor: STATUS_COLORS[status] }]}
      >
        <Text style={[styles.statLabel, { color: 'white' }]}>
          {STATUS_LABELS[status]} {count}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function RecentTicketsCard({
  tickets,
  onPressTicket,
}: {
  tickets: Ticket[];
  onPressTicket: (id: string) => void;
}) {
  const recent = tickets.slice(0, 3);
  if (recent.length === 0) return null;
  return (
    <Card title="Chamados Recentes">
      {recent.map((t, i) => (
        <Pressable
          key={t.id}
          onPress={() => onPressTicket(t.id)}
          style={[styles.recentItem, i === recent.length - 1 && { borderBottomWidth: 0 }]}
        >
          <Text style={styles.recentTitle}>{t.title}</Text>
          <Text style={styles.recentMeta}>
            Criado por: {t.creatorName} · {formatDate(t.createdAt)}
          </Text>
        </Pressable>
      ))}
    </Card>
  );
}

export function Dashboard({ navigation }: Props) {
  const { tickets, loading, error, clearError } = useTicketList();

  if (loading) {
    return (
      <View style={styles.center}>
        <LoadingIndicator />
      </View>
    );
  }

  if (tickets.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <MaterialIcons name="inbox" size={64} color={`${colors.neutral[300]}`} />
          <Text style={styles.emptyTitle}>Nenhum chamado ainda</Text>
          <Text style={styles.emptySubtitle}>Crie o primeiro chamado usando o botão abaixo</Text>
        </View>
        <FAB
          onPress={() => navigation.navigate('NewTicket')}
          style={styles.fab}
          accessibilityLabel="New ticket"
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

  return (
    <View style={styles.container}>
      {tickets.length > 0 && (
        <View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={ALL_STATUSES}
            renderItem={({ item: s }) => (
              <StatusStatCard
                key={s}
                status={s}
                count={tickets.filter((t) => t.status === s).length}
                onPress={() => navigation.navigate('TicketList', { status: s })}
              />
            )}
            ListHeaderComponent={<View style={styles.listHeaderSpacer} />}
            ListFooterComponent={<View style={styles.listFooterSpacer} />}
          />
        </View>
      )}
      {tickets.length > 0 && (
        <View style={styles.sectionPad}>
          <PieChart
            slices={ALL_STATUSES.map((s) => ({
              label: STATUS_LABELS[s],
              value: tickets.filter((t) => t.status === s).length,
              color: STATUS_COLORS[s],
            }))}
            onPress={() => navigation.navigate('TicketList', {})}
          />
        </View>
      )}
      <View style={styles.sectionPad}>
        <RecentTicketsCard
          tickets={tickets}
          onPressTicket={(id) => navigation.navigate('TicketDetails', { ticketId: id })}
        />
      </View>
      <FAB
        onPress={() => navigation.navigate('NewTicket')}
        style={styles.fab}
        accessibilityLabel="New ticket"
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
