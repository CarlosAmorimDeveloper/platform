import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { Button, EmptyState, ErrorView, LoadingView, Snackbar } from '@ds/mobile';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { listForms, type FormSummary } from '../../services/formsService';
import { DEFAULT_TIME_FILTER, isWithinTimeFilter, type TimeFilter } from '../../domain/timeFilter';
import { FormCard } from './FormCard';
import { TimeFilterBar } from './TimeFilterBar';
import { styles } from './Home.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

export function Home({ navigation }: Props) {
  const { user, logout } = useAuth();

  const [forms, setForms] = useState<FormSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<TimeFilter>(DEFAULT_TIME_FILTER);

  const loadForms = useCallback(
    (options?: { silent?: boolean }) => {
      if (!user) return;
      if (!options?.silent) setLoading(true);
      listForms(user.uid)
        .then((result) => {
          setForms(result);
          setErrorMessage(null);
        })
        .catch(() => {
          setErrorMessage('Não foi possível carregar seus formulários.');
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

  function onRefresh() {
    setRefreshing(true);
    loadForms({ silent: true });
  }

  if (loading) {
    return <LoadingView testID="home-loading" />;
  }

  if (errorMessage && forms.length === 0) {
    return (
      <ErrorView description={errorMessage} onAction={() => loadForms()} testID="home-error" />
    );
  }

  const filteredForms = forms.filter((form) => isWithinTimeFilter(form.createdAt, filter));

  return (
    <View style={styles.screen}>
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
            <View style={styles.headerTopRow}>
              <Text style={styles.title}>Meus formulários</Text>
              <Button variant="secondary" size="sm" onPress={logout} testID="home-logout-button">
                Sair
              </Button>
            </View>
            <Button
              onPress={() => navigation.navigate('FormEntry', undefined)}
              testID="home-new-form-button"
            >
              Novo formulário
            </Button>
            <TimeFilterBar filter={filter} onChange={setFilter} />
          </View>
        }
        ListEmptyComponent={
          forms.length === 0 ? (
            <EmptyState
              title="Nenhum formulário ainda"
              description="Crie seu primeiro formulário de preparação para o retorno."
              actionLabel="Criar formulário"
              onAction={() => navigation.navigate('FormEntry', undefined)}
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
