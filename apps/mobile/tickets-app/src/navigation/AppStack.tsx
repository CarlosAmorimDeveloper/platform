import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dashboard } from '../screens/Dashboard';
import { NewTicket } from '../screens/NewTicket';
import { TicketDetails } from '../screens/TicketDetails';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="NewTicket" component={NewTicket} options={{ title: 'New Ticket' }} />
      <Stack.Screen
        name="TicketDetails"
        component={TicketDetails}
        options={{ title: 'Ticket Details' }}
      />
    </Stack.Navigator>
  );
}
