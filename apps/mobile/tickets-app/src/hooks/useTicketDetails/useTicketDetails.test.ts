import { act, renderHook } from '@testing-library/react-native';
import {
  addComment,
  deleteComment,
  deleteTicket,
  subscribeToComments,
  subscribeToTicket,
  updateTicket,
} from '../../services/ticketService';
import { useAuthStore } from '../../store/useAuthStore';
import type { Comment, Ticket } from '../../domain/ticket';
import { useTicketDetails } from './useTicketDetails';

jest.mock('../../store/useAuthStore');
jest.mock('../../services/ticketService');
jest.mock('../../services/firebase', () => ({ auth: {}, db: {} }));

const mockUseAuthStore = useAuthStore as unknown as jest.Mock;
const mockSubscribeToTicket = subscribeToTicket as jest.Mock;
const mockSubscribeToComments = subscribeToComments as jest.Mock;
const mockUpdateTicket = updateTicket as jest.Mock;
const mockDeleteTicket = deleteTicket as jest.Mock;
const mockAddComment = addComment as jest.Mock;
const mockDeleteComment = deleteComment as jest.Mock;

const mockUser = { uid: 'u1', email: 'alice@test.com', name: 'Alice', role: 'admin' as const };

const mockTicket: Ticket = {
  id: 't1',
  title: 'Bug',
  description: 'desc',
  status: 'open',
  priority: 'high',
  creatorId: 'u1',
  creatorName: 'Alice',
  createdAt: null,
};

const mockComment: Comment = {
  id: 'c1',
  text: 'test comment',
  authorId: 'u1',
  authorName: 'Alice',
  createdAt: null,
};

describe('useTicketDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockImplementation((selector: (s: { user: typeof mockUser }) => unknown) =>
      selector({ user: mockUser }),
    );
    mockSubscribeToTicket.mockReturnValue(jest.fn());
    mockSubscribeToComments.mockReturnValue(jest.fn());
    mockUpdateTicket.mockResolvedValue(undefined);
    mockDeleteTicket.mockResolvedValue(undefined);
    mockAddComment.mockResolvedValue(undefined);
    mockDeleteComment.mockResolvedValue(undefined);
  });

  it('returns null ticket and loading true initially', () => {
    const { result } = renderHook(() => useTicketDetails('t1'));
    expect(result.current.ticket).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('populates ticket when subscribeToTicket fires', () => {
    mockSubscribeToTicket.mockImplementation((_id: string, onData: (t: Ticket) => void) => {
      onData(mockTicket);
      return jest.fn();
    });
    const { result } = renderHook(() => useTicketDetails('t1'));
    expect(result.current.ticket).toEqual(mockTicket);
    expect(result.current.loading).toBe(false);
  });

  it('populates comments when subscribeToComments fires', () => {
    mockSubscribeToComments.mockImplementation((_id: string, onData: (c: Comment[]) => void) => {
      onData([mockComment]);
      return jest.fn();
    });
    const { result } = renderHook(() => useTicketDetails('t1'));
    expect(result.current.comments).toHaveLength(1);
    expect(result.current.comments[0]?.id).toBe('c1');
  });

  it('updateTicket calls the service with correct args', async () => {
    const { result } = renderHook(() => useTicketDetails('t1'));
    await act(() => result.current.updateTicket('done', 'low'));
    expect(mockUpdateTicket).toHaveBeenCalledWith('t1', { status: 'done', priority: 'low' });
  });

  it('deleteTicket calls the service with the ticket id', async () => {
    const { result } = renderHook(() => useTicketDetails('t1'));
    await act(() => result.current.deleteTicket());
    expect(mockDeleteTicket).toHaveBeenCalledWith('t1');
  });

  it('addComment calls the service with text and current user', async () => {
    const { result } = renderHook(() => useTicketDetails('t1'));
    await act(() => result.current.addComment('Hello'));
    expect(mockAddComment).toHaveBeenCalledWith('t1', 'Hello', mockUser);
  });

  it('deleteComment calls the service with the comment id', async () => {
    const { result } = renderHook(() => useTicketDetails('t1'));
    await act(() => result.current.deleteComment('c1'));
    expect(mockDeleteComment).toHaveBeenCalledWith('t1', 'c1');
  });

  it('sets error when updateTicket rejects', async () => {
    mockUpdateTicket.mockRejectedValue(new Error('network error'));
    const { result } = renderHook(() => useTicketDetails('t1'));
    await act(() => result.current.updateTicket('done', 'low'));
    expect(result.current.error).toBeTruthy();
  });

  it('clearError resets error to null after a failed mutation', async () => {
    mockUpdateTicket.mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useTicketDetails('t1'));
    await act(() => result.current.updateTicket('done', 'low'));
    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });
});
