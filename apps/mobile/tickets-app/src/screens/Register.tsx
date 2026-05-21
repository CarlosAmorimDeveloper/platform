import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Input, Button, LoadingIndicator, Snackbar } from '@ds/mobile';
import { fontSizes, spacing } from '@ds/tokens';
import { auth, db } from '../services/firebase';
import { useAuthStore } from '../store/useAuthStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function Register({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setUser = useAuthStore((s) => s.setUser);

  async function handleRegister() {
    if (!name.trim() || !email || !password) return;
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', user.uid), { email, role: 'standard', name: name.trim() });
      setUser({ uid: user.uid, email, name: name.trim(), role: 'standard' });
    } catch (err: unknown) {
      const message =
        err instanceof FirebaseError && err.code === 'auth/email-already-in-use'
          ? 'Não foi possível criar a conta.'
          : err instanceof Error
            ? err.message
            : 'Registration failed';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Input label="Nome" placeholder="Seu nome" value={name} onChangeText={setName} />
      <Input label="Email" placeholder="Email" value={email} onChangeText={setEmail} />
      <Input
        label="Senha"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <LoadingIndicator visible={loading} />
      <Button onPress={handleRegister} disabled={!name.trim() || loading}>
        Sign Up
      </Button>
      <Button variant="secondary" onPress={() => navigation.navigate('Login')}>
        Back to Login
      </Button>
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
  container: {
    flex: 1,
    gap: spacing[3],
    padding: spacing[6],
  },
  title: { fontSize: fontSizes['2xl'], fontWeight: 'bold', marginBottom: spacing[2] },
});
