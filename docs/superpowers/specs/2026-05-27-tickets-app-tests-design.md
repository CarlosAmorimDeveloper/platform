# tickets-app Test Suite Design

## Context

The `tickets-app` has 21 co-located test files, all with `it.todo` placeholders. This spec covers the first 9 files: pure logic, store/component, and hooks — roughly 60% of the app's real logic by code path.

Services (Firebase/Firestore) and screens are excluded from this spec and will be addressed in a separate cycle once firebase mocking patterns are established.

---

## Scope

| File                                              | Group      | Mocking                                 |
| ------------------------------------------------- | ---------- | --------------------------------------- |
| `constants/ticketStatus/ticketStatus.test.ts`     | Pure logic | None                                    |
| `constants/ticketPriority/ticketPriority.test.ts` | Pure logic | None                                    |
| `utils/firebaseErrors/firebaseErrors.test.ts`     | Pure logic | `FirebaseError` constructor             |
| `domain/ticket/ticket.test.ts`                    | Pure logic | `QueryDocumentSnapshot`, `Timestamp`    |
| `domain/user/user.test.ts`                        | Pure logic | None                                    |
| `store/useAuthStore/useAuthStore.test.ts`         | Store      | `firebase/auth`, `../services/firebase` |
| `components/TicketCard/TicketCard.test.tsx`       | Component  | Providers via test-utils                |
| `hooks/useTicketList/useTicketList.test.ts`       | Hook       | `ticketService`, `useAuthStore`         |
| `hooks/useTicketDetails/useTicketDetails.test.ts` | Hook       | `ticketService` (6 fns), `useAuthStore` |

---

## Conventions (apply to all files)

- `jest.mock()` calls at module top, before imports
- `beforeEach(() => jest.clearAllMocks())` in every describe block
- No snapshot tests — behavioral assertions only
- No testing of TypeScript types at runtime (unless there is actual runtime logic)
- Each `it` tests one thing only (no compound assertions that would be better as two tests)

---

## Group 1 — Pure Logic

### `ticketStatus.test.ts`

Source: `ALL_STATUSES`, `STATUS_LABELS`, `STATUS_COLORS` (all exported from `ticketStatus.ts`)

```ts
import { ALL_STATUSES, STATUS_LABELS, STATUS_COLORS } from './ticketStatus';
import type { TicketStatus } from './ticketStatus';

describe('ticketStatus', () => {
  it('ALL_STATUSES contains exactly open, in_progress and done', () => {
    expect(ALL_STATUSES).toEqual(['open', 'in_progress', 'done']);
  });

  it('STATUS_LABELS has a label for every status', () => {
    ALL_STATUSES.forEach((status) => {
      expect(STATUS_LABELS[status]).toBeTruthy();
    });
  });

  it('STATUS_COLORS has a color for every status', () => {
    ALL_STATUSES.forEach((status) => {
      expect(STATUS_COLORS[status]).toBeTruthy();
    });
  });

  it('STATUS_LABELS values are non-empty strings', () => {
    Object.values(STATUS_LABELS).forEach((label) => {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it('STATUS_COLORS values are non-empty strings', () => {
    Object.values(STATUS_COLORS).forEach((color) => {
      expect(typeof color).toBe('string');
      expect(color.length).toBeGreaterThan(0);
    });
  });
});
```

### `ticketPriority.test.ts`

Source: `ALL_PRIORITIES`, `PRIORITY_LABELS`, `PRIORITY_COLORS`

```ts
import { ALL_PRIORITIES, PRIORITY_LABELS, PRIORITY_COLORS } from './ticketPriority';

describe('ticketPriority', () => {
  it('ALL_PRIORITIES contains all 5 priority levels in order', () => {
    expect(ALL_PRIORITIES).toEqual(['very_low', 'low', 'medium', 'high', 'very_high']);
  });

  it('PRIORITY_LABELS has a label for every priority', () => {
    ALL_PRIORITIES.forEach((priority) => {
      expect(PRIORITY_LABELS[priority]).toBeTruthy();
    });
  });

  it('PRIORITY_COLORS has a color for every priority', () => {
    ALL_PRIORITIES.forEach((priority) => {
      expect(PRIORITY_COLORS[priority]).toBeTruthy();
    });
  });

  it('PRIORITY_LABELS values are non-empty strings', () => {
    Object.values(PRIORITY_LABELS).forEach((label) => {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it('PRIORITY_COLORS values are non-empty strings', () => {
    Object.values(PRIORITY_COLORS).forEach((color) => {
      expect(typeof color).toBe('string');
      expect(color.length).toBeGreaterThan(0);
    });
  });
});
```

