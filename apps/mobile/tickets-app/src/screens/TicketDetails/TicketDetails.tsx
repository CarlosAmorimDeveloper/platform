import { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { MaterialIcons } from '@expo/vector-icons';
import { LoadingIndicator, Button, Snackbar, Dialog, Select } from '@ds/mobile';
import { colors, spacing } from '@ds/tokens';
import { useTicketDetails } from '../../hooks/useTicketDetails';
import { useUserList } from '../../hooks/useUserList';
import { useAuthStore } from '../../store/useAuthStore';
import { STATUS_LABELS } from '../../constants/ticketStatus';
import { PRIORITY_LABELS } from '../../constants/ticketPriority';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useTicketEditMode } from './hooks/useTicketEditMode';
import { useCommentForm } from './hooks/useCommentForm';
import { useTicketDeletion } from './hooks/useTicketDeletion';
import { TicketMetaRow } from './components/TicketMetaRow';
import { TicketStatusField } from './components/TicketStatusField';
import { TicketPriorityField } from './components/TicketPriorityField';
import { CommentItem } from './components/CommentItem';
import { CommentInput } from './components/CommentInput';
import { styles } from './TicketDetails.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'TicketDetails'>;

export function TicketDetails({ route, navigation }: Props) {
  const { ticketId } = route.params;
  const headerHeight = useHeaderHeight();
  const scrollViewRef = useRef<ScrollViewType>(null);
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
              color={editMode.editing ? `${colors.success[500]}` : `${colors.neutral[600]}`}
            />
          </Pressable>
          <Pressable onPress={() => deletion.setDeleteVisible(true)} style={styles.headerIcon}>
            <MaterialIcons name="delete-outline" size={24} color={`${colors.error[500]}`} />
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
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{ticket.title}</Text>
        <Text style={styles.description}>{ticket.description}</Text>

        <TicketMetaRow
          creatorName={ticket.creatorName}
          createdAt={ticket.createdAt}
          assigneeName={ticket.assigneeName}
          editing={editMode.editing}
        />

        {editMode.editing && (
          <View style={{ paddingHorizontal: spacing[6] }}>
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
        <TicketStatusField
          status={ticket.status}
          editing={editMode.editing}
          draftStatus={editMode.draftStatus}
          onChangeDraft={editMode.setDraftStatus}
        />

        <Text style={styles.sectionLabel}>Prioridade</Text>
        <TicketPriorityField
          priority={ticket.priority}
          editing={editMode.editing}
          draftPriority={editMode.draftPriority}
          onChangeDraft={editMode.setDraftPriority}
        />

        <Text style={styles.sectionLabel}>Comentários</Text>

        {comments.length === 0 && (
          <Text style={styles.emptyComments}>Nenhum comentário ainda.</Text>
        )}

        {comments.map((c) => (
          <View style={{ paddingHorizontal: spacing[6] }} key={c.id}>
            <CommentItem
              comment={c}
              canDelete={user?.uid === c.authorId || user?.role === 'admin'}
              onDeletePress={() => deletion.handleRequestDeleteComment(c.id)}
            />
          </View>
        ))}

        <View style={{ paddingHorizontal: spacing[6] }}>
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
            Responsável:{' '}
            <Text style={styles.bold}>
              {users.find((u) => u.uid === editMode.draftAssigneeId)?.name ?? 'Nenhum'}
            </Text>
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
