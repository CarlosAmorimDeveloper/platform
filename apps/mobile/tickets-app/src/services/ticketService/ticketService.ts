import {
  collection,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  type Unsubscribe,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { toTicket, type Ticket, type Comment } from '../../domain/ticket';
import type { TicketStatus } from '../../constants/ticketStatus';
import type { User } from '../../domain/user';

function ticketsCol(workspaceId: string) {
  return collection(db, 'workspaces', workspaceId, 'tickets');
}
function ticketDoc(workspaceId: string, ticketId: string) {
  return doc(db, 'workspaces', workspaceId, 'tickets', ticketId);
}
function commentsCol(workspaceId: string, ticketId: string) {
  return collection(db, 'workspaces', workspaceId, 'tickets', ticketId, 'comments');
}

export function subscribeToTicketList(
  user: User,
  onData: (tickets: Ticket[]) => void,
  onError: () => void,
): Unsubscribe {
  const col = ticketsCol(user.workspaceId);
  const q =
    user.role === 'admin'
      ? query(col, orderBy('createdAt', 'desc'))
      : query(col, where('creator_id', '==', user.uid), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snap) => onData(snap.docs.map(toTicket)), onError);
}

export function subscribeToTicketById(
  ticketId: string,
  workspaceId: string,
  onData: (ticket: Ticket) => void,
  onError: () => void,
): Unsubscribe {
  return onSnapshot(
    ticketDoc(workspaceId, ticketId),
    (snap) => {
      if (snap.exists()) {
        onData(toTicket(snap as unknown as QueryDocumentSnapshot));
      }
    },
    onError,
  );
}

export function subscribeToComments(
  ticketId: string,
  workspaceId: string,
  onData: (comments: Comment[]) => void,
  onError: () => void,
): Unsubscribe {
  const q = query(commentsCol(workspaceId, ticketId));
  return onSnapshot(
    q,
    (snap) => {
      const comments = snap.docs
        .map((d) => {
          const data = d.data();
          return {
            id: d.id,
            text: data.text as string,
            authorId: data.author_id as string,
            authorName: data.author_name as string,
            createdAt: (data.createdAt as Timestamp) ?? null,
          } satisfies Comment;
        })
        .sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return a.createdAt.toMillis() - b.createdAt.toMillis();
        });
      onData(comments);
    },
    onError,
  );
}

export async function createTicket(
  data: Pick<Ticket, 'title' | 'description' | 'priority'> & {
    assigneeId?: string | null;
    assigneeName?: string | null;
  },
  user: User,
): Promise<void> {
  await addDoc(ticketsCol(user.workspaceId), {
    title: data.title,
    description: data.description,
    priority: data.priority,
    creator_id: user.uid,
    creator_name: user.name,
    status: 'open' satisfies TicketStatus,
    createdAt: serverTimestamp(),
    ...(data.assigneeId ? { assignee_id: data.assigneeId, assignee_name: data.assigneeName } : {}),
  });
}

export async function updateTicket(
  ticketId: string,
  patch: Partial<Pick<Ticket, 'status' | 'priority'>> & {
    assigneeId?: string | null;
    assigneeName?: string | null;
  },
  workspaceId: string,
): Promise<void> {
  const { assigneeId, assigneeName, ...rest } = patch;
  const firestorePatch: Record<string, unknown> = { ...rest };
  if ('assigneeId' in patch) {
    firestorePatch.assignee_id = assigneeId ?? null;
    firestorePatch.assignee_name = assigneeName ?? null;
  }
  await updateDoc(ticketDoc(workspaceId, ticketId), firestorePatch);
}

export async function deleteTicket(ticketId: string, workspaceId: string): Promise<void> {
  await deleteDoc(ticketDoc(workspaceId, ticketId));
}

export async function addComment(ticketId: string, text: string, user: User): Promise<void> {
  await addDoc(commentsCol(user.workspaceId, ticketId), {
    text,
    author_id: user.uid,
    author_name: user.name,
    createdAt: serverTimestamp(),
  });
}

export async function deleteComment(
  ticketId: string,
  commentId: string,
  workspaceId: string,
): Promise<void> {
  await deleteDoc(doc(commentsCol(workspaceId, ticketId), commentId));
}
