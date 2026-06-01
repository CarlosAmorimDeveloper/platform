import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LoadingIndicator, Button, Snackbar, Dialog, Input, Select } from '@ds/mobile';
import { colors } from '@ds/tokens';
import { useTicketDetails } from '../../hooks/useTicketDetails';
import { useUserList } from '../../hooks/useUserList';
import { formatDate } from '../../domain/ticket';
import { updateTicket, deleteTicket } from '../../services/ticketService';
import { useAuthStore } from '../../store/useAuthStore';
import {
  ALL_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  type TicketStatus,
} from '../../constants/ticketStatus';
import {
  ALL_PRIORITIES,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  type TicketPriority,
} from '../../constants/ticketPriority';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { styles } from './TicketDetails.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'TicketDetails'>;

export function TicketDetails({ route, navigation }: Props) {
  const { ticketId } = route.params;
  const user = useAuthStore((s) => s.user);
  const { ticket, comments, loading, error, clearError, addComment, deleteComment } =
    useTicketDetails(ticketId);
  const { users } = useUserList();
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteCommentVisible, setDeleteCommentVisible] = useState(false);
  const [pendingCommentId, setPendingCommentId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draftStatus, setDraftStatus] = useState<TicketStatus>('open');
  const [draftPriority, setDraftPriority] = useState<TicketPriority>('medium');
  const [draftAssigneeId, setDraftAssigneeId] = useState('');
  const [saveVisible, setSaveVisible] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerIcons}>
          <Pressable
            onPress={() => {
              if (editing) {
                setSaveVisible(true);
              } else {
                setDraftStatus(ticket?.status ?? 'open');
                setDraftPriority(ticket?.priority ?? 'medium');
                setDraftAssigneeId(ticket?.assigneeId ?? '');
                setEditing(true);
              }
            }}
            style={styles.headerIcon}
          >
            <MaterialIcons
              name={editing ? 'check' : 'edit'}
              size={24}
              color={editing ? `${colors.success[500]}` : `${colors.neutral[600]}`}
            />
          </Pressable>
          <Pressable onPress={() => setDeleteVisible(true)} style={styles.headerIcon}>
            <MaterialIcons name="delete-outline" size={24} color={`${colors.error[500]}`} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, user?.role, editing, ticket?.status, ticket?.priority]);

  async function handleDelete() {
    try {
      await deleteTicket(ticketId);
      navigation.goBack();
    } catch (err: unknown) {
      setDeleteVisible(false);
      setMutationError(err instanceof Error ? err.message : 'Falha ao apagar o chamado.');
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

  async function handleDeleteComment() {
    if (!pendingCommentId) return;
    try {
      await deleteComment(pendingCommentId);
    } catch {
      // erro capturado pelo hook via error state
    } finally {
      setDeleteCommentVisible(false);
      setPendingCommentId(null);
    }
  }

  async function handleAddComment() {
    if (!commentText.trim()) return;
    setSendingComment(true);
    await addComment(commentText.trim());
    setSendingComment(false);
    setCommentText('');
  }

  const displayError = error ?? mutationError;
  function handleDismissError() {
    clearError();
    setMutationError(null);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <LoadingIndicator />
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.center}>
        <Text>Chamado não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{ticket.title}</Text>
      <Text style={styles.description}>{ticket.description}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Criado por: {ticket.creatorName}</Text>
        {ticket.createdAt && (
          <Text style={styles.metaText}>Em: {formatDate(ticket.createdAt)}</Text>
        )}
        {ticket.assigneeName && (
          <Text style={styles.metaText}>Responsável: {ticket.assigneeName}</Text>
        )}
      </View>

      <Text style={styles.sectionLabel}>Status</Text>

      {editing ? (
        <View style={styles.statusRow}>
          {ALL_STATUSES.map((s) => (
            <Button
              key={s}
              variant={draftStatus === s ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => setDraftStatus(s)}
            >
              {STATUS_LABELS[s]}
            </Button>
          ))}
        </View>
      ) : (
        <View
          style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[ticket.status] + '20' }]}
        >
          <Text style={[styles.statusBadgeText, { color: STATUS_COLORS[ticket.status] }]}>
            {STATUS_LABELS[ticket.status]}
          </Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>Prioridade</Text>

      {editing ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.priorityScrollContent}
        >
          <View style={styles.statusRow}>
            {ALL_PRIORITIES.map((p) => (
              <Button
                key={p}
                variant={draftPriority === p ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => setDraftPriority(p)}
              >
                {PRIORITY_LABELS[p]}
              </Button>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View
          style={[styles.statusBadge, { backgroundColor: PRIORITY_COLORS[ticket.priority] + '20' }]}
        >
          <Text style={[styles.statusBadgeText, { color: PRIORITY_COLORS[ticket.priority] }]}>
            {PRIORITY_LABELS[ticket.priority]}
          </Text>
        </View>
      )}

      {editing && (
        <Select
          label="Responsável"
          value={draftAssigneeId}
          onChange={(v) => setDraftAssigneeId(v)}
          options={[
            { label: 'Nenhum', value: '' },
            ...users.map((u) => ({ label: u.name, value: u.uid })),
          ]}
        />
      )}

      <Text style={styles.sectionLabel}>Comentários</Text>

      {comments.length === 0 && <Text style={styles.emptyComments}>Nenhum comentário ainda.</Text>}

      {comments.map((c) => (
        <View key={c.id} style={styles.commentCard}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentAuthor}>{c.authorName}</Text>
            <Text style={styles.commentDate}>{formatDate(c.createdAt)}</Text>
          </View>
          <Text style={styles.commentText}>{c.text}</Text>
          {(user?.uid === c.authorId || user?.role === 'admin') && (
            <Button
              variant="ghost"
              size="sm"
              onPress={() => {
                setPendingCommentId(c.id);
                setDeleteCommentVisible(true);
              }}
            >
              Apagar
            </Button>
          )}
        </View>
      ))}

      <Input
        label="Novo comentário"
        placeholder="Escreva um comentário..."
        value={commentText}
        onChangeText={setCommentText}
        multiline
        numberOfLines={3}
      />
      <Button onPress={handleAddComment} disabled={!commentText.trim() || sendingComment}>
        Enviar
      </Button>

      <Dialog
        visible={saveVisible}
        onDismiss={handleCancelSave}
        title="Salvar alterações"
        actions={[
          <Button key="cancel" variant="ghost" onPress={handleCancelSave}>
            Cancelar
          </Button>,
          <Button key="confirm" variant="primary" onPress={handleConfirmSave}>
            Salvar
          </Button>,
        ]}
      >
        <Text>
          Status: <Text style={styles.bold}>{STATUS_LABELS[draftStatus]}</Text>
          {'\n'}
          Prioridade: <Text style={styles.bold}>{PRIORITY_LABELS[draftPriority]}</Text>
          {'\n'}
          Responsável:{' '}
          <Text style={styles.bold}>
            {users.find((u) => u.uid === draftAssigneeId)?.name ?? 'Nenhum'}
          </Text>
        </Text>
      </Dialog>

      <Dialog
        visible={deleteVisible}
        onDismiss={() => setDeleteVisible(false)}
        title="Apagar ticket"
        actions={[
          <Button key="cancel" variant="ghost" onPress={() => setDeleteVisible(false)}>
            Cancelar
          </Button>,
          <Button key="confirm" variant="danger" onPress={handleDelete}>
            Apagar
          </Button>,
        ]}
      >
        <Text>Esta ação não pode ser desfeita.</Text>
      </Dialog>

      <Dialog
        visible={deleteCommentVisible}
        onDismiss={() => {
          setDeleteCommentVisible(false);
          setPendingCommentId(null);
        }}
        title="Apagar comentário"
        actions={[
          <Button
            key="cancel"
            variant="ghost"
            onPress={() => {
              setDeleteCommentVisible(false);
              setPendingCommentId(null);
            }}
          >
            Cancelar
          </Button>,
          <Button key="confirm" variant="danger" onPress={handleDeleteComment}>
            Apagar
          </Button>,
        ]}
      >
        <Text>Esta ação não pode ser desfeita.</Text>
      </Dialog>

      <Snackbar
        visible={displayError !== null}
        onDismiss={handleDismissError}
        message={displayError ?? ''}
        variant="error"
        position="top"
      />
    </ScrollView>
  );
}
