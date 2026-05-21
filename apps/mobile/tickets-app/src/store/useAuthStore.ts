import { create } from 'zustand';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

export type UserRole = 'admin' | 'standard';

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: user !== null }),
  logout: () => signOut(auth),
}));
