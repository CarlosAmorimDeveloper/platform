import { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, Button, Spinner, TextField, useTheme, useToast } from '@industry/mobile';
import { alpha } from '@industry/tokens';
import { register, mapFirebaseAuthError } from '../../services/authService';
import { passwordMinLengthError } from '../../domain/validation';
import { useAuthStore } from '../../store/useAuthStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { styles } from './Register.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function Register({ navigation }: Props) {
  const { colors } = useTheme();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFirstUser, setIsFirstUser] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    AsyncStorage.getItem('first_user_registered').then((val) => {
      setIsFirstUser(val === null);
    });
  }, []);

  const passwordError = passwordMinLengthError(password);

  async function handleRegister() {
    if (!name.trim() || !email || !password || password.length < 6) return;
    setLoading(true);
    try {
      const user = await register(name, email, password);
      setUser(user);
    } catch (err: unknown) {
      toast.show({ tone: 'danger', title: mapFirebaseAuthError(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.keyboardView}>
      <AppBar title="Cadastro" onBackPress={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
          <Text style={[styles.subtitle, { color: alpha(colors.text, 70) }]}>
            Preencha os dados para criar sua conta
          </Text>
          <View style={styles.form}>
            <TextField
              label="Nome"
              placeholder="Seu nome completo"
              value={name}
              onChangeText={setName}
            />
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
              error={passwordError}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              secureToggle
              value={password}
              onChangeText={setPassword}
            />
            {isFirstUser && (
              <View style={[styles.adminNotice, { backgroundColor: colors.surface2 }]}>
                <Text style={[styles.adminNoticeText, { color: colors.text }]}>
                  Esta será a primeira conta criada e terá perfil de Administrador.
                </Text>
              </View>
            )}
            {loading ? <Spinner /> : null}
            <Button
              onPress={handleRegister}
              disabled={!name.trim() || !email.trim() || password.length < 6 || loading}
            >
              Cadastrar
            </Button>
            <Button
              variant="secondary"
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
            >
              Voltar para o login
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