### `firebaseErrors.test.ts`

Source: `mapFirebaseAuthError(err: unknown): string`

The function takes an unknown error. If it's a `FirebaseError` (from `firebase/app`), it switches on `.code` to return a Portuguese message. Otherwise returns a generic Portuguese message.

```ts
import { FirebaseError } from 'firebase/app';
import { mapFirebaseAuthError } from './firebaseErrors';

describe('mapFirebaseAuthError', () => {
  it('maps auth/invalid-credential to login error message', () => {
    const err = new FirebaseError('auth/invalid-credential', '');
    expect(mapFirebaseAuthError(err)).toBe('E-mail ou senha incorretos.');
  });

  it('maps auth/wrong-password to login error message', () => {
    const err = new FirebaseError('auth/wrong-password', '');
    expect(mapFirebaseAuthError(err)).toBe('E-mail ou senha incorretos.');
  });

  it('maps auth/user-not-found to login error message', () => {
    const err = new FirebaseError('auth/user-not-found', '');
    expect(mapFirebaseAuthError(err)).toBe('E-mail ou senha incorretos.');
  });

  it('maps auth/email-already-in-use to duplicate email message', () => {
    const err = new FirebaseError('auth/email-already-in-use', '');
    expect(mapFirebaseAuthError(err)).toBe('Este e-mail já está cadastrado.');
  });

  it('maps auth/weak-password to password strength message', () => {
    const err = new FirebaseError('auth/weak-password', '');
    expect(mapFirebaseAuthError(err)).toBe('A senha deve ter pelo menos 6 caracteres.');
  });

  it('maps auth/invalid-email to invalid email message', () => {
    const err = new FirebaseError('auth/invalid-email', '');
    expect(mapFirebaseAuthError(err)).toBe('E-mail inválido.');
  });

  it('maps auth/too-many-requests to rate limit message', () => {
    const err = new FirebaseError('auth/too-many-requests', '');
    expect(mapFirebaseAuthError(err)).toBe('Muitas tentativas. Tente novamente mais tarde.');
  });

  it('maps auth/network-request-failed to network error message', () => {
    const err = new FirebaseError('auth/network-request-failed', '');
    expect(mapFirebaseAuthError(err)).toBe('Sem conexão. Verifique sua internet.');
  });

  it('maps unknown firebase error code to generic retry message', () => {
    const err = new FirebaseError('auth/unknown-code', '');
    expect(mapFirebaseAuthError(err)).toBe('Ocorreu um erro. Tente novamente.');
  });

  it('maps non-firebase Error to unexpected error message', () => {
    expect(mapFirebaseAuthError(new Error('plain error'))).toBe('Ocorreu um erro inesperado.');
  });

  it('maps null to unexpected error message', () => {
    expect(mapFirebaseAuthError(null)).toBe('Ocorreu um erro inesperado.');
  });
});
```

**Note:** `FirebaseError` can be constructed directly — `new FirebaseError(code, message)`.

### `ticket.test.ts`

Source:

- `toTicket(doc: QueryDocumentSnapshot): Ticket` — maps Firestore doc to domain object with defaults
- `formatDate(ts: Timestamp | null): string` — formats to `pt-BR` locale or returns `''`

**Mock helpers:**

```ts
// Create a mock QueryDocumentSnapshot
function makeDoc(id: string, data: Record<string, unknown>) {
  return { id, data: () => data } as any;
}

// Create a mock Timestamp
function makeTimestamp(date: Date) {
  return { toDate: () => date } as any;
}
```

