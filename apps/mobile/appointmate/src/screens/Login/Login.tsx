import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Button, Input, LoadingIndicator, Snackbar } from '@ds/mobile';
import { login } from '../../services/authService';
import { mapFirebaseAuthError } from '../../utils/firebaseErrors';
import { styles } from './Login.styles';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogin() {
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      // Sucesso: o onAuthStateChanged global (App.tsx) detecta a sessão e troca de stack sozinho.
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
          <Text style={styles.appTitle}>AppointMate</Text>
          <Text style={styles.appSubtitle}>Acompanhe seu bem-estar</Text>
        </View>
        <View style={styles.form}>
          <Input
            label="E-mail"
            placeholder="email@exemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="login-email-input"
          />
          <Input
            label="Senha"
            placeholder="Sua senha"
            secureTextEntry
            showPasswordToggle
            value={password}
            onChangeText={setPassword}
            testID="login-password-input"
          />
          <LoadingIndicator visible={loading} testID="login-loading-indicator" />
          <Button onPress={handleLogin} disabled={loading} testID="login-submit-button">
            Entrar
          </Button>
        </View>
        <Snackbar
          visible={errorMessage !== null}
          onDismiss={() => setErrorMessage(null)}
          message={errorMessage ?? ''}
          position="top"
          variant="error"
          testID="login-error-snackbar"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
