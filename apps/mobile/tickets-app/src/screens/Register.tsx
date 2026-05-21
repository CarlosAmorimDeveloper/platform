import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Input, Button, LoadingIndicator, Snackbar } from '@ds/mobile';
import { auth, db } from '../services/firebase';
import { useAuthStore } from '../store/useAuthStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function Register({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setUser = useAuthStore((s) => s.setUser);

  async function handleRegister() {
    if (!email || !password) return;
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', user.uid), { email, role: 'standard' });
      setUser({ uid: user.uid, email, role: 'standard' });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Input label="Email" placeholder="Email" value={email} onChangeText={setEmail} />
      <Input
        label="Senha"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <LoadingIndicator visible={loading} />
      <Button onPress={handleRegister} disabled={loading}>
        Sign Up
      </Button>
      <Button variant="secondary" onPress={() => navigation.navigate('Login')}>
        Back to Login
      </Button>
      <Snackbar
        visible={errorMessage !== null}
        onDismiss={() => setErrorMessage(null)}
        message={errorMessage ?? ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
});
