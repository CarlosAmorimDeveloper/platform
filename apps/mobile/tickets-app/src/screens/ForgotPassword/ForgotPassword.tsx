import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, Button, Field, Input, LoadingIndicator, useTheme, useToast } from '@vuotto/mobile';
import { sendPasswordReset, mapFirebaseAuthError } from '../../services/authService';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { styles } from './ForgotPassword.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

function backToLogin(navigation: Props['navigation']) {
  navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
}

export function ForgotPassword({ navigation }: Props) {
  const { colors } = useTheme();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    if (!email) return;
    setLoading(true);
    try {
      await sendPasswordReset(email);
      toast.show({
        tone: 'success',
        title: 'Se este e-mail estiver cadastrado, você receberá um link em instantes.',
      });
      setTimeout(() => backToLogin(navigation), 2000);
    } catch (err: unknown) {
      toast.show({ tone: 'danger', title: mapFirebaseAuthError(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.keyboardView}>
      <AppBar title="Recuperar Senha" onBackPress={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { backgroundColor: colors.bgCanvas }]}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Informe seu e-mail e enviaremos um link para redefinir sua senha.
          </Text>
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
            <LoadingIndicator visible={loading} />
            <Button onPress={handleResetPassword} disabled={!email || loading}>
              Enviar link
            </Button>
            <Button variant="ghost" onPress={() => backToLogin(navigation)}>
              Voltar ao login
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
