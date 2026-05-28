import { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, Button, LoadingIndicator, Snackbar } from '@ds/mobile';
import { register, mapFirebaseAuthError } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { styles } from './Register.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function Register({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFirstUser, setIsFirstUser] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    AsyncStorage.getItem('first_user_registered').then((val) => {
      setIsFirstUser(val === null);
    });
  }, []);

  const passwordError =
    password.length > 0 && password.length < 6 ? 'Mínimo de 6 caracteres' : undefined;

  async function handleRegister() {
    if (!name.trim() || !email || !password || password.length < 6) return;
    setLoading(true);
    try {
      const user = await register(name, email, password);
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
        <Text style={styles.subtitle}>Preencha os dados para criar sua conta</Text>
        <View style={styles.form}>
          <Input label="Nome" placeholder="Seu nome completo" value={name} onChangeText={setName} />
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
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            showPasswordToggle
            value={password}
            onChangeText={setPassword}
            error={passwordError}
          />
          {isFirstUser && (
            <View style={styles.adminNotice}>
              <Text style={styles.adminNoticeText}>
                Esta será a primeira conta criada e terá perfil de Administrador.
              </Text>
            </View>
          )}
          <LoadingIndicator visible={loading} />
          <Button
            onPress={handleRegister}
            disabled={!name.trim() || !email.trim() || password.length < 6 || loading}
          >
            Cadastrar
          </Button>
          <Button variant="secondary" onPress={() => navigation.navigate('Login')}>
            Voltar para o login
          </Button>
        </View>
        <Snackbar
          visible={errorMessage !== null}
          onDismiss={() => setErrorMessage(null)}
          message={errorMessage ?? ''}
          variant="error"
          position="top"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
