import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, Button, Field, Input, LoadingIndicator, Select, useToast } from '@vuotto/mobile';
import { createUser } from '../../services/authService';
import { passwordMinLengthError } from '../../domain/validation';
import { useAuthStore } from '../../store/useAuthStore';
import type { UserRole } from '../../domain/user';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { styles } from './CreateUser.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'CreateUser'>;

const ROLE_OPTIONS = [
  { label: 'Padrão', value: 'standard' },
  { label: 'Administrador', value: 'admin' },
];

export function CreateUser({ navigation }: Props) {
  const currentUser = useAuthStore((s) => s.user);
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('standard');
  const [loading, setLoading] = useState(false);

  if (currentUser?.role !== 'admin') {
    navigation.goBack();
    return null;
  }

  const passwordError = passwordMinLengthError(password);

  const isValid = name.trim() !== '' && email.trim() !== '' && password.length >= 6;

  async function handleCreate() {
    if (!isValid) return;
    setLoading(true);
    try {
      await createUser(name, email, password, role, currentUser!);
      toast.show({ tone: 'success', title: 'Usuário criado com sucesso!' });
      setTimeout(() => navigation.goBack(), 1500);
    } catch (err: unknown) {
      toast.show({
        tone: 'danger',
        title: err instanceof Error ? err.message : 'Falha ao criar usuário',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.flex}>
      <AppBar title="Criar Usuário" onBackPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <Field label="Nome">
          <Input placeholder="Nome completo" value={name} onChangeText={setName} />
        </Field>
        <Field label="Email">
          <Input placeholder="email@exemplo.com" value={email} onChangeText={setEmail} />
        </Field>
        <Field label="Senha" error={passwordError}>
          <Input
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            secureToggle
            value={password}
            onChangeText={setPassword}
            invalid={Boolean(passwordError)}
          />
        </Field>
        <Field label="Perfil">
          <Select value={role} onChange={(v) => setRole(v as UserRole)} options={ROLE_OPTIONS} />
        </Field>
        <LoadingIndicator visible={loading} />
        <Button onPress={handleCreate} disabled={!isValid || loading}>
          Criar Usuário
        </Button>
        <Button variant="secondary" onPress={() => navigation.goBack()}>
          Cancelar
        </Button>
      </View>
    </SafeAreaView>
  );
}
