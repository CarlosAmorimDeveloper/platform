import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { LoadingIndicator, Button, Snackbar, Dialog, Input } from '@ds/mobile';
import { colors, fontSizes, spacing, radii } from '@ds/tokens';
import { db } from '../services/firebase';
import { useAuthStore } from '../store/useAuthStore';
import {
  ALL_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  type TicketStatus,
} from '../constants/ticketStatus';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'TicketDetails'>;

interface TicketData {
  title: string;
  description: string;
  status: TicketStatus;
  creator_name: string;
  createdAt: Timestamp | null;
}

interface Comment {
  id: string;
  text: string;
  author_id: string;
  author_name: string;
  createdAt: Timestamp | null;
}

function formatDate(ts: Timestamp | null): string {
  if (!ts) return '';
  return ts.toDate().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TicketDetails({ route, navigation }: Props) {
  const { ticketId } = route.params;
  const user = useAuthStore((s) => s.user);
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'tickets', ticketId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setTicket({
          title: data.title as string,
          description: data.description as string,
          status: (data.status ?? 'open') as TicketStatus,
          creator_name: (data.creator_name ?? data.creator_id ?? '') as string,
          createdAt: (data.createdAt as Timestamp) ?? null,
        });
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [ticketId]);

  useEffect(() => {
    const q = query(collection(db, 'tickets', ticketId, 'comments'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setComments(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            text: data.text as string,
            author_id: data.author_id as string,
            author_name: data.author_name as string,
            createdAt: (data.createdAt as Timestamp) ?? null,
          };
        }),
      );
    });
    return unsubscribe;
  }, [ticketId]);

  async function handleDelete() {
    try {
      await deleteDoc(doc(db, 'tickets', ticketId));
      navigation.goBack();
    } catch (err: unknown) {
      setDeleteVisible(false);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to delete ticket');
    }
  }

  async function handleStatusChange(newStatus: TicketStatus) {
    try {
      await updateDoc(doc(db, 'tickets', ticketId), { status: newStatus });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  async function handleAddComment() {
    if (!commentText.trim() || !user) return;
    setSendingComment(true);
    try {
      await addDoc(collection(db, 'tickets', ticketId, 'comments'), {
        text: commentText.trim(),
        author_id: user.uid,
        author_name: user.name,
        createdAt: serverTimestamp(),
      });
      setCommentText('');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setSendingComment(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      await deleteDoc(doc(db, 'tickets', ticketId, 'comments', commentId));
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to delete comment');
    }
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
        <Text>Ticket not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{ticket.title}</Text>
      <Text style={styles.description}>{ticket.description}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Criado por: {ticket.creator_name}</Text>
        {ticket.createdAt && (
          <Text style={styles.metaText}>Em: {formatDate(ticket.createdAt)}</Text>
        )}
      </View>

      <Text style={styles.sectionLabel}>Status</Text>

      {user?.role === 'admin' ? (
        <>
          <View style={styles.statusRow}>
            {ALL_STATUSES.map((s) => (
              <Button
                key={s}
                variant={ticket.status === s ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => handleStatusChange(s)}
              >
                {STATUS_LABELS[s]}
              </Button>
            ))}
          </View>
          <Button variant="danger" onPress={() => setDeleteVisible(true)}>
            Apagar ticket
          </Button>
        </>
      ) : (
        <View
          style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[ticket.status] + '20' }]}
        >
          <Text style={[styles.statusBadgeText, { color: STATUS_COLORS[ticket.status] }]}>
            {STATUS_LABELS[ticket.status]}
          </Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>Comentários</Text>

      {comments.length === 0 && <Text style={styles.emptyComments}>Nenhum comentário ainda.</Text>}

      {comments.map((c) => (
        <View key={c.id} style={styles.commentCard}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentAuthor}>{c.author_name}</Text>
            <Text style={styles.commentDate}>{formatDate(c.createdAt)}</Text>
          </View>
          <Text style={styles.commentText}>{c.text}</Text>
          {(user?.uid === c.author_id || user?.role === 'admin') && (
            <Button variant="ghost" size="sm" onPress={() => handleDeleteComment(c.id)}>
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

      <Snackbar
        visible={errorMessage !== null}
        onDismiss={() => setErrorMessage(null)}
        message={errorMessage ?? ''}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: spacing[6], gap: spacing[3] },
  title: { fontSize: 22, fontWeight: 'bold', color: `${colors.neutral[900]}` },
  description: { fontSize: fontSizes.base, color: `${colors.neutral[500]}`, lineHeight: 24 },
  metaRow: { gap: spacing[1] },
  metaText: { fontSize: fontSizes.sm, color: `${colors.neutral[500]}` },
  sectionLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: `${colors.neutral[700]}`,
    marginTop: spacing[2],
  },
  statusRow: { flexDirection: 'row', gap: spacing[2] },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii['2xl'],
  },
  statusBadgeText: { fontSize: fontSizes.sm, fontWeight: '600' },
  emptyComments: { fontSize: fontSizes.sm, color: `${colors.neutral[400]}` },
  commentCard: {
    backgroundColor: `${colors.neutral[200]}`,
    borderRadius: radii.lg,
    padding: spacing[3],
    gap: spacing[1],
  },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentAuthor: { fontSize: fontSizes.sm, fontWeight: '600', color: `${colors.neutral[800]}` },
  commentDate: { fontSize: fontSizes.xs, color: `${colors.neutral[500]}` },
  commentText: { fontSize: fontSizes.base, color: `${colors.neutral[700]}` },
});
