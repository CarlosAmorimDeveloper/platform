import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthenticatedUser {
  uid: string;
  email: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
}

export async function login(email: string, password: string): Promise<AuthenticatedUser> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return { uid: user.uid, email: user.email ?? email };
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthenticatedUser> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name.trim() });
  return { uid: user.uid, email: user.email ?? email };
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export function subscribeToAuthChanges(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(firebaseUser ? { uid: firebaseUser.uid, email: firebaseUser.email } : null);
  });
}

export async function logout(): Promise<void> {
  await signOut(auth);
}
