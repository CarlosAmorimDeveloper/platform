import { useState } from 'react';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, Button, Field, Input, LoadingIndicator, useTheme, useToast } from '@vuotto/mobile';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { sendPasswordReset } from '../../services/authService';
import { mapFirebaseAuthError } from '../../utils/firebaseErrors';
import { emailFormatError } from '../../utils/validation';
import { styles } from './ForgotPassword.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPassword({ navigation }: Props) {
  const { colors } = useTheme();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const emailError = emailFormatError(email);
  const canSubmit = Boolean(email) && !emailError;

  async function handleResetPassword() {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await sendPasswordReset(email);
      toast.show({
        tone: 'success',
        title: 'Se este e-mail estiver cadastrado, você receberá um link em instantes.',
      });
      navigation.goBack();
    } catch (err: unknown) {
      toast.show({ tone: 'danger', title: mapFirebaseAuthError(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <AppBar
        title="Esqueci minha senha"
        onBackPress={() => navigation.goBack()}
        testID="forgot-password-app-bar"
      />
      <KeyboardAvoidingView style={styles.keyboardView} behavior="padding">
        <View style={[styles.container, { backgroundColor: colors.bgCanvas }]}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Informe seu e-mail e enviaremos um link para redefinir sua senha.
          </Text>
          <View style={styles.form}>
            <Field label="E-mail" error={emailError}>
              <Input
                placeholder="email@exemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                testID="forgot-password-email-input"
              />
            </Field>
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
