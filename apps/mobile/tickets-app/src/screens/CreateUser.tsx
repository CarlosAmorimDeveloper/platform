import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FirebaseError, initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Input, Button, LoadingIndicator, Snackbar, Select } from '@ds/mobile';
import { fontSizes, spacing } from '@ds/tokens';
import { firebaseConfig, db } from '../services/firebase';
import { useAuthStore, type UserRole } from '../store/useAuthStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'CreateUser'>;

const ROLE_OPTIONS = [
  { label: 'Padrão', value: 'standard' },
  { label: 'Administrador', value: 'admin' },
];

export function CreateUser({ navigation }: Props) {
  const currentUser = useAuthStore((s) => s.user);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('standard');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successVisible, setSuccessVisible] = useState(false);

  if (currentUser?.role !== 'admin') {
    navigation.goBack();
    return null;
  }

  const passwordError =
    password.length > 0 && password.length < 6 ? 'Mínimo de 6 caracteres' : undefined;

  const isValid = name.trim() !== '' && email.trim() !== '' && password.length >= 6;

  async function handleCreate() {
    if (!isValid) return;
    setLoading(true);
    const secondaryApp = initializeApp(firebaseConfig, `secondary-${Date.now()}`);
    const secondaryAuth = getAuth(secondaryApp);
    try {
      const { user } = await createUserWithEmailAndPassword(secondaryAuth, email.trim(), password);
      await setDoc(doc(db, 'users', user.uid), {
        email: email.trim(),
        name: name.trim(),
        role,
      });
      await signOut(secondaryAuth);
      setSuccessVisible(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (err: unknown) {
      const message =
        err instanceof FirebaseError
          ? 'Não foi possível criar o usuário.'
          : err instanceof Error
            ? err.message
            : 'Falha ao criar usuário';
      setErrorMessage(message);
    } finally {
      await deleteApp(secondaryApp).catch(() => undefined);
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Usuário</Text>
      <Input label="Nome" placeholder="Nome completo" value={name} onChangeText={setName} />
      <Input label="Email" placeholder="email@exemplo.com" value={email} onChangeText={setEmail} />
      <Input
        label="Senha"
        placeholder="Mínimo 6 caracteres"
        secureTextEntry
        showPasswordToggle
        value={password}
        onChangeText={setPassword}
        error={passwordError}
      />
      <Select
        label="Perfil"
        value={role}
        onChange={(v) => setRole(v as UserRole)}
        options={ROLE_OPTIONS}
      />
      <LoadingIndicator visible={loading} />
      <Button onPress={handleCreate} disabled={!isValid || loading}>
        Criar Usuário
      </Button>
      <Button variant="secondary" onPress={() => navigation.goBack()}>
        Cancelar
      </Button>
      <Snackbar
        visible={successVisible}
        onDismiss={() => setSuccessVisible(false)}
        message="Usuário criado com sucesso!"
        variant="success"
      />
      <Snackbar
        visible={errorMessage !== null}
        onDismiss={() => setErrorMessage(null)}
        message={errorMessage ?? ''}
        variant="error"
        position="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing[3], padding: spacing[6] },
  title: { fontSize: fontSizes['2xl'], fontWeight: 'bold', marginBottom: spacing[2] },
});
