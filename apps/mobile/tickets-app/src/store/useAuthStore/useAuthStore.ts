import { create } from 'zustand';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import type { User } from '../../domain/user';

export type { UserRole } from '../../domain/user';
export type { User as AuthUser } from '../../domain/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: user !== null }),
  logout: () => signOut(auth),
}));
