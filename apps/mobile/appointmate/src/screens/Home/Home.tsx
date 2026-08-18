import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import {
  AppBar,
  Button,
  EmptyState,
  ErrorView,
  IconButton,
  LoadingView,
  Menu,
  Snackbar,
} from '@ds/mobile';
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
import { FormCard } from './FormCard';
import { styles } from './Home.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

// "Personalizado" needs its own date-range inputs, which don't fit this
// compact menu — left out of the selectable presets for now.
const SELECTABLE_PRESETS = TIME_FILTER_PRESETS.filter((preset) => preset.value !== 'personalizado');

export function Home({ navigation }: Props) {
  const { user, logout } = useAuth();

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
          setErrorMessage(mapFirestoreError(err, 'Não foi possível carregar seus formulários.'));
        })
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
        });
    },
    [user],
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
          icon: 'logout',
          onPress: logout,
          accessibilityLabel: 'Sair',
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

  function closeFilterMenu() {
    setFilterMenuVisible(false);
    loadForms({ silent: true });
  }

  if (loading) {
    return (
      <View style={styles.screen}>
        {appBar}
        <LoadingView testID="home-loading" />
      </View>
    );
  }

  if (errorMessage && forms.length === 0) {
    return (
      <View style={styles.screen}>
        {appBar}
        <ErrorView description={errorMessage} onAction={() => loadForms()} testID="home-error" />
      </View>
    );
  }

  const filteredForms = forms.filter((form) => isWithinTimeFilter(form.createdAt, filter));

  return (
    <View style={styles.screen}>
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
                visible={filterMenuVisible}
                onDismiss={closeFilterMenu}
                anchor={
                  <IconButton
                    icon="filter-variant"
                    variant="primary"
                    accessibilityLabel="Filtrar por período"
                    onPress={() => setFilterMenuVisible(true)}
                    testID="home-filter-icon-button"
                  />
                }
                items={SELECTABLE_PRESETS.map((preset) => ({
                  label: preset.label,
                  onPress: () => {
                    setFilter({ preset: preset.value, customStart: '', customEnd: '' });
                    closeFilterMenu();
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
              description="Crie seu primeiro formulário de preparação para o retorno."
              testID="home-empty-state"
            />
          ) : (
            <EmptyState
              title="Nenhum formulário neste período"
              description="Tente outro filtro de tempo."
              testID="home-empty-filtered-state"
            />
          )
        }
      />
      <Snackbar
        visible={errorMessage !== null && forms.length > 0}
        onDismiss={() => setErrorMessage(null)}
        message={errorMessage ?? ''}
        position="top"
        variant="error"
        testID="home-error-snackbar"
      />
    </View>
  );
}
