import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Spinner, TextField, useTheme, useToast } from '@industry/mobile';
import { accentRamp, alpha } from '@industry/tokens';
import { login, mapFirebaseAuthError } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { styles } from './Login.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function Login({ navigation }: Props) {
  const { colors } = useTheme();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  async function handleLogin() {
    if (!email || !password) return;
    setLoading(true);
    try {
      const user = await login(email, password);
      setUser(user);
    } catch (err: unknown) {
      toast.show({ tone: 'danger', title: mapFirebaseAuthError(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.keyboardView}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
          <View style={styles.header}>
            <Text style={[styles.kicker, { color: accentRamp['300'] }]}>Gestão de chamados</Text>
            <Text style={[styles.appTitle, { color: colors.text }]}>tickets</Text>
          </View>
          <View style={styles.form}>
            <TextField
              label="E-mail"
              placeholder="email@exemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextField
              label="Senha"
              placeholder="Sua senha"
              secureTextEntry
              secureToggle
              value={password}
              onChangeText={setPassword}
            />
            {loading ? <Spinner /> : null}
            <Button variant="primary" block framed onPress={handleLogin} disabled={loading}>
              Entrar
            </Button>
            <Button variant="ghost" block onPress={() => navigation.navigate('ForgotPassword')}>
              Esqueceu a senha?
            </Button>
          </View>
          <View style={styles.footer}>
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />
            <Text style={[styles.footerHint, { color: alpha(colors.text, 60) }]}>
              Criar conta abre um workspace novo
            </Text>
            <Button variant="secondary" block onPress={() => navigation.navigate('Register')}>
              Criar conta
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
