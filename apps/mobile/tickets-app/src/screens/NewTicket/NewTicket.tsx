import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Input, Button, LoadingIndicator, Snackbar, Select } from '@ds/mobile';
import { createTicket } from '../../services/ticketService';
import { useAuthStore } from '../../store/useAuthStore';
import { useUserList } from '../../hooks/useUserList';
import {
  ALL_PRIORITIES,
  PRIORITY_LABELS,
  type TicketPriority,
} from '../../constants/ticketPriority';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { styles } from './NewTicket.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'NewTicket'>;

export function NewTicket({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const { users } = useUserList();

  const isAdmin = user?.role === 'admin';

  async function handleSave() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !user) return;
    setLoading(true);
    try {
      const selectedUser = users.find((u) => u.uid === assigneeId);
      await createTicket(
        {
          title: trimmedTitle,
          description: description.trim(),
          priority,
          assigneeId: selectedUser?.uid ?? null,
          assigneeName: selectedUser?.name ?? null,
        },
        user,
      );
      navigation.goBack();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Falha ao criar o chamado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Select
        label="Prioridade"
        value={priority}
        onChange={(v) => setPriority(v as TicketPriority)}
        options={ALL_PRIORITIES.map((p) => ({ label: PRIORITY_LABELS[p], value: p }))}
      />
      {isAdmin && (
        <Select
          label="Responsável"
          value={assigneeId}
          onChange={(v) => setAssigneeId(v)}
          options={[
            { label: 'Nenhum', value: '' },
            ...users.map((u) => ({ label: u.name, value: u.uid })),
          ]}
        />
      )}
      <Input label="Título" placeholder="Título do chamado" value={title} onChangeText={setTitle} />
      <Input
        label="Descrição"
        placeholder="Descreva o problema..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <LoadingIndicator visible={loading} />
      <Button onPress={handleSave} disabled={!title.trim() || loading}>
        Salvar Ticket
      </Button>
      <Snackbar
        visible={errorMessage !== null}
        onDismiss={() => setErrorMessage(null)}
        message={errorMessage ?? ''}
        variant="error"
        position="top"
      />
    </ScrollView>
  );
}
