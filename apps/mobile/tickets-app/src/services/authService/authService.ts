import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { initializeApp, deleteApp, FirebaseError } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { auth, db, firebaseConfig } from '../firebase';
import { mapFirebaseAuthError } from '../../utils/firebaseErrors';
import type { User, UserRole } from '../../domain/user';

export async function login(email: string, password: string): Promise<User> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, 'users', user.uid));
  const data = snap.data();
  return {
    uid: user.uid,
    email: user.email ?? email,
    name: (data?.name ?? user.email ?? email) as string,
    role: (data?.role ?? 'standard') as UserRole,
    workspaceId: (data?.workspace_id ?? '') as string,
  };
}

export async function register(name: string, email: string, password: string): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  const workspaceId = doc(collection(db, 'workspaces')).id;
  await setDoc(doc(db, 'workspaces', workspaceId), {
    createdAt: serverTimestamp(),
    owner_id: user.uid,
  });
  await setDoc(doc(db, 'users', user.uid), {
    email,
    role: 'admin',
    name: name.trim(),
    workspace_id: workspaceId,
  });

  return { uid: user.uid, email, name: name.trim(), role: 'admin', workspaceId };
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  role: UserRole,
  workspaceId: string,
): Promise<void> {
  const secondaryApp = initializeApp(firebaseConfig, `secondary-${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);
  try {
    const { user } = await createUserWithEmailAndPassword(secondaryAuth, email.trim(), password);
    await setDoc(doc(db, 'users', user.uid), {
      email: email.trim(),
      name: name.trim(),
      role,
      workspace_id: workspaceId,
    });
    await signOut(secondaryAuth);
  } catch (err: unknown) {
    const message =
      err instanceof FirebaseError
        ? 'Não foi possível criar o usuário.'
        : err instanceof Error
          ? err.message
          : 'Falha ao criar usuário';
    throw new Error(message);
  } finally {
    await deleteApp(secondaryApp).catch(() => undefined);
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export function subscribeToUsers(
  workspaceId: string,
  onData: (users: User[]) => void,
  onError: () => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'users'), where('workspace_id', '==', workspaceId)),
    (snap) => {
      const users: User[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          uid: d.id,
          email: (data.email ?? '') as string,
          name: (data.name ?? '') as string,
          role: (data.role ?? 'standard') as UserRole,
          workspaceId: (data.workspace_id ?? '') as string,
        };
      });
      onData(users);
    },
    onError,
  );
}

export { mapFirebaseAuthError };
