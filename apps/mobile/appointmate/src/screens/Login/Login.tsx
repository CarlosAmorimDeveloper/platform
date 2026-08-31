import { useState } from 'react';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { Button, Spinner, TextField, useTheme, useToast } from '@industry/mobile';
import { accentRamp, alpha } from '@industry/tokens';
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
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.header}>
          <Text style={[styles.kicker, { color: accentRamp['300'] }]}>
            Acompanhamento de consultas
          </Text>
          <Text style={[styles.appTitle, { color: colors.text }]}>AppointMate</Text>
        </View>
        <View style={styles.form}>
          <TextField
            label="E-mail"
            placeholder="email@exemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="login-email-input"
          />
          <TextField
            label="Senha"
            placeholder="Sua senha"
            secureTextEntry
            secureToggle
            value={password}
            onChangeText={setPassword}
            testID="login-password-input"
          />
          {loading ? <Spinner /> : null}
          <Button
            variant="primary"
            block
            framed
            onPress={handleLogin}
            disabled={loading}
            testID="login-submit-button"
          >
            Entrar
          </Button>
          <Button
            variant="ghost"
            onPress={() => navigation.navigate('ForgotPassword')}
            testID="login-forgot-password-button"
          >
            <Text style={[styles.forgotPasswordLabel, { color: accentRamp['300'] }]}>
              Esqueceu a senha?
            </Text>
          </Button>
        </View>
        <View style={styles.footer}>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <Text style={[styles.footerHint, { color: alpha(colors.text, 60) }]}>
            Primeira vez por aqui?
          </Text>
          <Button
            variant="secondary"
            block
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
