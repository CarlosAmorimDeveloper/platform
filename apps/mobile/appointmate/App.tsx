import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { LoadingView, theme } from '@ds/mobile';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AuthStack } from './src/navigation/AuthStack';
import { AppStack } from './src/navigation/AppStack';

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingView testID="app-loading" />;
  }

  return <NavigationContainer>{user ? <AppStack /> : <AuthStack />}</NavigationContainer>;
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
