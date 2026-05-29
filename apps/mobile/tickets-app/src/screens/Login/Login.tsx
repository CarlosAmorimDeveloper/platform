import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Input, Button, LoadingIndicator, Snackbar } from '@ds/mobile';
import { login, mapFirebaseAuthError } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { styles } from './Login.styles';

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
      const user = await login(email, password);
      setUser(user);
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
            keyboardType="email-address"
            autoCapitalize="none"
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
