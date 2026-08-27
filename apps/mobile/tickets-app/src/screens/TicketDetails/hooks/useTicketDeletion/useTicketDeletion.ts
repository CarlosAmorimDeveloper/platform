import { useState } from 'react';
import { deleteTicket } from '../../../../services/ticketService';
import { useAuthStore } from '../../../../store/useAuthStore';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../../../navigation/types';

interface UseTicketDeletionParams {
  ticketId: string;
  navigation: NativeStackNavigationProp<AppStackParamList, 'TicketDetails'>;
}

interface UseTicketDeletionResult {
  deleteVisible: boolean;
  setDeleteVisible: (v: boolean) => void;
  handleDelete: () => Promise<void>;
  mutationError: string | null;
  clearMutationError: () => void;
}

export function useTicketDeletion({
  ticketId,
  navigation,
}: UseTicketDeletionParams): UseTicketDeletionResult {
  const workspaceId = useAuthStore((s) => s.user?.workspaceId ?? '');
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  async function handleDelete() {
    try {
      await deleteTicket(ticketId, workspaceId);
      navigation.goBack();
    } catch (err: unknown) {
      setDeleteVisible(false);
      setMutationError(err instanceof Error ? err.message : 'Falha ao apagar o chamado.');
    }
  }

  function clearMutationError() {
    setMutationError(null);
  }

  return {
    deleteVisible,
    setDeleteVisible,
    handleDelete,
    mutationError,
    clearMutationError,
  };
}
