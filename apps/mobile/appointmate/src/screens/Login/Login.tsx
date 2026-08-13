import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Button, Input, LoadingIndicator } from '@ds/mobile';
import { login } from '../../services/authService';
import { styles } from './Login.styles';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // TODO(APP-53): tratar loading e mensagem de erro amigável (mapFirebaseAuthError + Snackbar).
  // Por ora, um erro de autenticação só é registrado no console, sem feedback visual.
  async function handleLogin() {
    if (!email || !password) return;
    try {
      await login(email, password);
      // Sucesso: o onAuthStateChanged global (App.tsx) detecta a sessão e troca de stack sozinho.
    } catch (err) {
      console.error(err);
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
          <LoadingIndicator visible={false} testID="login-loading-indicator" />
          <Button onPress={handleLogin} disabled={false} testID="login-submit-button">
            Entrar
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
