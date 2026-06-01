import { useEffect, useState } from 'react';
import { subscribeToUsers } from '../../services/authService';
import type { User } from '../../domain/user';

export function useUserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToUsers(
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
  }, []);

  return { users, loading, error, clearError: () => setError(null) };
}
