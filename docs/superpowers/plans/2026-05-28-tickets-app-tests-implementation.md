# tickets-app Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all `it.todo` stubs in 9 test files with real passing tests covering constants, utils, domain, store, component, and hooks.

**Architecture:** Each task replaces the existing stub file with a complete test file. The production code already exists — no source changes needed. Tests use `jest.mock()` (auto-hoisted) without variable references in factories; `mockImplementation` is set in `beforeEach` to avoid the jest hoist/closure trap.

**Tech Stack:** Jest 30, `@testing-library/react-native` v12, `renderHook` + `act` for hooks, `firebase/app` `FirebaseError` constructor for error tests, Zustand `getState()` for store tests.

---

## File Map

All files are **Modify** (replace stub content):

| Task | File                                                                          |
| ---- | ----------------------------------------------------------------------------- |
| 1    | `apps/mobile/tickets-app/src/constants/ticketStatus/ticketStatus.test.ts`     |
| 1    | `apps/mobile/tickets-app/src/constants/ticketPriority/ticketPriority.test.ts` |
| 2    | `apps/mobile/tickets-app/src/utils/firebaseErrors/firebaseErrors.test.ts`     |
| 3    | `apps/mobile/tickets-app/src/domain/ticket/ticket.test.ts`                    |
| 3    | `apps/mobile/tickets-app/src/domain/user/user.test.ts`                        |
| 4    | `apps/mobile/tickets-app/src/store/useAuthStore/useAuthStore.test.ts`         |
| 5    | `apps/mobile/tickets-app/src/components/TicketCard/TicketCard.test.tsx`       |
| 6    | `apps/mobile/tickets-app/src/hooks/useTicketList/useTicketList.test.ts`       |
| 7    | `apps/mobile/tickets-app/src/hooks/useTicketDetails/useTicketDetails.test.ts` |

---

## Task 1: Constants — ticketStatus + ticketPriority

**Files:**

- Modify: `apps/mobile/tickets-app/src/constants/ticketStatus/ticketStatus.test.ts`
- Modify: `apps/mobile/tickets-app/src/constants/ticketPriority/ticketPriority.test.ts`

- [ ] **Step 1: Replace ticketStatus.test.ts**

```ts
import { ALL_STATUSES, STATUS_COLORS, STATUS_LABELS } from './ticketStatus';

describe('ticketStatus', () => {
  beforeEach(() => jest.clearAllMocks());

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

- [ ] **Step 2: Replace ticketPriority.test.ts**

```ts
import { ALL_PRIORITIES, PRIORITY_COLORS, PRIORITY_LABELS } from './ticketPriority';

