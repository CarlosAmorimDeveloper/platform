import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import type { AppStackParamList } from '../types';

const Stack = createNativeStackNavigator<AppStackParamList>();

// Placeholder screen only — real dashboard UI belongs to a future epic.
function Home() {
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
}

export function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