```ts
import { toTicket, formatDate } from './ticket';

// makeDoc and makeTimestamp helpers defined here

describe('toTicket', () => {
  it('maps all fields from Firestore document', () => {
    const doc = makeDoc('ticket-1', {
      title: 'Bug report',
      description: 'Something broke',
      status: 'in_progress',
      priority: 'high',
      creator_id: 'user-1',
      creator_name: 'Alice',
      createdAt: makeTimestamp(new Date()),
    });
    const ticket = toTicket(doc);
    expect(ticket.id).toBe('ticket-1');
    expect(ticket.title).toBe('Bug report');
    expect(ticket.description).toBe('Something broke');
    expect(ticket.status).toBe('in_progress');
    expect(ticket.priority).toBe('high');
    expect(ticket.creatorId).toBe('user-1');
    expect(ticket.creatorName).toBe('Alice');
  });

  it('uses empty string defaults for missing string fields', () => {
    const doc = makeDoc('ticket-2', {});
    const ticket = toTicket(doc);
    expect(ticket.title).toBe('');
    expect(ticket.description).toBe('');
    expect(ticket.creatorId).toBe('');
    expect(ticket.creatorName).toBe('');
  });

  it('defaults status to open when missing', () => {
    const doc = makeDoc('ticket-3', {});
    expect(toTicket(doc).status).toBe('open');
  });

  it('defaults priority to medium when missing', () => {
    const doc = makeDoc('ticket-4', {});
    expect(toTicket(doc).priority).toBe('medium');
  });

  it('defaults createdAt to null when missing', () => {
    const doc = makeDoc('ticket-5', {});
    expect(toTicket(doc).createdAt).toBeNull();
  });
});

describe('formatDate', () => {
  it('formats a Timestamp to pt-BR locale string', () => {
    const date = new Date(2024, 0, 15, 14, 30); // 15/01/2024 14:30
    const result = formatDate(makeTimestamp(date));
    expect(result).toContain('15');
    expect(result).toContain('01');
    expect(result).toContain('2024');
  });

  it('returns empty string for null timestamp', () => {
    expect(formatDate(null)).toBe('');
  });
});
```

### `user.test.ts`

Source: `UserRole` type alias, `User` interface — no runtime logic.

```ts
import type { User, UserRole } from './user';

describe('User domain', () => {
  it('accepts a valid User object', () => {
    const user: User = { uid: 'u1', email: 'a@b.com', name: 'Alice', role: 'admin' };
    expect(user.uid).toBe('u1');
    expect(user.email).toBe('a@b.com');
    expect(user.name).toBe('Alice');
    expect(user.role).toBe('admin');
  });

  it('accepts both valid UserRole values', () => {
    const admin: UserRole = 'admin';
    const standard: UserRole = 'standard';
    expect(admin).toBe('admin');
    expect(standard).toBe('standard');
  });
});
```

---

## Group 2 — Store + Component

### `useAuthStore.test.ts`

Source: Zustand store. State: `user`, `isAuthenticated`. Actions: `setUser`, `logout` (calls Firebase `signOut`).

Mocking pattern:

```ts
jest.mock('firebase/auth', () => ({ signOut: jest.fn().mockResolvedValue(undefined) }));
jest.mock('../../services/firebase', () => ({ auth: {} }));
```

Reset store between tests via `useAuthStore.setState(initialState)`.

```ts
import { signOut } from 'firebase/auth';
import { useAuthStore } from './useAuthStore';

jest.mock('firebase/auth', () => ({ signOut: jest.fn().mockResolvedValue(undefined) }));
jest.mock('../../services/firebase', () => ({ auth: {} }));

const initialState = { user: null, isAuthenticated: false };

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState(initialState);
    jest.clearAllMocks();
  });

  it('has null user and isAuthenticated false by default', () => {
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });

  it('setUser stores the user and sets isAuthenticated to true', () => {
    const user = { uid: 'u1', email: 'a@b.com', name: 'Alice', role: 'admin' as const };
    useAuthStore.getState().setUser(user);
    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('setUser(null) clears user and sets isAuthenticated to false', () => {
    useAuthStore.setState({
      user: { uid: 'u1', email: 'a@b.com', name: 'Alice', role: 'admin' },
      isAuthenticated: true,
    });
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('logout calls firebase signOut', async () => {
    await useAuthStore.getState().logout();
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
```

### `TicketCard.test.tsx`

Source: renders a Card with priority badge (label + color) and meta text (creator + formatted date). `onPress` passed to Card.

Use `render` from `../../test-utils` (not from `@testing-library/react-native` directly) so PaperProvider and SafeAreaProvider wrap the component.

```tsx
import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { TicketCard } from './TicketCard';
import type { Timestamp } from 'firebase/firestore';

function makeTimestamp(date: Date): Timestamp {
  return { toDate: () => date } as unknown as Timestamp;
}

const baseProps = {
  title: 'Fix login bug',
  status: 'open' as const,
  priority: 'high' as const,
  creatorName: 'Alice',
  createdAt: makeTimestamp(new Date(2024, 0, 15, 14, 30)),
  onPress: jest.fn(),
};

describe('TicketCard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the ticket title', () => {
    render(<TicketCard {...baseProps} />);
    expect(screen.getByText('Fix login bug')).toBeTruthy();
  });

  it('renders the priority label', () => {
    render(<TicketCard {...baseProps} />);
    expect(screen.getByText('Alto')).toBeTruthy(); // PRIORITY_LABELS['high']
  });

  it('renders the creator name in meta text', () => {
    render(<TicketCard {...baseProps} />);
    expect(screen.getByText(/Alice/)).toBeTruthy();
  });

  it('calls onPress when the card is pressed', () => {
    render(<TicketCard {...baseProps} />);
    fireEvent.press(screen.getByText('Fix login bug'));
    expect(baseProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('renders without error when createdAt is null', () => {
    render(<TicketCard {...baseProps} createdAt={null} />);
    expect(screen.getByText(/Alice/)).toBeTruthy();
  });
});
```

