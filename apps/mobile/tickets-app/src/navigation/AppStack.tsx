import { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Dialog, Button } from '@ds/mobile';
import { Dashboard } from '../screens/Dashboard';
import { NewTicket } from '../screens/NewTicket';
import { TicketDetails } from '../screens/TicketDetails';
import { TicketList } from '../screens/TicketList';
import { CreateUser } from '../screens/CreateUser';
import { useAuthStore } from '../store/useAuthStore';
import { STATUS_LABELS } from '../constants/ticketStatus';
import type { AppStackParamList } from './types';
import { Text, Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing } from '@ds/tokens';

const Stack = createNativeStackNavigator<AppStackParamList>();

function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" onPress={() => setVisible(true)}>
        Sair
      </Button>

      <Dialog
        visible={visible}
        onDismiss={() => setVisible(false)}
        title="Sair da conta"
        actions={[
          <Button key="cancel" variant="ghost" onPress={() => setVisible(false)}>
            Cancelar
          </Button>,
          <Button key="confirm" variant="danger" onPress={logout}>
            Sair
          </Button>,
        ]}
      >
        <Text>Tem certeza que deseja sair?</Text>
      </Dialog>
    </>
  );
}

function DashboardHeaderRight() {
  const user = useAuthStore((s) => s.user);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {user?.role === 'admin' && (
        <Pressable
          style={{ paddingHorizontal: spacing[2] }}
          onPress={() => navigation.navigate('CreateUser')}
        >
          <MaterialIcons name="person-add" size={24} color={`${colors.neutral[600]}`} />
        </Pressable>
      )}
      <LogoutButton />
    </View>
  );
}

export function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerRight: () => <DashboardHeaderRight /> }}
      />
      <Stack.Screen name="NewTicket" component={NewTicket} options={{ title: 'New Ticket' }} />
      <Stack.Screen
        name="TicketDetails"
        component={TicketDetails}
        options={{ title: 'Ticket Details' }}
      />
      <Stack.Screen
        name="TicketList"
        component={TicketList}
        options={({ route }) => ({
          title: route.params.status ? STATUS_LABELS[route.params.status] : 'Todos os chamados',
        })}
      />
      <Stack.Screen name="CreateUser" component={CreateUser} options={{ title: 'Criar Usuário' }} />
    </Stack.Navigator>
  );
}
