import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Input, Button, LoadingIndicator, Snackbar } from '@ds/mobile';
import { colors, fontSizes, spacing } from '@ds/tokens';
import { auth } from '../services/firebase';
import { mapFirebaseAuthError } from '../utils/firebaseErrors';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPassword({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleResetPassword() {
    if (!email) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Se este e-mail estiver cadastrado, você receberá um link em instantes.');
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
        <Text style={styles.description}>
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </Text>
        <View style={styles.form}>
          <Input
            label="E-mail"
            placeholder="email@exemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <LoadingIndicator visible={loading} />
          <Button onPress={handleResetPassword} disabled={!email || loading}>
            Enviar link
          </Button>
          <Button variant="ghost" onPress={() => navigation.goBack()}>
            Voltar ao login
          </Button>
        </View>
        <Snackbar
          position="top"
          visible={successMessage !== null}
          onDismiss={() => {
            setSuccessMessage(null);
            navigation.goBack();
          }}
          message={successMessage ?? ''}
          variant="success"
        />
        <Snackbar
          position="top"
          visible={errorMessage !== null}
          onDismiss={() => setErrorMessage(null)}
          message={errorMessage ?? ''}
          variant="error"
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
  description: {
    fontSize: fontSizes.base,
    color: `${colors.neutral[500]}`,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    gap: spacing[3],
  },
});
