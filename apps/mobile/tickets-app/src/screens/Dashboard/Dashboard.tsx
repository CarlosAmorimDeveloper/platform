import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppBar,
  Badge,
  Button,
  Card,
  FAB,
  Icon,
  PieChart,
  Sheet,
  Spinner,
  useTheme,
  useToast,
  type AppBarAction,
} from '@industry/mobile';
import { alpha, viz } from '@industry/tokens';
import { useTicketList } from '../../hooks/useTicketList';
import { useAuthStore } from '../../store/useAuthStore';
import { formatDate } from '../../domain/ticket';
import type { Ticket } from '../../domain/ticket';
import type { TicketStatus } from '../../constants/ticketStatus';
import { ALL_STATUSES, STATUS_LABELS, STATUS_TONES } from '../../constants/ticketStatus';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { styles } from './Dashboard.styles';

const STATUS_VIZ_COLOR: Record<TicketStatus, string> = {
  open: viz['1'],
  in_progress: viz['4'],
  done: viz['3'],
};

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
      <Pressable onPress={onPress}>
        <Badge tone={STATUS_TONES[status]}>{`${STATUS_LABELS[status]} ${count}`}</Badge>
      </Pressable>
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
  const { colors } = useTheme();
  const recent = tickets.slice(0, 3);
  if (recent.length === 0) return null;
  return (
    <Card>
      <Text style={[styles.cardTitle, { color: colors.text }]}>Chamados Recentes</Text>
      {recent.map((t, i) => (
        <Pressable
          key={t.id}
          onPress={() => onPressTicket(t.id)}
          style={[
            styles.recentItem,
            { borderBottomColor: colors.divider },
            i === recent.length - 1 && { borderBottomWidth: 0 },
          ]}
        >
          <Text style={[styles.recentTitle, { color: colors.text }]}>{t.title}</Text>
          <Text style={[styles.recentMeta, { color: alpha(colors.text, 70) }]}>
            Criado por: {t.creatorName} · {formatDate(t.createdAt)}
          </Text>
        </Pressable>
      ))}
    </Card>
  );
}

export function Dashboard({ navigation }: Props) {
  const { colors } = useTheme();
  const toast = useToast();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { tickets, loading, error, clearError } = useTicketList();
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    if (!error) return;
    toast.show({ tone: 'danger', title: error });
    clearError();
  }, [error, toast, clearError]);

  const actions: AppBarAction[] = [];
  if (user?.role === 'admin') {
    actions.push({
      icon: 'UserPlus',
      label: 'Criar usuário',
      onPress: () => navigation.navigate('CreateUser'),
    });
  }
  actions.push({ icon: 'LogOut', label: 'Sair', onPress: () => setLogoutOpen(true) });

  const appBar = <AppBar title="Painel" actions={actions} />;

  const logoutSheet = (
    <Sheet
      testID="logout-sheet"
      open={logoutOpen}
      onDismiss={() => setLogoutOpen(false)}
      title="Sair da conta"
      actions={
        <>
          <Button key="cancel" variant="ghost" onPress={() => setLogoutOpen(false)}>
            Cancelar
          </Button>
          <Button key="confirm" variant="danger" onPress={logout}>
            Sair
          </Button>
        </>
      }
    >
      <Text style={{ color: colors.text }}>Tem certeza que deseja sair?</Text>
    </Sheet>
  );

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={styles.flex}>
        {appBar}
        <View style={styles.center}>
          <Spinner />
        </View>
        {logoutSheet}
      </SafeAreaView>
    );
  }

  if (tickets.length === 0) {
    return (
      <SafeAreaView edges={['top']} style={styles.flex}>
        {appBar}
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
          <View style={styles.emptyState}>
            <Icon name="Inbox" size={64} color={alpha(colors.text, 50)} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhum chamado ainda</Text>
            <Text style={[styles.emptySubtitle, { color: alpha(colors.text, 50) }]}>
              Crie o primeiro chamado usando o botão abaixo
            </Text>
          </View>
          <FAB
            onPress={() => navigation.navigate('NewTicket')}
            style={styles.fab}
            label="New ticket"
          />
        </View>
        {logoutSheet}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.flex}>
      {appBar}
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
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
          <Pressable
            accessibilityLabel="Ver todos os chamados"
            style={styles.sectionPad}
            onPress={() => navigation.navigate('TicketList', {})}
          >
            <PieChart
              slices={ALL_STATUSES.map((s) => ({
                label: STATUS_LABELS[s],
                value: tickets.filter((t) => t.status === s).length,
                color: STATUS_VIZ_COLOR[s],
              }))}
            />
          </Pressable>
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
          label="New ticket"
        />
      </View>
      {logoutSheet}
    </SafeAreaView>
  );
}
