import { act, renderHook } from '@testing-library/react-native';
import { subscribeToTickets } from '../../services/ticketService';
import { useAuthStore } from '../../store/useAuthStore';
import type { Ticket } from '../../domain/ticket';
import { useTicketList } from './useTicketList';

jest.mock('../../store/useAuthStore');
jest.mock('../../services/ticketService');
jest.mock('../../services/firebase', () => ({ auth: {}, db: {} }));

const mockUseAuthStore = useAuthStore as jest.Mock;
const mockSubscribeToTickets = subscribeToTickets as jest.Mock;

const mockUser = { uid: 'u1', email: 'alice@test.com', name: 'Alice', role: 'admin' as const };

const mockTickets: Ticket[] = [
  {
    id: 't1',
    title: 'Bug',
    description: '',
    status: 'open',
    priority: 'high',
    creatorId: 'u1',
    creatorName: 'Alice',
    createdAt: null,
  },
  {
    id: 't2',
    title: 'Feature',
    description: '',
    status: 'done',
    priority: 'low',
    creatorId: 'u1',
    creatorName: 'Alice',
    createdAt: null,
  },
];

describe('useTicketList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockImplementation((selector: (s: { user: typeof mockUser }) => unknown) =>
      selector({ user: mockUser }),
    );
    mockSubscribeToTickets.mockReturnValue(jest.fn());
  });

  it('returns empty tickets array and loading true initially', () => {
    const { result } = renderHook(() => useTicketList());
    expect(result.current.tickets).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('populates tickets and sets loading false when subscription fires', () => {
    mockSubscribeToTickets.mockImplementation(
      (_user: unknown, onData: (tickets: Ticket[]) => void) => {
        onData(mockTickets);
        return jest.fn();
      },
    );
    const { result } = renderHook(() => useTicketList());
    expect(result.current.tickets).toHaveLength(2);
    expect(result.current.loading).toBe(false);
  });

  it('filters tickets by status when statusFilter is provided', () => {
    mockSubscribeToTickets.mockImplementation(
      (_user: unknown, onData: (tickets: Ticket[]) => void) => {
        onData(mockTickets);
        return jest.fn();
      },
    );
    const { result } = renderHook(() => useTicketList('open'));
    expect(result.current.tickets).toHaveLength(1);
    expect(result.current.tickets[0]?.id).toBe('t1');
  });

  it('sets error message when subscription fires onError', () => {
    mockSubscribeToTickets.mockImplementation(
      (_user: unknown, _onData: unknown, onError: () => void) => {
        onError();
        return jest.fn();
      },
    );
    const { result } = renderHook(() => useTicketList());
    expect(result.current.error).toBeTruthy();
    expect(result.current.loading).toBe(false);
  });

  it('clearError resets error to null', () => {
    mockSubscribeToTickets.mockImplementation(
      (_user: unknown, _onData: unknown, onError: () => void) => {
        onError();
        return jest.fn();
      },
    );
    const { result } = renderHook(() => useTicketList());
    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });

  it('calls the unsubscribe function on unmount', () => {
    const unsubscribe = jest.fn();
    mockSubscribeToTickets.mockReturnValue(unsubscribe);
    const { unmount } = renderHook(() => useTicketList());
    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
