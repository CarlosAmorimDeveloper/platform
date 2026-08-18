import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '../../screens/Login';
import { Register } from '../../screens/Register';
import { ForgotPassword } from '../../screens/ForgotPassword';
import type { AuthStackParamList } from '../types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
}
