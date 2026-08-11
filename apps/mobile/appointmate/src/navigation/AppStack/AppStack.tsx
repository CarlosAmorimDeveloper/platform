import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../../screens/Home';
import type { AppStackParamList } from '../types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