describe('ticketPriority', () => {
  beforeEach(() => jest.clearAllMocks());

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

- [ ] **Step 3: Run and verify**

```bash
yarn workspace @app/tickets test --testPathPattern="ticketStatus|ticketPriority" --verbose 2>&1 | tail -20
```

Expected: 2 suites, 10 tests, 0 failures, 0 todo.

- [ ] **Step 4: Commit**

```bash
git -C /Users/kadu/Documents/GitHub/platform add \
  apps/mobile/tickets-app/src/constants/ticketStatus/ticketStatus.test.ts \
  apps/mobile/tickets-app/src/constants/ticketPriority/ticketPriority.test.ts
git -C /Users/kadu/Documents/GitHub/platform commit -m "test(tickets-app): testes das constantes de status e prioridade"
```

---

## Task 2: Utils — firebaseErrors

**Files:**

- Modify: `apps/mobile/tickets-app/src/utils/firebaseErrors/firebaseErrors.test.ts`

- [ ] **Step 1: Replace firebaseErrors.test.ts**

```ts
import { FirebaseError } from 'firebase/app';
import { mapFirebaseAuthError } from './firebaseErrors';

describe('mapFirebaseAuthError', () => {
  beforeEach(() => jest.clearAllMocks());

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

- [ ] **Step 2: Run and verify**

```bash
yarn workspace @app/tickets test --testPathPattern="firebaseErrors" --verbose 2>&1 | tail -20
```

Expected: 1 suite, 11 tests, 0 failures, 0 todo.

- [ ] **Step 3: Commit**

```bash
git -C /Users/kadu/Documents/GitHub/platform add apps/mobile/tickets-app/src/utils/firebaseErrors/firebaseErrors.test.ts
git -C /Users/kadu/Documents/GitHub/platform commit -m "test(tickets-app): testes do mapFirebaseAuthError"
```

---

## Task 3: Domain — ticket + user

**Files:**

- Modify: `apps/mobile/tickets-app/src/domain/ticket/ticket.test.ts`
- Modify: `apps/mobile/tickets-app/src/domain/user/user.test.ts`

- [ ] **Step 1: Replace ticket.test.ts**

```ts
import { formatDate, toTicket } from './ticket';
import type { Ticket } from './ticket';

function makeDoc(id: string, data: Record<string, unknown>) {
  return { id, data: () => data } as Parameters<typeof toTicket>[0];
}

function makeTimestamp(date: Date) {
  return { toDate: () => date } as unknown as import('firebase/firestore').Timestamp;
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
```

- [ ] **Step 2: Replace user.test.ts**

```ts
import type { User, UserRole } from './user';

describe('User domain', () => {
  it('accepts a valid User object at runtime', () => {
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

- [ ] **Step 3: Run and verify**

```bash
yarn workspace @app/tickets test --testPathPattern="domain/(ticket|user)" --verbose 2>&1 | tail -20
```

Expected: 2 suites, 9 tests, 0 failures, 0 todo.

- [ ] **Step 4: Commit**

```bash
git -C /Users/kadu/Documents/GitHub/platform add \
  apps/mobile/tickets-app/src/domain/ticket/ticket.test.ts \
  apps/mobile/tickets-app/src/domain/user/user.test.ts
git -C /Users/kadu/Documents/GitHub/platform commit -m "test(tickets-app): testes do domínio ticket e user"
```

---

## Task 4: Store — useAuthStore

**Files:**

- Modify: `apps/mobile/tickets-app/src/store/useAuthStore/useAuthStore.test.ts`

**Mocking strategy:** `jest.mock('firebase/auth')` mocks `signOut` as a `jest.fn()`. The store is NOT mocked — we call `useAuthStore.getState()` directly. `useAuthStore.setState(initialState)` resets between tests.

- [ ] **Step 1: Replace useAuthStore.test.ts**

```ts
import { signOut } from 'firebase/auth';
import { useAuthStore } from './useAuthStore';
import type { User } from '../../domain/user';

jest.mock('firebase/auth', () => ({ signOut: jest.fn().mockResolvedValue(undefined) }));
jest.mock('../../services/firebase', () => ({ auth: {} }));

const mockSignOut = signOut as jest.Mock;

const initialState = { user: null as User | null, isAuthenticated: false };

const mockUser: User = { uid: 'u1', email: 'alice@test.com', name: 'Alice', role: 'admin' };

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
    useAuthStore.getState().setUser(mockUser);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('setUser(null) clears user and sets isAuthenticated to false', () => {
    useAuthStore.setState({ user: mockUser, isAuthenticated: true });
    useAuthStore.getState().setUser(null);
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('logout calls firebase signOut', async () => {
    await useAuthStore.getState().logout();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run and verify**

```bash
yarn workspace @app/tickets test --testPathPattern="useAuthStore" --verbose 2>&1 | tail -20
```

Expected: 1 suite, 4 tests, 0 failures.

- [ ] **Step 3: Commit**

```bash
git -C /Users/kadu/Documents/GitHub/platform add apps/mobile/tickets-app/src/store/useAuthStore/useAuthStore.test.ts
git -C /Users/kadu/Documents/GitHub/platform commit -m "test(tickets-app): testes do useAuthStore"
```

---

## Task 5: Component — TicketCard

**Files:**

- Modify: `apps/mobile/tickets-app/src/components/TicketCard/TicketCard.test.tsx`

**Mocking strategy:** Use `render` from `../../test-utils` (not from `@testing-library/react-native`) so PaperProvider + SafeAreaProvider + NavigationContainer wrap the component. Timestamp is mocked as a plain object with `.toDate()`.

- [ ] **Step 1: Replace TicketCard.test.tsx**

```tsx
import React from 'react';
import type { Timestamp } from 'firebase/firestore';
import { fireEvent, render, screen } from '../../test-utils';
import { TicketCard } from './TicketCard';

function makeTimestamp(date: Date): Timestamp {
  return { toDate: () => date } as unknown as Timestamp;
}

const onPress = jest.fn();

const baseProps = {
  title: 'Fix login bug',
  status: 'open' as const,
  priority: 'high' as const,
  creatorName: 'Alice',
  createdAt: makeTimestamp(new Date(2024, 0, 15, 14, 30)),
  onPress,
};

describe('TicketCard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the ticket title', () => {
    render(<TicketCard {...baseProps} />);
    expect(screen.getByText('Fix login bug')).toBeTruthy();
  });

  it('renders the priority label', () => {
    render(<TicketCard {...baseProps} />);
    expect(screen.getByText('Alto')).toBeTruthy();
  });

  it('renders the creator name in meta text', () => {
    render(<TicketCard {...baseProps} />);
    expect(screen.getByText(/Alice/)).toBeTruthy();
  });

  it('calls onPress when the card is pressed', () => {
    render(<TicketCard {...baseProps} />);
    fireEvent.press(screen.getByText('Fix login bug'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders without error when createdAt is null', () => {
    render(<TicketCard {...baseProps} createdAt={null} />);
    expect(screen.getByText(/Alice/)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run and verify**

```bash
yarn workspace @app/tickets test --testPathPattern="TicketCard" --verbose 2>&1 | tail -25
```

Expected: 1 suite, 5 tests, 0 failures.

If the `onPress` test fails because `fireEvent.press` on text doesn't bubble to the Card's Pressable, change the press target to the priority badge: `fireEvent.press(screen.getByText('Alto'))`.

- [ ] **Step 3: Commit**

```bash
git -C /Users/kadu/Documents/GitHub/platform add apps/mobile/tickets-app/src/components/TicketCard/TicketCard.test.tsx
git -C /Users/kadu/Documents/GitHub/platform commit -m "test(tickets-app): testes do TicketCard"
```

---

## Task 6: Hook — useTicketList

**Files:**

- Modify: `apps/mobile/tickets-app/src/hooks/useTicketList/useTicketList.test.ts`

**Mocking strategy:** `jest.mock()` without factory (auto-mocks all exports as `jest.fn()`). `mockImplementation` is set in `beforeEach` or per-test. This avoids the hoisting/closure bug where factories run before `const` variables are initialized.

- [ ] **Step 1: Replace useTicketList.test.ts**

```ts
import { act, renderHook } from '@testing-library/react-native';
import { subscribeToTickets } from '../../services/ticketService';
import { useAuthStore } from '../../store/useAuthStore';
import type { Ticket } from '../../domain/ticket';
import { useTicketList } from './useTicketList';

jest.mock('../../store/useAuthStore');
jest.mock('../../services/ticketService');

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
```

- [ ] **Step 2: Run and verify**

```bash
yarn workspace @app/tickets test --testPathPattern="useTicketList" --verbose 2>&1 | tail -25
```

Expected: 1 suite, 6 tests, 0 failures.

- [ ] **Step 3: Commit**

```bash
git -C /Users/kadu/Documents/GitHub/platform add apps/mobile/tickets-app/src/hooks/useTicketList/useTicketList.test.ts
git -C /Users/kadu/Documents/GitHub/platform commit -m "test(tickets-app): testes do useTicketList"
```

---

## Task 7: Hook — useTicketDetails

**Files:**

- Modify: `apps/mobile/tickets-app/src/hooks/useTicketDetails/useTicketDetails.test.ts`

**Mocking strategy:** Same pattern as Task 6. All 6 service functions auto-mocked. `useAuthStore` mocked to return `mockUser` via selector.

- [ ] **Step 1: Replace useTicketDetails.test.ts**

```ts
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

const mockUseAuthStore = useAuthStore as jest.Mock;
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
```

- [ ] **Step 2: Run and verify**

```bash
yarn workspace @app/tickets test --testPathPattern="useTicketDetails" --verbose 2>&1 | tail -25
```

Expected: 1 suite, 9 tests, 0 failures.

- [ ] **Step 3: Run full suite to confirm nothing regressed**

```bash
yarn workspace @app/tickets test 2>&1 | tail -10
```

Expected: 21 suites, ≥45 passing, ≤50 todo (remaining screen/navigation stubs), 0 failures.

- [ ] **Step 4: Commit**

```bash
git -C /Users/kadu/Documents/GitHub/platform add apps/mobile/tickets-app/src/hooks/useTicketDetails/useTicketDetails.test.ts
git -C /Users/kadu/Documents/GitHub/platform commit -m "test(tickets-app): testes do useTicketDetails"
```

---

## Verification Summary

| Command                                                                             | Expected                               |
| ----------------------------------------------------------------------------------- | -------------------------------------- |
| `yarn workspace @app/tickets test --testPathPattern="ticketStatus\|ticketPriority"` | 10 passing                             |
| `yarn workspace @app/tickets test --testPathPattern="firebaseErrors"`               | 11 passing                             |
| `yarn workspace @app/tickets test --testPathPattern="domain/(ticket\|user)"`        | 9 passing                              |
| `yarn workspace @app/tickets test --testPathPattern="useAuthStore"`                 | 4 passing                              |
| `yarn workspace @app/tickets test --testPathPattern="TicketCard"`                   | 5 passing                              |
| `yarn workspace @app/tickets test --testPathPattern="useTicketList"`                | 6 passing                              |
| `yarn workspace @app/tickets test --testPathPattern="useTicketDetails"`             | 9 passing                              |
| `yarn workspace @app/tickets test`                                                  | All 21 suites, ≥54 passing, 0 failures |
