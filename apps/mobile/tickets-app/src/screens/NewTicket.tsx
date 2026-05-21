import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Input, Button, LoadingIndicator, Snackbar } from '@ds/mobile';
import { db } from '../services/firebase';
import { useAuthStore } from '../store/useAuthStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'NewTicket'>;

export function NewTicket({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
        creator_id: user.uid,
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
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.textarea]}
        placeholder="Describe the issue..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
      <LoadingIndicator visible={loading} />
      <Button onPress={handleSave} disabled={!title.trim() || loading}>
        Save Ticket
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
  container: { padding: 24, gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  textarea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    minHeight: 100,
  },
});
