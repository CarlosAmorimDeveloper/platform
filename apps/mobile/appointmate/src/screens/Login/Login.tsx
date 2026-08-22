import { useState } from 'react';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { Button, Field, Input, LoadingIndicator, useTheme, useToast } from '@vuotto/mobile';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { login } from '../../services/authService';
import { mapFirebaseAuthError } from '../../utils/firebaseErrors';
import { styles } from './Login.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function Login({ navigation }: Props) {
  const { colors } = useTheme();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      // Sucesso: o onAuthStateChanged global (App.tsx) detecta a sessão e troca de stack sozinho.
    } catch (err: unknown) {
      toast.show({ tone: 'danger', title: mapFirebaseAuthError(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.keyboardView} behavior="padding">
      <View style={[styles.container, { backgroundColor: colors.bgCanvas }]}>
        <View style={styles.header}>
          <Text style={[styles.appTitle, { color: colors.textHeading }]}>AppointMate</Text>
          <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>
            Acompanhe seu bem-estar
          </Text>
        </View>
        <View style={styles.form}>
          <Field label="E-mail">
            <Input
              placeholder="email@exemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              testID="login-email-input"
            />
          </Field>
          <Field label="Senha">
            <Input
              placeholder="Sua senha"
              secureTextEntry
              secureToggle
              value={password}
              onChangeText={setPassword}
              testID="login-password-input"
            />
          </Field>
          <LoadingIndicator visible={loading} testID="login-loading-indicator" />
          <Button onPress={handleLogin} disabled={loading} testID="login-submit-button">
            Entrar
          </Button>
          <Button
            variant="ghost"
            onPress={() => navigation.navigate('ForgotPassword')}
            testID="login-forgot-password-button"
          >
            Esqueceu a senha?
          </Button>
          <Button
            variant="secondary"
            onPress={() => navigation.navigate('Register')}
            testID="login-create-account-button"
          >
            Criar conta
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
