import { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { spacing } from '@ds/tokens';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Input, Button, LoadingIndicator, Snackbar, Select } from '@ds/mobile';
import { db } from '../services/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { ALL_PRIORITIES, PRIORITY_LABELS, type TicketPriority } from '../constants/ticketPriority';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'NewTicket'>;

export function NewTicket({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);

  async function handleSave() {
    if (!title.trim() || !user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'tickets'), {
        title: title.trim(),
        description: description.trim(),
        priority,
        creator_id: user.uid,
        creator_name: user.name,
        status: 'open',
        createdAt: serverTimestamp(),
      });
      navigation.goBack();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Input label="Title" placeholder="Ticket title" value={title} onChangeText={setTitle} />
      <Input
        label="Description"
        placeholder="Describe the issue..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <Select
        label="Prioridade"
        value={priority}
        onChange={(v) => setPriority(v as TicketPriority)}
        options={ALL_PRIORITIES.map((p) => ({ label: PRIORITY_LABELS[p], value: p }))}
      />
      <LoadingIndicator visible={loading} />
      <Button onPress={handleSave} disabled={!title.trim() || loading}>
        Salvar Ticket
      </Button>
      <Snackbar
        visible={errorMessage !== null}
        onDismiss={() => setErrorMessage(null)}
        message={errorMessage ?? ''}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing[6], gap: spacing[2] },
});
