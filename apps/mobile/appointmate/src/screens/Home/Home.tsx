import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, Button, EmptyState, IconButton, Menu, useToast } from '@industry/mobile';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { listForms, type FormSummary } from '../../services/formsService';
import { mapFirestoreError } from '../../utils/firebaseErrors';
import {
  DEFAULT_TIME_FILTER,
  TIME_FILTER_PRESETS,
  isWithinTimeFilter,
  type TimeFilter,
} from '../../domain/timeFilter';
import { LoadingView } from '../../components/LoadingView';
import { ErrorView } from '../../components/ErrorView';
import { FormCard } from './FormCard';
import { styles } from './Home.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

// "Personalizado" needs its own date-range inputs, which don't fit this
// compact menu — left out of the selectable presets for now.
const SELECTABLE_PRESETS = TIME_FILTER_PRESETS.filter((preset) => preset.value !== 'personalizado');

export function Home({ navigation }: Props) {
  const { user, logout } = useAuth();
  const toast = useToast();

  const [forms, setForms] = useState<FormSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<TimeFilter>(DEFAULT_TIME_FILTER);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  const loadForms = useCallback(
    (options?: { silent?: boolean }) => {
      if (!user) return;
      if (!options?.silent) setLoading(true);
      listForms(user.uid)
        .then((result) => {
          setForms(result);
          setErrorMessage(null);
        })
        .catch((err) => {
          const message = mapFirestoreError(err, 'Não foi possível carregar seus formulários.');
          setErrorMessage(message);
          if (options?.silent) toast.show({ tone: 'danger', title: message });
        })
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
        });
    },
    [user, toast],
  );

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  // Refetch whenever Home regains focus (e.g. returning here after deleting
  // a form on FormDetail) — using the `navigation` prop's own `addListener`
  // instead of the `useFocusEffect`/`useNavigation()` hook, since the latter
  // needs a real Navigator context that this app's tests don't provide.
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadForms({ silent: true });
    });
    return unsubscribe;
  }, [navigation, loadForms]);

  const appBar = (
    <AppBar
      title="Meus formulários"
      actions={[
        {
          icon: 'LogOut',
          onPress: logout,
          label: 'Sair',
          testID: 'home-logout-button',
        },
      ]}
      testID="home-app-bar"
    />
  );

  function onRefresh() {
    setRefreshing(true);
    loadForms({ silent: true });
  }

  function onFilterMenuOpenChange(open: boolean) {
    setFilterMenuVisible(open);
    if (!open) loadForms({ silent: true });
  }

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={styles.screen}>
        {appBar}
        <LoadingView testID="home-loading" />
      </SafeAreaView>
    );
  }

  if (errorMessage && forms.length === 0) {
    return (
      <SafeAreaView edges={['top']} style={styles.screen}>
        {appBar}
        <ErrorView description={errorMessage} onAction={() => loadForms()} testID="home-error" />
      </SafeAreaView>
    );
  }

  const filteredForms = forms.filter((form) => isWithinTimeFilter(form.createdAt, filter));

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      {appBar}
      <FlatList
        testID="home-list"
        data={filteredForms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FormCard
            form={item}
            onPress={() => navigation.navigate('FormDetail', { formId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            testID="home-refresh-control"
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.actionsRow}>
              <Button
                onPress={() => navigation.navigate('FormEntry', undefined)}
                testID="home-new-form-button"
              >
                Novo formulário
              </Button>
              <Menu
                open={filterMenuVisible}
                onOpenChange={onFilterMenuOpenChange}
                trigger={
                  <IconButton
                    icon="ListFilter"
                    variant="solid"
                    label="Filtrar por período"
                    onPress={() => setFilterMenuVisible(true)}
                    testID="home-filter-icon-button"
                  />
                }
                items={SELECTABLE_PRESETS.map((preset) => ({
                  key: preset.value,
                  label: preset.label,
                  onSelect: () => {
                    setFilter({ preset: preset.value, customStart: '', customEnd: '' });
                  },
                }))}
                testID="home-filter-menu"
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          forms.length === 0 ? (
            <EmptyState
              title="Nenhum formulário ainda"
              body="Crie seu primeiro formulário de preparação para o retorno."
              testID="home-empty-state"
            />
          ) : (
            <EmptyState
              title="Nenhum formulário neste período"
              body="Tente outro filtro de tempo."
              testID="home-empty-filtered-state"
            />
          )
        }
      />
    </SafeAreaView>
  );
}