**Note on the Card component:** `TicketCard` wraps `Card` from `@ds/mobile`. The press event fires on the Card's Pressable. The title text is inside the Pressable, so `fireEvent.press(screen.getByText('Fix login bug'))` should trigger `onPress`. If it doesn't, try pressing the priority badge text instead (`screen.getByText('Alto')`).

---

## Group 3 — Hooks

### `useTicketList.test.ts`

Source: Hook that calls `subscribeToTickets(user, onData, onError)` and manages `tickets`, `loading`, `error` state. Optionally filters by `statusFilter`.

**Mock setup:**

```ts
jest.mock('../../store/useAuthStore', () => ({
  useAuthStore: jest.fn((selector: (s: { user: User | null }) => unknown) =>
    selector({ user: { uid: 'u1', email: 'a@b.com', name: 'Alice', role: 'admin' } }),
  ),
}));
jest.mock('../../services/ticketService', () => ({
  subscribeToTickets: jest.fn(),
}));
```

**Helper pattern:** Capture the `onData` callback from `subscribeToTickets` to simulate incoming data:

```ts
import { subscribeToTickets } from '../../services/ticketService';
const mockSubscribe = subscribeToTickets as jest.Mock;
// In each test:
mockSubscribe.mockImplementation((_user, onData, _onError) => {
  onData(mockTickets);
  return jest.fn(); // unsubscribe
});
```

```ts
import { renderHook, act } from '@testing-library/react-native';
import { useTicketList } from './useTicketList';
import { subscribeToTickets } from '../../services/ticketService';
import type { Ticket } from '../../domain/ticket';

// jest.mock calls (as described above)

const mockSubscribe = subscribeToTickets as jest.Mock;

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
  beforeEach(() => jest.clearAllMocks());

  it('returns empty tickets array and loading true initially', () => {
    mockSubscribe.mockReturnValue(jest.fn()); // subscription returns unsubscribe fn, never calls onData
    const { result } = renderHook(() => useTicketList());
    expect(result.current.tickets).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('populates tickets when subscription fires onData', () => {
    mockSubscribe.mockImplementation((_user, onData) => {
      onData(mockTickets);
      return jest.fn();
    });
    const { result } = renderHook(() => useTicketList());
    expect(result.current.tickets).toHaveLength(2);
    expect(result.current.loading).toBe(false);
  });

  it('filters tickets by status when statusFilter is provided', () => {
    mockSubscribe.mockImplementation((_user, onData) => {
      onData(mockTickets);
      return jest.fn();
    });
    const { result } = renderHook(() => useTicketList('open'));
    expect(result.current.tickets).toHaveLength(1);
    expect(result.current.tickets[0].id).toBe('t1');
  });

  it('sets error message when subscription fires onError', () => {
    mockSubscribe.mockImplementation((_user, _onData, onError) => {
      onError();
      return jest.fn();
    });
    const { result } = renderHook(() => useTicketList());
    expect(result.current.error).toBeTruthy();
    expect(result.current.loading).toBe(false);
  });

  it('clearError resets error to null', () => {
    mockSubscribe.mockImplementation((_user, _onData, onError) => {
      onError();
      return jest.fn();
    });
    const { result } = renderHook(() => useTicketList());
    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });

  it('calls the unsubscribe function on unmount', () => {
    const unsubscribe = jest.fn();
    mockSubscribe.mockReturnValue(unsubscribe);
    const { unmount } = renderHook(() => useTicketList());
    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
```

### `useTicketDetails.test.ts`

Source: Hook with two subscriptions (`subscribeToTicket`, `subscribeToComments`) and four async mutations (`updateTicket`, `deleteTicket`, `addComment`, `deleteComment`). All mutations catch errors and set `error` state.

**Mock setup:**

