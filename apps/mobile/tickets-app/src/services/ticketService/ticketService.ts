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

export function subscribeToTickets(
  user: User,
  onData: (tickets: Ticket[]) => void,
  onError: () => void,
): Unsubscribe {
  const col = collection(db, 'tickets');
  const q =
    user.role === 'admin'
      ? query(col, orderBy('createdAt', 'desc'))
      : query(col, where('creator_id', '==', user.uid), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snap) => onData(snap.docs.map(toTicket)), onError);
}

export function subscribeToTicket(
  ticketId: string,
  onData: (ticket: Ticket) => void,
  onError: () => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, 'tickets', ticketId),
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
  onData: (comments: Comment[]) => void,
  onError: () => void,
): Unsubscribe {
  const q = query(collection(db, 'tickets', ticketId, 'comments'));
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
  data: Pick<Ticket, 'title' | 'description' | 'priority'>,
  user: User,
): Promise<void> {
  await addDoc(collection(db, 'tickets'), {
    title: data.title,
    description: data.description,
    priority: data.priority,
    creator_id: user.uid,
    creator_name: user.name,
    status: 'open' satisfies TicketStatus,
    createdAt: serverTimestamp(),
  });
}

export async function updateTicket(
  ticketId: string,
  patch: Partial<Pick<Ticket, 'status' | 'priority'>>,
): Promise<void> {
  await updateDoc(doc(db, 'tickets', ticketId), patch);
}

export async function deleteTicket(ticketId: string): Promise<void> {
  await deleteDoc(doc(db, 'tickets', ticketId));
}

export async function addComment(ticketId: string, text: string, user: User): Promise<void> {
  await addDoc(collection(db, 'tickets', ticketId, 'comments'), {
    text,
    author_id: user.uid,
    author_name: user.name,
    createdAt: serverTimestamp(),
  });
}

export async function deleteComment(ticketId: string, commentId: string): Promise<void> {
  await deleteDoc(doc(db, 'tickets', ticketId, 'comments', commentId));
}
