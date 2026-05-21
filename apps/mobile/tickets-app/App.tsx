import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './src/services/firebase';
import { useAuthStore, type UserRole } from './src/store/useAuthStore';
import { AuthStack } from './src/navigation/AuthStack';
import { AppStack } from './src/navigation/AppStack';

export default function App() {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        const data = snap.data();
        const role = (data?.role ?? 'standard') as UserRole;
        const name = (data?.name ?? firebaseUser.email ?? '') as string;
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email ?? '', name, role });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer>{isAuthenticated ? <AppStack /> : <AuthStack />}</NavigationContainer>
    </PaperProvider>
  );
}
