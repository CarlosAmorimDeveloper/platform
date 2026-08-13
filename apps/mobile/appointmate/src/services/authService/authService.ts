import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';

export interface AuthenticatedUser {
  uid: string;
  email: string;
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
