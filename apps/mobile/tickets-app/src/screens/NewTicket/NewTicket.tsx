import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Field, Input, LoadingIndicator, Select, useToast } from '@vuotto/mobile';
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
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [loading, setLoading] = useState(false);
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
      toast.show({
        tone: 'danger',
        title: err instanceof Error ? err.message : 'Falha ao criar o chamado.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Field label="Prioridade">
        <Select
          value={priority}
          onChange={(v) => setPriority(v as TicketPriority)}
          options={ALL_PRIORITIES.map((p) => ({ label: PRIORITY_LABELS[p], value: p }))}
        />
      </Field>
      {isAdmin && (
        <Field label="Responsável">
          <Select
            value={assigneeId}
            onChange={(v) => setAssigneeId(v)}
            options={[
              { label: 'Nenhum', value: '' },
              ...users.map((u) => ({ label: u.name, value: u.uid })),
            ]}
          />
        </Field>
      )}
      <Field label="Título">
        <Input placeholder="Título do chamado" value={title} onChangeText={setTitle} />
      </Field>
      <Field label="Descrição">
        <Input
          placeholder="Descreva o problema..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </Field>
      <LoadingIndicator visible={loading} />
      <Button onPress={handleSave} disabled={!title.trim() || loading}>
        Salvar Ticket
      </Button>
    </ScrollView>
  );
}
