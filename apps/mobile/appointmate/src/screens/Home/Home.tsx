import { Text, View } from 'react-native';
import { Button } from '@ds/mobile';
import { useAuth } from '../../context/AuthContext';

export function Home() {
  const { logout } = useAuth();

  return (
    <View>
      <Text>Home</Text>
      <Button variant="secondary" onPress={logout} testID="home-logout-button">
        Sair
      </Button>
    </View>
  );
}
