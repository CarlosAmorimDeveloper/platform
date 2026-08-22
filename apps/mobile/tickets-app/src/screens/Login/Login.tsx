import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, Button, Field, Input, LoadingIndicator, useTheme, useToast } from '@vuotto/mobile';
import { vtColors } from '@vuotto/tokens';
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
      <AppBar title="Login" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { backgroundColor: colors.bgCanvas }]}>
          <View style={styles.header}>
            <Text style={[styles.appTitle, { color: vtColors.cool }]}>Tickets App</Text>
            <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>
              Gerencie seus chamados
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
              />
            </Field>
            <Field label="Senha">
              <Input
                placeholder="Sua senha"
                secureTextEntry
                secureToggle
                value={password}
                onChangeText={setPassword}
              />
            </Field>
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
