import { Text, View } from 'react-native';
import { Button } from '@ds/mobile';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

export function Home({ navigation }: Props) {
  const { logout } = useAuth();

  return (
    <View>
      <Text>Home</Text>
      <Button
        onPress={() => navigation.navigate('FormEntry', undefined)}
        testID="home-new-form-button"
      >
        Novo formulário
      </Button>
      <Button variant="secondary" onPress={logout} testID="home-logout-button">
        Sair
      </Button>
    </View>
  );
}
