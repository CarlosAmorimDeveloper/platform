import { NavigationContainer } from '@react-navigation/native';
import { LoadingView, ToastProvider } from '@vuotto/mobile';
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
    <ToastProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ToastProvider>
  );
}
