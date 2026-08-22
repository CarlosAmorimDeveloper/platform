import { useState } from 'react';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { AppBar, Button, Field, Input, LoadingIndicator, useTheme, useToast } from '@vuotto/mobile';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { register } from '../../services/authService';
import { mapFirebaseAuthError } from '../../utils/firebaseErrors';
import { emailFormatError, passwordMinLengthError } from '../../utils/validation';
import { styles } from './Register.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function Register({ navigation }: Props) {
  const { colors } = useTheme();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      toast.show({ tone: 'danger', title: mapFirebaseAuthError(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <AppBar
        title="Criar conta"
        onBackPress={() => navigation.goBack()}
        testID="register-app-bar"
      />
      <KeyboardAvoidingView style={styles.keyboardView} behavior="padding">
        <View style={[styles.container, { backgroundColor: colors.bgCanvas }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textHeading }]}>Criar conta</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Preencha os dados para começar
            </Text>
          </View>
          <View style={styles.form}>
            <Field label="Nome">
              <Input
                placeholder="Seu nome completo"
                value={name}
                onChangeText={setName}
                testID="register-name-input"
              />
            </Field>
            <Field label="E-mail" error={emailError}>
              <Input
                placeholder="email@exemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                testID="register-email-input"
              />
            </Field>
            <Field label="Senha" error={passwordError}>
              <Input
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                secureToggle
                value={password}
                onChangeText={setPassword}
                testID="register-password-input"
              />
            </Field>
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
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
