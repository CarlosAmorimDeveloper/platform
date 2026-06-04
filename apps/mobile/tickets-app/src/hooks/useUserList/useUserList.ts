import { useEffect, useState } from 'react';
import { subscribeToUsers } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import type { User } from '../../domain/user';

export function useUserList() {
  const workspaceId = useAuthStore((s) => s.user?.workspaceId ?? '');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToUsers(
      workspaceId,
      (data) => {
        setUsers(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
        setError('Erro ao carregar os usuários.');
      },
    );

    return unsubscribe;
  }, [workspaceId]);

  return { users, loading, error, clearError: () => setError(null) };
}
