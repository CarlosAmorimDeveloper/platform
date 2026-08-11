import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { LoadingView, theme } from '@ds/mobile';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/services/firebase';
import { AuthStack } from './src/navigation/AuthStack';
import { AppStack } from './src/navigation/AppStack';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <PaperProvider theme={theme}>
      {loading ? (
        <LoadingView testID="app-loading" />
      ) : (
        <NavigationContainer>{isAuthenticated ? <AppStack /> : <AuthStack />}</NavigationContainer>
      )}
    </PaperProvider>
  );
}
