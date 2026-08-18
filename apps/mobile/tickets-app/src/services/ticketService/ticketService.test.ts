import {
  onSnapshot,
  query,
  where,
  orderBy,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  subscribeToTicketList,
  createTicket,
  updateTicket,
  deleteTicket,
  addComment,
  deleteComment,
} from './ticketService';
import { db } from '../firebase';
import type { Ticket } from '../../domain/ticket';
import type { User } from '../../domain/user';

jest.mock('../firebase', () => ({ db: {} }));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn((...args) => ({ __col: true, args })),
  doc: jest.fn((...args) => ({ __doc: true, args })),
  query: jest.fn((col, ...constraints) => ({ col, constraints })),
  where: jest.fn((field, op, value) => ({ type: 'where', field, op, value })),
  orderBy: jest.fn((field, direction) => ({ type: 'orderBy', field, direction })),
  onSnapshot: jest.fn(() => jest.fn()),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn(() => ({ __serverTimestamp: true })),
}));

const mockOnSnapshot = onSnapshot as jest.Mock;
const mockQuery = query as jest.Mock;
const mockWhere = where as jest.Mock;
const mockOrderBy = orderBy as jest.Mock;
const mockCollection = collection as jest.Mock;
const mockDoc = doc as jest.Mock;
const mockAddDoc = addDoc as jest.Mock;
const mockUpdateDoc = updateDoc as jest.Mock;
const mockDeleteDoc = deleteDoc as jest.Mock;
const mockServerTimestamp = serverTimestamp as jest.Mock;

const adminUser: User = {
  uid: 'admin-1',
  email: 'admin@test.com',
  name: 'Admin',
  role: 'admin',
  workspaceId: 'ws-1',
};

const standardUser: User = {
  uid: 'user-1',
  email: 'user@test.com',
  name: 'Bob',
  role: 'standard',
  workspaceId: 'ws-1',
};

function fakeTicketDoc(id: string, creatorId: string, assigneeId: string | null, millis: number) {
  return {
    id,
    data: () => ({
      title: `Ticket ${id}`,
      description: '',
      status: 'open',
      priority: 'medium',
      creator_id: creatorId,
      creator_name: 'Someone',
      assignee_id: assigneeId,
      assignee_name: assigneeId ? 'Bob' : null,
      createdAt: { toMillis: () => millis },
    }),
  };
}

describe('subscribeToTicketList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all tickets for admin users via a single query ordered by createdAt', () => {
    const onData = jest.fn();
    const onError = jest.fn();

    subscribeToTicketList(adminUser, onData, onError);

    expect(mockWhere).not.toHaveBeenCalled();
    expect(mockOrderBy).toHaveBeenCalledWith('createdAt', 'desc');
    expect(mockOnSnapshot).toHaveBeenCalledTimes(1);

    const snapshotCallback = mockOnSnapshot.mock.calls[0][1];
    snapshotCallback({ docs: [fakeTicketDoc('t1', 'x', null, 100)] });

    expect(onData).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 't1' })]),
    );
  });

  it('merges tickets created by and assigned to a standard user, deduplicated and sorted by createdAt desc', () => {
    const onData = jest.fn();
    const onError = jest.fn();

    subscribeToTicketList(standardUser, onData, onError);

    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(mockOnSnapshot).toHaveBeenCalledTimes(2);

    const [createdCallback] = mockOnSnapshot.mock.calls[0];
    const [assignedCallback] = mockOnSnapshot.mock.calls[1];
    const createdSuccess = mockOnSnapshot.mock.calls[0][1];
    const assignedSuccess = mockOnSnapshot.mock.calls[1][1];
    expect(createdCallback).toBeTruthy();
    expect(assignedCallback).toBeTruthy();

    createdSuccess({ docs: [fakeTicketDoc('created-only', standardUser.uid, null, 100)] });
    assignedSuccess({
      docs: [
        fakeTicketDoc('assigned-only', 'admin-1', standardUser.uid, 300),
        fakeTicketDoc('created-only', standardUser.uid, standardUser.uid, 100),
      ],
    });

    expect(onData).toHaveBeenCalledTimes(1);
    const tickets = onData.mock.calls[0][0] as Ticket[];
    expect(tickets.map((t) => t.id)).toEqual(['assigned-only', 'created-only']);
  });

  it('unsubscribes both listeners for a standard user', () => {
    const unsubscribeCreated = jest.fn();
    const unsubscribeAssigned = jest.fn();
    mockOnSnapshot.mockReturnValueOnce(unsubscribeCreated).mockReturnValueOnce(unsubscribeAssigned);

    const unsubscribe = subscribeToTicketList(standardUser, jest.fn(), jest.fn());
    unsubscribe();

    expect(unsubscribeCreated).toHaveBeenCalledTimes(1);
    expect(unsubscribeAssigned).toHaveBeenCalledTimes(1);
  });
});

