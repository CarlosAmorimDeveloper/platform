import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@industry/mobile';
import { Home } from '../../screens/Home';
import { FormEntry } from '../../screens/FormEntry';
import { FormDetail } from '../../screens/FormDetail';
import type { AppStackParamList } from '../types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="FormEntry" component={FormEntry} />
      <Stack.Screen name="FormDetail" component={FormDetail} />
    </Stack.Navigator>
  );
}
