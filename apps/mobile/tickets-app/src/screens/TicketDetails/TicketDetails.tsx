import { useEffect, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LoadingIndicator, Button, Snackbar, Dialog, Select } from '@ds/mobile';
import { colors } from '@ds/tokens';
import { useTicketDetails } from '../../hooks/useTicketDetails';
import { useUserList } from '../../hooks/useUserList';
import { useAuthStore } from '../../store/useAuthStore';
import { ALL_STATUSES, STATUS_LABELS, STATUS_COLORS } from '../../constants/ticketStatus';
import { ALL_PRIORITIES, PRIORITY_LABELS, PRIORITY_COLORS } from '../../constants/ticketPriority';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useTicketEditMode } from './hooks/useTicketEditMode';
import { useCommentForm } from './hooks/useCommentForm';
import { useTicketDeletion } from './hooks/useTicketDeletion';
import { TicketMetaRow } from './components/TicketMetaRow';
import { TicketOptionField } from './components/TicketOptionField';
import { CommentItem } from './components/CommentItem';
import { CommentInput } from './components/CommentInput';
import { styles } from './TicketDetails.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'TicketDetails'>;

export function TicketDetails({ route, navigation }: Props) {
  const { ticketId } = route.params;
  const user = useAuthStore((s) => s.user);
  const { ticket, comments, loading, error, clearError, addComment, deleteComment } =
    useTicketDetails(ticketId);
  const { users } = useUserList();

  const editMode = useTicketEditMode({
    ticketId,
    workspaceId: user?.workspaceId ?? '',
    users,
    ticket,
  });
  const commentForm = useCommentForm({ addComment });
  const deletion = useTicketDeletion({
    ticketId,
    workspaceId: user?.workspaceId ?? '',
    navigation,
    deleteComment,
  });

  useEffect(() => {
    if (user?.role !== 'admin') return;
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerIcons}>
          <Pressable onPress={editMode.onEditPress} style={styles.headerIcon}>
            <MaterialIcons
              name={editMode.editing ? 'check' : 'edit'}
              size={24}
              color={editMode.editing ? colors.success[500] : colors.neutral[600]}
            />
          </Pressable>
          <Pressable onPress={() => deletion.setDeleteVisible(true)} style={styles.headerIcon}>
            <MaterialIcons name="delete-outline" size={24} color={colors.error[500]} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, user?.role, editMode.editing, ticket?.status, ticket?.priority]);

  const displayError = error ?? editMode.mutationError ?? deletion.mutationError;
  function handleDismissError() {
    clearError();
    editMode.clearMutationError();
    deletion.clearMutationError();
  }

  const assigneeName = useMemo(
    () => users.find((u) => u.uid === editMode.draftAssigneeId)?.name ?? 'Nenhum',
    [users, editMode.draftAssigneeId],
  );

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
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{ticket.title}</Text>
        <Text style={styles.description}>{ticket.description}</Text>

        <TicketMetaRow
          creatorName={ticket.creatorName}
          createdAt={ticket.createdAt}
          assigneeName={ticket.assigneeName}
          editing={editMode.editing}
        />

        {editMode.editing && (
          <View style={styles.paddedRow}>
            <Select
              label="Responsável"
              value={editMode.draftAssigneeId}
              onChange={(v) => editMode.setDraftAssigneeId(v)}
              options={[
                { label: 'Nenhum', value: '' },
                ...users.map((u) => ({ label: u.name, value: u.uid })),
              ]}
            />
          </View>
        )}

        <Text style={styles.sectionLabel}>Status</Text>
        <TicketOptionField
          value={ticket.status}
          editing={editMode.editing}
          draft={editMode.draftStatus}
          onChangeDraft={editMode.setDraftStatus}
          options={ALL_STATUSES}
          labels={STATUS_LABELS}
          colors={STATUS_COLORS}
        />

        <Text style={styles.sectionLabel}>Prioridade</Text>
        <TicketOptionField
          value={ticket.priority}
          editing={editMode.editing}
          draft={editMode.draftPriority}
          onChangeDraft={editMode.setDraftPriority}
          options={ALL_PRIORITIES}
          labels={PRIORITY_LABELS}
          colors={PRIORITY_COLORS}
        />

        <Text style={styles.sectionLabel}>Comentários</Text>

        {comments.length === 0 && (
          <Text style={styles.emptyComments}>Nenhum comentário ainda.</Text>
        )}

        {comments.map((c) => (
          <View style={styles.paddedRow} key={c.id}>
            <CommentItem
              comment={c}
              canDelete={user?.uid === c.authorId || user?.role === 'admin'}
              onDeletePress={() => deletion.handleRequestDeleteComment(c.id)}
            />
          </View>
        ))}

        <View style={styles.paddedRow}>
          <CommentInput
            value={commentForm.commentText}
            onChangeText={commentForm.setCommentText}
            onSubmit={commentForm.handleAddComment}
            disabled={!commentForm.commentText.trim() || commentForm.sendingComment}
          />
        </View>

        <Dialog
          visible={editMode.saveVisible}
          onDismiss={editMode.handleCancelSave}
          title="Salvar alterações"
          actions={[
            <Button key="cancel" variant="ghost" onPress={editMode.handleCancelSave}>
              Cancelar
            </Button>,
            <Button key="confirm" variant="primary" onPress={editMode.handleConfirmSave}>
              Salvar
            </Button>,
          ]}
        >
          <Text>
            Status: <Text style={styles.bold}>{STATUS_LABELS[editMode.draftStatus]}</Text>
            {'\n'}
            Prioridade: <Text style={styles.bold}>{PRIORITY_LABELS[editMode.draftPriority]}</Text>
            {'\n'}
            Responsável: <Text style={styles.bold}>{assigneeName}</Text>
          </Text>
        </Dialog>

        <Dialog
          visible={deletion.deleteVisible}
          onDismiss={() => deletion.setDeleteVisible(false)}
          title="Apagar ticket"
          actions={[
            <Button key="cancel" variant="ghost" onPress={() => deletion.setDeleteVisible(false)}>
              Cancelar
            </Button>,
            <Button key="confirm" variant="danger" onPress={deletion.handleDelete}>
              Apagar
            </Button>,
          ]}
        >
          <Text>Esta ação não pode ser desfeita.</Text>
        </Dialog>

        <Dialog
          visible={deletion.deleteCommentVisible}
          onDismiss={deletion.handleCancelDeleteComment}
          title="Apagar comentário"
          actions={[
            <Button key="cancel" variant="ghost" onPress={deletion.handleCancelDeleteComment}>
              Cancelar
            </Button>,
            <Button key="confirm" variant="danger" onPress={deletion.handleDeleteComment}>
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
    </KeyboardAvoidingView>
  );
}
