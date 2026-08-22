import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dashboard } from '../../screens/Dashboard';
import { NewTicket } from '../../screens/NewTicket';
import { TicketDetails } from '../../screens/TicketDetails';
import { TicketList } from '../../screens/TicketList';
import { CreateUser } from '../../screens/CreateUser';
import type { AppStackParamList } from '../types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="NewTicket" component={NewTicket} />
      <Stack.Screen name="TicketDetails" component={TicketDetails} />
      <Stack.Screen name="TicketList" component={TicketList} />
      <Stack.Screen name="CreateUser" component={CreateUser} />
    </Stack.Navigator>
  );
}
