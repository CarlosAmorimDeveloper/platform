import { useState } from 'react';
import { View } from 'react-native';
import { Input, Button, LoadingIndicator, Snackbar, Select } from '@ds/mobile';
import { createUser } from '../../services/authService';
import { passwordMinLengthError } from '../../utils/validation';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('standard');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successVisible, setSuccessVisible] = useState(false);

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
      await createUser(name, email, password, role, currentUser!.workspaceId);
      setSuccessVisible(true);
      setTimeout(() => navigation.goBack(), 1500);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Falha ao criar usuário');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Input label="Nome" placeholder="Nome completo" value={name} onChangeText={setName} />
      <Input label="Email" placeholder="email@exemplo.com" value={email} onChangeText={setEmail} />
      <Input
        label="Senha"
        placeholder="Mínimo 6 caracteres"
        secureTextEntry
        showPasswordToggle
        value={password}
        onChangeText={setPassword}
        error={passwordError}
      />
      <Select
        label="Perfil"
        value={role}
        onChange={(v) => setRole(v as UserRole)}
        options={ROLE_OPTIONS}
      />
      <LoadingIndicator visible={loading} />
      <Button onPress={handleCreate} disabled={!isValid || loading}>
        Criar Usuário
      </Button>
      <Button variant="secondary" onPress={() => navigation.goBack()}>
        Cancelar
      </Button>
      <Snackbar
        visible={successVisible}
        onDismiss={() => setSuccessVisible(false)}
        message="Usuário criado com sucesso!"
        variant="success"
        position="top"
      />
      <Snackbar
        visible={errorMessage !== null}
        onDismiss={() => setErrorMessage(null)}
        message={errorMessage ?? ''}
        variant="error"
        position="top"
      />
    </View>
  );
}
