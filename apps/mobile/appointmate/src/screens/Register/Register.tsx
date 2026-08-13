import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Button, Input, LoadingIndicator, Snackbar } from '@ds/mobile';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { register } from '../../services/authService';
import { mapFirebaseAuthError } from '../../utils/firebaseErrors';
import { emailFormatError, passwordMinLengthError } from '../../utils/validation';
import { styles } from './Register.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function Register({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const emailError = emailFormatError(email);
  const passwordError = passwordMinLengthError(password);
  const canSubmit = Boolean(name.trim()) && Boolean(email) && !emailError && !passwordError;

  async function handleRegister() {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await register(name, email, password);
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
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Preencha os dados para começar</Text>
        </View>
        <View style={styles.form}>
          <Input
            label="Nome"
            placeholder="Seu nome completo"
            value={name}
            onChangeText={setName}
            testID="register-name-input"
          />
          <Input
            label="E-mail"
            placeholder="email@exemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            testID="register-email-input"
          />
          <Input
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            showPasswordToggle
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            testID="register-password-input"
          />
          <LoadingIndicator visible={loading} testID="register-loading-indicator" />
          <Button
            onPress={handleRegister}
            disabled={!canSubmit || loading}
            testID="register-submit-button"
          >
            Cadastrar
          </Button>
          <Button
            variant="secondary"
            onPress={() => navigation.navigate('Login')}
            testID="register-back-to-login-button"
          >
            Voltar para o login
          </Button>
        </View>
        <Snackbar
          visible={errorMessage !== null}
          onDismiss={() => setErrorMessage(null)}
          message={errorMessage ?? ''}
          position="top"
          variant="error"
          testID="register-error-snackbar"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
