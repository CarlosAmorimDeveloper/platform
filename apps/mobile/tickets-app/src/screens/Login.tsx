import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Input, Button, LoadingIndicator, Snackbar } from '@ds/mobile';
import { fontSizes, spacing } from '@ds/tokens';
import { auth, db } from '../services/firebase';
import { useAuthStore, type UserRole } from '../store/useAuthStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function Login({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setUser = useAuthStore((s) => s.setUser);

  async function handleLogin() {
    if (!email || !password) return;
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, 'users', user.uid));
      const data = snap.data();
      const role = (data?.role ?? 'standard') as UserRole;
      const name = (data?.name ?? user.email ?? email) as string;
      setUser({ uid: user.uid, email: user.email ?? email, name, role });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Input label="Email" placeholder="Email" value={email} onChangeText={setEmail} />
      <Input
        label="Senha"
        placeholder="Password"
        secureTextEntry
        showPasswordToggle
        value={password}
        onChangeText={setPassword}
      />
      <LoadingIndicator visible={loading} />
      <Button onPress={handleLogin} disabled={loading}>
        Sign In
      </Button>
      <Button variant="secondary" onPress={() => navigation.navigate('Register')}>
        Create Account
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
  container: {
    flex: 1,
    gap: spacing[3],
    padding: spacing[6],
  },
  title: { fontSize: fontSizes['2xl'], fontWeight: 'bold', marginBottom: spacing[2] },
});
