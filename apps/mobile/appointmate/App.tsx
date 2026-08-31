import { useEffect } from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import { ToastProvider, useTheme } from '@industry/mobile';
import { LoadingView } from './src/components/LoadingView';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AuthStack } from './src/navigation/AuthStack';
import { AppStack } from './src/navigation/AppStack';

function RootNavigator() {
  const { user, loading } = useAuth();
  const { colors, preference, setTheme } = useTheme();

  // AppointMate has no light theme of its own — useTheme() defaults to
  // following the OS appearance, which falls back to @industry/tokens'
  // lightColor palette on a device/simulator set to light mode. Pin the
  // preference to dark so the app doesn't inherit a color scheme it was
  // never designed for.
  useEffect(() => {
    if (preference === 'system') setTheme('dark');
  }, [preference, setTheme]);

  if (loading) {
    return <LoadingView testID="app-loading" />;
  }

  const navigationTheme: Theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: colors.accent,
      background: colors.bg,
      card: colors.surface,
      text: colors.text,
      border: colors.divider,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
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
