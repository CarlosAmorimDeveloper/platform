import { useState } from 'react';
import { updateTicket } from '../../../../services/ticketService';
import type { Ticket } from '../../../../domain/ticket';
import type { User } from '../../../../domain/user';
import type { TicketStatus } from '../../../../constants/ticketStatus';
import type { TicketPriority } from '../../../../constants/ticketPriority';

interface UseTicketEditModeParams {
  ticketId: string;
  users: User[];
  ticket: Ticket | null;
}

interface UseTicketEditModeResult {
  editing: boolean;
  draftStatus: TicketStatus;
  draftPriority: TicketPriority;
  draftAssigneeId: string;
  setDraftStatus: (s: TicketStatus) => void;
  setDraftPriority: (p: TicketPriority) => void;
  setDraftAssigneeId: (id: string) => void;
  saveVisible: boolean;
  setSaveVisible: (v: boolean) => void;
  onEditPress: () => void;
  handleConfirmSave: () => Promise<void>;
  handleCancelSave: () => void;
  mutationError: string | null;
  clearMutationError: () => void;
}

export function useTicketEditMode({
  ticketId,
  users,
  ticket,
}: UseTicketEditModeParams): UseTicketEditModeResult {
  const [editing, setEditing] = useState(false);
  const [draftStatus, setDraftStatus] = useState<TicketStatus>('open');
  const [draftPriority, setDraftPriority] = useState<TicketPriority>('medium');
  const [draftAssigneeId, setDraftAssigneeId] = useState('');
  const [saveVisible, setSaveVisible] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  function onEditPress() {
    if (editing) {
      setSaveVisible(true);
    } else {
      setDraftStatus(ticket?.status ?? 'open');
      setDraftPriority(ticket?.priority ?? 'medium');
      setDraftAssigneeId(ticket?.assigneeId ?? '');
      setEditing(true);
    }
  }

  async function handleConfirmSave() {
    try {
      const selectedUser = users.find((u) => u.uid === draftAssigneeId);
      await updateTicket(ticketId, {
        status: draftStatus,
        priority: draftPriority,
        assigneeId: selectedUser?.uid ?? null,
        assigneeName: selectedUser?.name ?? null,
      });
      setSaveVisible(false);
      setEditing(false);
    } catch (err: unknown) {
      setSaveVisible(false);
      setMutationError(err instanceof Error ? err.message : 'Falha ao atualizar o chamado.');
    }
  }

  function handleCancelSave() {
    setSaveVisible(false);
    setEditing(false);
  }

  function clearMutationError() {
    setMutationError(null);
  }

  return {
    editing,
    draftStatus,
    draftPriority,
    draftAssigneeId,
    setDraftStatus,
    setDraftPriority,
    setDraftAssigneeId,
    saveVisible,
    setSaveVisible,
    onEditPress,
    handleConfirmSave,
    handleCancelSave,
    mutationError,
    clearMutationError,
  };
}