```ts
jest.mock('../../store/useAuthStore', () => ({
  useAuthStore: jest.fn((selector) => selector({ user: mockUser })),
}));
jest.mock('../../services/ticketService', () => ({
  subscribeToTicket: jest.fn(),
  subscribeToComments: jest.fn(),
  updateTicket: jest.fn(),
  deleteTicket: jest.fn(),
  addComment: jest.fn(),
  deleteComment: jest.fn(),
}));
```

```ts
import { renderHook, act } from '@testing-library/react-native';
import { useTicketDetails } from './useTicketDetails';
import {
  subscribeToTicket,
  subscribeToComments,
  updateTicket,
  deleteTicket,
  addComment,
  deleteComment,
} from '../../services/ticketService';
import type { Ticket, Comment } from '../../domain/ticket';

// jest.mock calls

const mockUser = { uid: 'u1', email: 'a@b.com', name: 'Alice', role: 'admin' as const };
const mockSubscribeToTicket = subscribeToTicket as jest.Mock;
const mockSubscribeToComments = subscribeToComments as jest.Mock;
const mockUpdateTicket = updateTicket as jest.Mock;
const mockDeleteTicket = deleteTicket as jest.Mock;
const mockAddComment = addComment as jest.Mock;
const mockDeleteComment = deleteComment as jest.Mock;

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
    mockSubscribeToTicket.mockReturnValue(jest.fn());
    mockSubscribeToComments.mockReturnValue(jest.fn());
  });

  it('returns null ticket and loading true initially', () => {
    const { result } = renderHook(() => useTicketDetails('t1'));
    expect(result.current.ticket).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('populates ticket when subscribeToTicket fires', () => {
    mockSubscribeToTicket.mockImplementation((_id, onData) => {
      onData(mockTicket);
      return jest.fn();
    });
    const { result } = renderHook(() => useTicketDetails('t1'));
    expect(result.current.ticket).toEqual(mockTicket);
    expect(result.current.loading).toBe(false);
  });

  it('populates comments when subscribeToComments fires', () => {
    mockSubscribeToComments.mockImplementation((_id, onData) => {
      onData([mockComment]);
      return jest.fn();
    });
    const { result } = renderHook(() => useTicketDetails('t1'));
    expect(result.current.comments).toHaveLength(1);
    expect(result.current.comments[0].id).toBe('c1');
  });

  it('updateTicket calls the service with correct args', async () => {
    mockUpdateTicket.mockResolvedValue(undefined);
    const { result } = renderHook(() => useTicketDetails('t1'));
    await act(() => result.current.updateTicket('done', 'low'));
    expect(mockUpdateTicket).toHaveBeenCalledWith('t1', { status: 'done', priority: 'low' });
  });

  it('deleteTicket calls the service', async () => {
    mockDeleteTicket.mockResolvedValue(undefined);
    const { result } = renderHook(() => useTicketDetails('t1'));
    await act(() => result.current.deleteTicket());
    expect(mockDeleteTicket).toHaveBeenCalledWith('t1');
  });

  it('addComment calls the service with text and user', async () => {
    mockAddComment.mockResolvedValue(undefined);
    const { result } = renderHook(() => useTicketDetails('t1'));
    await act(() => result.current.addComment('Hello'));
    expect(mockAddComment).toHaveBeenCalledWith('t1', 'Hello', mockUser);
  });

  it('deleteComment calls the service with commentId', async () => {
    mockDeleteComment.mockResolvedValue(undefined);
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

  it('clearError resets error to null', async () => {
    mockUpdateTicket.mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useTicketDetails('t1'));
    await act(() => result.current.updateTicket('done', 'low'));
    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });
});
```

---

## Known Gotchas

1. **Zustand store reset:** `useAuthStore.setState(initialState)` works only if the store module is NOT mocked. In hooks tests, `useAuthStore` IS mocked (to control the return value), so state reset is not needed there.

2. **TicketCard `onPress`:** The Card from `@ds/mobile` wraps children in a Pressable. Pressing any visible text inside the card should trigger the press event. If `fireEvent.press(screen.getByText('Fix login bug'))` doesn't work, use `fireEvent.press(screen.getByText('Alto'))` (the priority badge) or add a `testID` to TicketCard and query by that.

3. **`act()` with async hooks:** Wrap async operations in `act(async () => { ... })` when the operation is async (mutations). For sync state updates via subscription callbacks, plain `act(() => {})` is sufficient.

4. **`renderHook` import:** In `@testing-library/react-native` v12, `renderHook` is exported from the same package.

---

## Verification

After implementing each group:

```bash
yarn workspace @app/tickets test
```

Expected at end of all 9 files:

- At least 40 tests passing (0 todo, 0 failures)
- No snapshot files created
