import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Input, Button, LoadingIndicator, Snackbar } from '@ds/mobile';
import { colors, fontSizes, spacing } from '@ds/tokens';
import { auth, db } from '../services/firebase';
import { useAuthStore, type UserRole } from '../store/useAuthStore';
import { mapFirebaseAuthError } from '../utils/firebaseErrors';
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
      setErrorMessage(mapFirebaseAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>Tickets App</Text>
          <Text style={styles.appSubtitle}>Gerencie seus chamados</Text>
        </View>
        <View style={styles.form}>
          <Input
            label="E-mail"
            placeholder="email@exemplo.com"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Senha"
            placeholder="Sua senha"
            secureTextEntry
            showPasswordToggle
            value={password}
            onChangeText={setPassword}
          />
          <LoadingIndicator visible={loading} />
          <Button onPress={handleLogin} disabled={loading}>
            Entrar
          </Button>
          <Button variant="ghost" onPress={() => navigation.navigate('ForgotPassword')}>
            Esqueceu a senha?
          </Button>
          <Button variant="secondary" onPress={() => navigation.navigate('Register')}>
            Criar conta
          </Button>
        </View>
        <Snackbar
          visible={errorMessage !== null}
          onDismiss={() => setErrorMessage(null)}
          message={errorMessage ?? ''}
          position="top"
          variant="error"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing[6],
    gap: spacing[8],
    backgroundColor: `${colors.neutral[0]}`,
  },
  header: {
    alignItems: 'center',
    gap: spacing[2],
  },
  appTitle: {
    fontSize: fontSizes['3xl'],
    fontWeight: 'bold',
    color: `${colors.primary[600]}`,
  },
  appSubtitle: {
    fontSize: fontSizes.base,
    color: `${colors.neutral[500]}`,
  },
  form: {
    gap: spacing[3],
  },
});
