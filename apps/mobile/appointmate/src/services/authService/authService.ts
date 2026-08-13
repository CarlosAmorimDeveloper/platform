import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export interface AuthenticatedUser {
  uid: string;
  email: string;
}

export async function login(email: string, password: string): Promise<AuthenticatedUser> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return { uid: user.uid, email: user.email ?? email };
}
