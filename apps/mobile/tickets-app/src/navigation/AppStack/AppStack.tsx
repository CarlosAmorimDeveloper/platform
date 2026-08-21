import { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Button, Dialog, IconButton, useTheme } from '@vuotto/mobile';
import { vtColors } from '@vuotto/tokens';
import { Dashboard } from '../../screens/Dashboard';
import { NewTicket } from '../../screens/NewTicket';
import { TicketDetails } from '../../screens/TicketDetails';
import { TicketList } from '../../screens/TicketList';
import { CreateUser } from '../../screens/CreateUser';
import { useAuthStore } from '../../store/useAuthStore';
import { STATUS_LABELS } from '../../constants/ticketStatus';
import type { AppStackParamList } from '../types';
import { View } from 'react-native';
import { styles } from './AppStack.styles';

const Stack = createNativeStackNavigator<AppStackParamList>();

function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" onPress={() => setOpen(true)}>
        Sair
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Sair da conta"
        description="Tem certeza que deseja sair?"
        footer={
          <>
            <Button key="cancel" variant="ghost" onPress={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button key="confirm" variant="danger" onPress={logout}>
              Sair
            </Button>
          </>
        }
      />
    </>
  );
}

function DashboardHeaderRight() {
  const user = useAuthStore((s) => s.user);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  return (
    <View style={styles.headerRight}>
      {user?.role === 'admin' && (
        <IconButton
          icon="UserPlus"
          label="Criar usuário"
          onPress={() => navigation.navigate('CreateUser')}
        />
      )}
      <LogoutButton />
    </View>
  );
}

export function AppStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surfaceSolid },
        headerTitleStyle: { color: colors.textHeading, fontWeight: '600' },
        headerTintColor: vtColors.cool,
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ title: 'Painel', headerRight: () => <DashboardHeaderRight /> }}
      />
      <Stack.Screen name="NewTicket" component={NewTicket} options={{ title: 'Novo Chamado' }} />
      <Stack.Screen
        name="TicketDetails"
        component={TicketDetails}
        options={{ title: 'Detalhes do Chamado' }}
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
