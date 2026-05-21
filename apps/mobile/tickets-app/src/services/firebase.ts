import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from '@firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAKfnmjA2fD0trHsy0j7DLp_rwu4AEINtc',
  authDomain: 'tickets-app-e3c8f.firebaseapp.com',
  projectId: 'tickets-app-e3c8f',
  storageBucket: 'tickets-app-e3c8f.firebasestorage.app',
  messagingSenderId: '75894349909',
  appId: '1:75894349909:web:06e7a67a7cc8cf9cbb74dc',
  measurementId: 'G-F6S4SC3L5T',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
