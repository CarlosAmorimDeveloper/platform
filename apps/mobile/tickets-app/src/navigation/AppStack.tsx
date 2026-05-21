import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dashboard } from '../screens/Dashboard';
import { NewTicket } from '../screens/NewTicket';
import { TicketDetails } from '../screens/TicketDetails';
import { useAuthStore } from '../store/useAuthStore';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);
  return (
    <TouchableOpacity onPress={logout} style={styles.button}>
      <Text style={styles.label}>Sair</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: 12, paddingVertical: 4 },
  label: { color: '#6366f1', fontSize: 15, fontWeight: '600' },
});

export function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerRight: () => <LogoutButton /> }}
      />
      <Stack.Screen name="NewTicket" component={NewTicket} options={{ title: 'New Ticket' }} />
      <Stack.Screen
        name="TicketDetails"
        component={TicketDetails}
        options={{ title: 'Ticket Details' }}
      />
    </Stack.Navigator>
  );
}
