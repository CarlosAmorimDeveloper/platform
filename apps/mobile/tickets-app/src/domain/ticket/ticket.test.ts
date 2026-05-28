import type { Timestamp } from 'firebase/firestore';
import { formatDate, toTicket } from './ticket';
import type { Ticket } from './ticket';

function makeDoc(id: string, data: Record<string, unknown>) {
  return { id, data: () => data } as Parameters<typeof toTicket>[0];
}

function makeTimestamp(date: Date) {
  return { toDate: () => date } as unknown as Timestamp;
}

describe('toTicket', () => {
  beforeEach(() => jest.clearAllMocks());

  it('maps all fields from Firestore document', () => {
    const ts = makeTimestamp(new Date());
    const doc = makeDoc('ticket-1', {
      title: 'Bug report',
      description: 'Something broke',
      status: 'in_progress',
      priority: 'high',
      creator_id: 'user-1',
      creator_name: 'Alice',
      createdAt: ts,
    });
    const ticket: Ticket = toTicket(doc);
    expect(ticket.id).toBe('ticket-1');
    expect(ticket.title).toBe('Bug report');
    expect(ticket.description).toBe('Something broke');
    expect(ticket.status).toBe('in_progress');
    expect(ticket.priority).toBe('high');
    expect(ticket.creatorId).toBe('user-1');
    expect(ticket.creatorName).toBe('Alice');
    expect(ticket.createdAt).toBe(ts);
  });

  it('uses empty string defaults for missing string fields', () => {
    const ticket = toTicket(makeDoc('t2', {}));
    expect(ticket.title).toBe('');
    expect(ticket.description).toBe('');
    expect(ticket.creatorId).toBe('');
    expect(ticket.creatorName).toBe('');
  });

  it('defaults status to open when missing', () => {
    expect(toTicket(makeDoc('t3', {})).status).toBe('open');
  });

  it('defaults priority to medium when missing', () => {
    expect(toTicket(makeDoc('t4', {})).priority).toBe('medium');
  });

  it('defaults createdAt to null when missing', () => {
    expect(toTicket(makeDoc('t5', {})).createdAt).toBeNull();
  });
});

describe('formatDate', () => {
  beforeEach(() => jest.clearAllMocks());

  it('formats a Timestamp to pt-BR locale string', () => {
    const date = new Date(2024, 0, 15, 14, 30);
    const result = formatDate(makeTimestamp(date));
    expect(result).toContain('15');
    expect(result).toContain('01');
    expect(result).toContain('2024');
  });

  it('returns empty string for null timestamp', () => {
    expect(formatDate(null)).toBe('');
  });
});
