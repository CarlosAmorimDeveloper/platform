import { useEffect, useMemo, useRef } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Button,
  Dialog,
  Field,
  IconButton,
  LoadingIndicator,
  Select,
  useTheme,
  useToast,
} from '@vuotto/mobile';
import { useTicketDetails } from '../../hooks/useTicketDetails';
import { useUserList } from '../../hooks/useUserList';
import { useAuthStore } from '../../store/useAuthStore';
import { ALL_STATUSES, STATUS_LABELS, STATUS_TONES } from '../../constants/ticketStatus';
import { ALL_PRIORITIES, PRIORITY_LABELS, PRIORITY_TONES } from '../../constants/ticketPriority';
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
  const { colors } = useTheme();
  const toast = useToast();
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
          <IconButton
            icon={editMode.editing ? 'Check' : 'Pencil'}
            label={editMode.editing ? 'Confirmar edição' : 'Editar chamado'}
            onPress={editMode.onEditPress}
          />
          <IconButton
            icon="Trash2"
            label="Apagar chamado"
            onPress={() => deletion.setDeleteVisible(true)}
          />
        </View>
      ),
    });
  }, [navigation, user?.role, editMode.editing, ticket?.status, ticket?.priority]);

  const displayError = error ?? editMode.mutationError ?? deletion.mutationError;

  const dismissError = useRef(() => {});
  dismissError.current = () => {
    toast.show({ tone: 'danger', title: displayError ?? '' });
    clearError();
    editMode.clearMutationError();
    deletion.clearMutationError();
  };

  useEffect(() => {
    if (!displayError) return;
    dismissError.current();
  }, [displayError]);

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
        <Text style={[styles.title, { color: colors.textHeading }]}>{ticket.title}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {ticket.description}
        </Text>

        <TicketMetaRow
          creatorName={ticket.creatorName}
          createdAt={ticket.createdAt}
          assigneeName={ticket.assigneeName}
          editing={editMode.editing}
        />

        {editMode.editing && (
          <View style={styles.paddedRow}>
            <Field label="Responsável">
              <Select
                value={editMode.draftAssigneeId}
                onChange={(v) => editMode.setDraftAssigneeId(v)}
                options={[
                  { label: 'Nenhum', value: '' },
                  ...users.map((u) => ({ label: u.name, value: u.uid })),
                ]}
              />
            </Field>
          </View>
        )}

        <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>Status</Text>
        <TicketOptionField
          value={ticket.status}
          editing={editMode.editing}
          draft={editMode.draftStatus}
          onChangeDraft={editMode.setDraftStatus}
          options={ALL_STATUSES}
          labels={STATUS_LABELS}
          tones={STATUS_TONES}
        />

        <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>Prioridade</Text>
        <TicketOptionField
          value={ticket.priority}
          editing={editMode.editing}
          draft={editMode.draftPriority}
          onChangeDraft={editMode.setDraftPriority}
          options={ALL_PRIORITIES}
          labels={PRIORITY_LABELS}
          tones={PRIORITY_TONES}
        />

        <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>Comentários</Text>

        {comments.length === 0 && (
          <Text style={[styles.emptyComments, { color: colors.textTertiary }]}>
            Nenhum comentário ainda.
          </Text>
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
          open={editMode.saveVisible}
          onClose={editMode.handleCancelSave}
          title="Salvar alterações"
          footer={
            <>
              <Button key="cancel" variant="ghost" onPress={editMode.handleCancelSave}>
                Cancelar
              </Button>
              <Button key="confirm" variant="primary" onPress={editMode.handleConfirmSave}>
                Salvar
              </Button>
            </>
          }
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
          open={deletion.deleteVisible}
          onClose={() => deletion.setDeleteVisible(false)}
          title="Apagar ticket"
          description="Esta ação não pode ser desfeita."
          footer={
            <>
              <Button key="cancel" variant="ghost" onPress={() => deletion.setDeleteVisible(false)}>
                Cancelar
              </Button>
              <Button key="confirm" variant="danger" onPress={deletion.handleDelete}>
                Apagar
              </Button>
            </>
          }
        />

        <Dialog
          open={deletion.deleteCommentVisible}
          onClose={deletion.handleCancelDeleteComment}
          title="Apagar comentário"
          description="Esta ação não pode ser desfeita."
          footer={
            <>
              <Button key="cancel" variant="ghost" onPress={deletion.handleCancelDeleteComment}>
                Cancelar
              </Button>
              <Button key="confirm" variant="danger" onPress={deletion.handleDeleteComment}>
                Apagar
              </Button>
            </>
          }
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
