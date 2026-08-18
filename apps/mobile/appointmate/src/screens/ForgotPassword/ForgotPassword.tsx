import { useState } from 'react';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { AppBar, Button, Input, LoadingIndicator, Snackbar } from '@ds/mobile';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { sendPasswordReset } from '../../services/authService';
import { mapFirebaseAuthError } from '../../utils/firebaseErrors';
import { emailFormatError } from '../../utils/validation';
import { styles } from './ForgotPassword.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPassword({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const emailError = emailFormatError(email);
  const canSubmit = Boolean(email) && !emailError;

  async function handleResetPassword() {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSuccessMessage('Se este e-mail estiver cadastrado, você receberá um link em instantes.');
    } catch (err: unknown) {
      setErrorMessage(mapFirebaseAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <AppBar
        title="Esqueci minha senha"
        onBackPress={() => navigation.goBack()}
        testID="forgot-password-app-bar"
      />
      <KeyboardAvoidingView style={styles.keyboardView} behavior="padding">
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
              error={emailError}
              testID="forgot-password-email-input"
            />
            <LoadingIndicator visible={loading} testID="forgot-password-loading-indicator" />
            <Button
              onPress={handleResetPassword}
              disabled={!canSubmit || loading}
              testID="forgot-password-submit-button"
            >
              Enviar link
            </Button>
            <Button
              variant="ghost"
              onPress={() => navigation.goBack()}
              testID="forgot-password-back-button"
            >
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
            testID="forgot-password-success-snackbar"
          />
          <Snackbar
            position="top"
            visible={errorMessage !== null}
            onDismiss={() => setErrorMessage(null)}
            message={errorMessage ?? ''}
            variant="error"
            testID="forgot-password-error-snackbar"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
