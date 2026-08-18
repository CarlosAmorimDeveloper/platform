import { onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { subscribeToTicketList } from './ticketService';
import type { Ticket } from '../../domain/ticket';
import type { User } from '../../domain/user';

jest.mock('../firebase', () => ({ db: {} }));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => ({ __col: true })),
  doc: jest.fn(),
  query: jest.fn((col, ...constraints) => ({ col, constraints })),
  where: jest.fn((field, op, value) => ({ type: 'where', field, op, value })),
  orderBy: jest.fn((field, direction) => ({ type: 'orderBy', field, direction })),
  onSnapshot: jest.fn(() => jest.fn()),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

const mockOnSnapshot = onSnapshot as jest.Mock;
const mockQuery = query as jest.Mock;
const mockWhere = where as jest.Mock;
const mockOrderBy = orderBy as jest.Mock;

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

    // Created-by-me: an older ticket the user authored themselves.
    createdSuccess({ docs: [fakeTicketDoc('created-only', standardUser.uid, null, 100)] });
    // Assigned-to-me: a newer ticket assigned by an admin, plus the same
    // ticket the user both created AND was assigned (must not duplicate).
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
  it.todo('createTicket adds a new ticket to firestore');
  it.todo('updateTicket updates ticket fields in firestore');
  it.todo('deleteTicket removes ticket from firestore');
  it.todo('addComment adds a comment to ticket subcollection');
  it.todo('deleteComment removes a comment from ticket subcollection');
});
