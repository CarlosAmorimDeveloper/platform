import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, Button, LoadingIndicator, Snackbar } from '@ds/mobile';
import { colors, fontSizes, radii, spacing } from '@ds/tokens';
import { auth, db } from '../services/firebase';
import { useAuthStore, type UserRole } from '../store/useAuthStore';
import { mapFirebaseAuthError } from '../utils/firebaseErrors';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';

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
      const isFirst = await AsyncStorage.getItem('first_user_registered').catch(() => 'error');
      const role: UserRole = isFirst === null ? 'admin' : 'standard';

      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', user.uid), { email, role, name: name.trim() });
      setUser({ uid: user.uid, email, name: name.trim(), role });

      await AsyncStorage.setItem('first_user_registered', 'true');
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

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing[6],
    gap: spacing[6],
    backgroundColor: `${colors.neutral[0]}`,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: `${colors.neutral[500]}`,
    textAlign: 'center',
  },
  form: {
    gap: spacing[3],
  },
  adminNotice: {
    backgroundColor: `${colors.primary[50]}`,
    borderRadius: radii.md,
    padding: spacing[3],
  },
  adminNoticeText: {
    fontSize: fontSizes.sm,
    color: `${colors.primary[700]}`,
    textAlign: 'center',
  },
});