describe('ticketService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTicket', () => {
    it('adds a new ticket to firestore without an assignee', async () => {
      await createTicket(
        { title: 'Fix login bug', description: 'Users cannot log in', priority: 'high' },
        standardUser,
      );

      expect(mockCollection).toHaveBeenCalledWith(
        db,
        'workspaces',
        standardUser.workspaceId,
        'tickets',
      );
      expect(mockServerTimestamp).toHaveBeenCalledTimes(1);
      const colRef = mockCollection.mock.results[0]?.value;
      expect(mockAddDoc).toHaveBeenCalledWith(colRef, {
        title: 'Fix login bug',
        description: 'Users cannot log in',
        priority: 'high',
        creator_id: standardUser.uid,
        creator_name: standardUser.name,
        status: 'open',
        createdAt: { __serverTimestamp: true },
      });
    });

    it('adds a new ticket to firestore with an assignee', async () => {
      await createTicket(
        {
          title: 'Fix login bug',
          description: 'Users cannot log in',
          priority: 'high',
          assigneeId: 'user-2',
          assigneeName: 'Alice',
        },
        standardUser,
      );

      const colRef = mockCollection.mock.results[0]?.value;
      expect(mockAddDoc).toHaveBeenCalledWith(colRef, {
        title: 'Fix login bug',
        description: 'Users cannot log in',
        priority: 'high',
        creator_id: standardUser.uid,
        creator_name: standardUser.name,
        status: 'open',
        createdAt: { __serverTimestamp: true },
        assignee_id: 'user-2',
        assignee_name: 'Alice',
      });
    });
  });

  describe('updateTicket', () => {
    it('updates status and priority fields in firestore without touching the assignee', async () => {
      await updateTicket('ticket-1', { status: 'in_progress', priority: 'high' }, 'ws-1');

      expect(mockDoc).toHaveBeenCalledWith(db, 'workspaces', 'ws-1', 'tickets', 'ticket-1');
      const docRef = mockDoc.mock.results[0]?.value;
      expect(mockUpdateDoc).toHaveBeenCalledWith(docRef, {
        status: 'in_progress',
        priority: 'high',
      });
    });

    it('remaps assigneeId/assigneeName to assignee_id/assignee_name when reassigning', async () => {
      await updateTicket('ticket-1', { assigneeId: 'user-2', assigneeName: 'Alice' }, 'ws-1');

      const docRef = mockDoc.mock.results[0]?.value;
      expect(mockUpdateDoc).toHaveBeenCalledWith(docRef, {
        assignee_id: 'user-2',
        assignee_name: 'Alice',
      });
    });

    it('writes null assignee fields when reassigning to null to unassign', async () => {
      await updateTicket('ticket-1', { assigneeId: null, assigneeName: null }, 'ws-1');

      const docRef = mockDoc.mock.results[0]?.value;
      expect(mockUpdateDoc).toHaveBeenCalledWith(docRef, {
        assignee_id: null,
        assignee_name: null,
      });
    });
  });

  describe('deleteTicket', () => {
    it('removes ticket from firestore', async () => {
      await deleteTicket('ticket-1', 'ws-1');

      expect(mockDoc).toHaveBeenCalledWith(db, 'workspaces', 'ws-1', 'tickets', 'ticket-1');
      const docRef = mockDoc.mock.results[0]?.value;
      expect(mockDeleteDoc).toHaveBeenCalledWith(docRef);
    });
  });

  describe('addComment', () => {
    it('adds a comment to ticket subcollection', async () => {
      await addComment('ticket-1', 'Looks good', standardUser);

      expect(mockCollection).toHaveBeenCalledWith(
        db,
        'workspaces',
        standardUser.workspaceId,
        'tickets',
        'ticket-1',
        'comments',
      );
      const colRef = mockCollection.mock.results[0]?.value;
      expect(mockAddDoc).toHaveBeenCalledWith(colRef, {
        text: 'Looks good',
        author_id: standardUser.uid,
        author_name: standardUser.name,
        createdAt: { __serverTimestamp: true },
      });
    });
  });

  describe('deleteComment', () => {
    it('removes a comment from ticket subcollection', async () => {
      await deleteComment('ticket-1', 'comment-1', 'ws-1');

      expect(mockCollection).toHaveBeenCalledWith(
        db,
        'workspaces',
        'ws-1',
        'tickets',
        'ticket-1',
        'comments',
      );
      const colRef = mockCollection.mock.results[0]?.value;
      expect(mockDoc).toHaveBeenCalledWith(colRef, 'comment-1');
      const docRef = mockDoc.mock.results[0]?.value;
      expect(mockDeleteDoc).toHaveBeenCalledWith(docRef);
    });
  });
});
