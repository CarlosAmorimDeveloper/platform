import { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dialog, Button } from '@ds/mobile';
import { Dashboard } from '../screens/Dashboard';
import { NewTicket } from '../screens/NewTicket';
import { TicketDetails } from '../screens/TicketDetails';
import { useAuthStore } from '../store/useAuthStore';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.button}>
        <Text style={styles.label}>Sair</Text>
      </TouchableOpacity>

      <Dialog
        visible={visible}
        onDismiss={() => setVisible(false)}
        title="Sair da conta"
        actions={
          <>
            <Button variant="ghost" onPress={() => setVisible(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onPress={logout}>
              Sair
            </Button>
          </>
        }
      >
        <Text>Tem certeza que deseja sair?</Text>
      </Dialog>
    </>
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
