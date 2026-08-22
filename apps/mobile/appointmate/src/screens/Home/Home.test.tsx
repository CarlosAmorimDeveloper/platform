import { RefreshControl } from 'react-native';
import { FirebaseError } from 'firebase/app';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fireEvent, render, screen, waitFor } from '../../test-utils';
import { useAuth } from '../../context/AuthContext';
import { listForms } from '../../services/formsService';
import type { AppStackParamList } from '../../navigation/types';
import { Home } from './Home';

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../services/formsService', () => ({
  listForms: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockedListForms = listForms as jest.Mock;

type HomeProps = NativeStackScreenProps<AppStackParamList, 'Home'>;

const mockNavigation = {
  navigate: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
} as unknown as HomeProps['navigation'];
const mockRoute = { key: 'Home', name: 'Home' } as unknown as HomeProps['route'];

const ASYNC_TIMEOUT = { timeout: 15000 };

const formA = {
  id: 'form-a',
  appointmentDate: '15/03/2026',
  overallSummary: 'Semana tranquila.',
  status: 'submitted' as const,
  createdAt: new Date(),
  updatedAt: null,
};

const formB = {
  id: 'form-b',
  appointmentDate: '',
  overallSummary: '',
  status: 'draft' as const,
  createdAt: new Date(),
  updatedAt: null,
};

describe('Home', () => {
  const logout = jest.fn();

  beforeEach(() => {
    mockedUseAuth.mockReturnValue({ user: { uid: 'user-abc', email: 'user@example.com' }, logout });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading state while forms are fetched', () => {
    mockedListForms.mockReturnValue(new Promise(() => {}));

    render(<Home navigation={mockNavigation} route={mockRoute} />);

    expect(screen.getByTestId('home-loading')).toBeTruthy();
  });

  it('shows a full-screen error when the initial load fails', async () => {
    mockedListForms.mockRejectedValue(new Error('network error'));

    render(<Home navigation={mockNavigation} route={mockRoute} />);

    await waitFor(() => {
      expect(screen.getByTestId('home-error')).toBeTruthy();
    }, ASYNC_TIMEOUT);
  }, 20000);

  it('shows a connectivity-specific message when the load fails offline', async () => {
    mockedListForms.mockRejectedValue(new FirebaseError('unavailable', ''));

    render(<Home navigation={mockNavigation} route={mockRoute} />);

    await waitFor(() => {
      expect(
        screen.getByText('Sem conexão. Verifique sua internet e tente novamente.'),
      ).toBeTruthy();
    }, ASYNC_TIMEOUT);
  }, 20000);

  it('shows an empty state when the user has no forms', async () => {
    mockedListForms.mockResolvedValue([]);

    render(<Home navigation={mockNavigation} route={mockRoute} />);

    await waitFor(() => {
      expect(screen.getByTestId('home-empty-state')).toBeTruthy();
    }, ASYNC_TIMEOUT);
  }, 20000);

  it('renders a card for each form', async () => {
    mockedListForms.mockResolvedValue([formA, formB]);

    render(<Home navigation={mockNavigation} route={mockRoute} />);

    await waitFor(() => {
      expect(screen.getByTestId('home-form-card-form-a')).toBeTruthy();
    }, ASYNC_TIMEOUT);
    expect(screen.getByTestId('home-form-card-form-b')).toBeTruthy();
    expect(screen.getByText('15/03/2026')).toBeTruthy();
    expect(screen.getByText('Sem data')).toBeTruthy();
  }, 20000);

  it('navigates to FormDetail when a card is pressed', async () => {
    mockedListForms.mockResolvedValue([formA]);

    render(<Home navigation={mockNavigation} route={mockRoute} />);

    await waitFor(() => {
      expect(screen.getByTestId('home-form-card-form-a')).toBeTruthy();
    }, ASYNC_TIMEOUT);

    fireEvent.press(screen.getByTestId('home-form-card-form-a'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('FormDetail', { formId: 'form-a' });
  }, 20000);

  it('navigates to FormEntry when "Novo formulário" is pressed', async () => {
    mockedListForms.mockResolvedValue([]);

    render(<Home navigation={mockNavigation} route={mockRoute} />);

    await waitFor(() => {
      expect(screen.getByTestId('home-new-form-button')).toBeTruthy();
    }, ASYNC_TIMEOUT);

    fireEvent.press(screen.getByTestId('home-new-form-button'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('FormEntry', undefined);
  }, 20000);

  it('re-fetches the list on pull-to-refresh', async () => {
    mockedListForms.mockResolvedValue([formA]);

    render(<Home navigation={mockNavigation} route={mockRoute} />);

    await waitFor(() => {
      expect(screen.getByTestId('home-list')).toBeTruthy();
    }, ASYNC_TIMEOUT);

    mockedListForms.mockClear();
    mockedListForms.mockResolvedValue([formA, formB]);
    // `onRefresh` lives on the RefreshControl element itself, not on an
    // ancestor of the FlatList, so `fireEvent` needs to target it directly.
    fireEvent(screen.UNSAFE_getByType(RefreshControl), 'refresh');

    await waitFor(() => {
      expect(mockedListForms).toHaveBeenCalledWith('user-abc');
    }, ASYNC_TIMEOUT);
    await waitFor(() => {
      expect(screen.getByTestId('home-form-card-form-b')).toBeTruthy();
    }, ASYNC_TIMEOUT);
  }, 20000);

  it('re-fetches the list when the screen regains focus (e.g. after deleting a form elsewhere)', async () => {
    mockedListForms.mockResolvedValue([formA]);

    render(<Home navigation={mockNavigation} route={mockRoute} />);

    await waitFor(() => {
      expect(screen.getByTestId('home-form-card-form-a')).toBeTruthy();
    }, ASYNC_TIMEOUT);

    expect(mockNavigation.addListener).toHaveBeenCalledWith('focus', expect.any(Function));
    const focusHandler = (mockNavigation.addListener as jest.Mock).mock.calls.find(
      ([eventName]) => eventName === 'focus',
    )?.[1];

    mockedListForms.mockClear();
    mockedListForms.mockResolvedValue([]);
    focusHandler();

    await waitFor(() => {
      expect(mockedListForms).toHaveBeenCalledWith('user-abc');
    }, ASYNC_TIMEOUT);
    await waitFor(() => {
      expect(screen.queryByTestId('home-form-card-form-a')).toBeNull();
    }, ASYNC_TIMEOUT);
  }, 20000);

  describe('header', () => {
    it('shows "Meus formulários" as the header title', async () => {
      mockedListForms.mockResolvedValue([]);

      render(<Home navigation={mockNavigation} route={mockRoute} />);

      await waitFor(() => {
        expect(screen.getByText('Meus formulários')).toBeTruthy();
      }, ASYNC_TIMEOUT);
    }, 20000);

    it('renders a "Sair" action in the header that calls logout when pressed', async () => {
      mockedListForms.mockResolvedValue([]);

      render(<Home navigation={mockNavigation} route={mockRoute} />);

      await waitFor(() => {
        expect(screen.getByTestId('home-logout-button')).toBeTruthy();
      }, ASYNC_TIMEOUT);

      fireEvent.press(screen.getByTestId('home-logout-button'));

      expect(logout).toHaveBeenCalled();
    }, 20000);
  });

  describe('time filter', () => {
    it('opens a menu with the period presets when the filter icon is pressed', async () => {
      mockedListForms.mockResolvedValue([]);

      render(<Home navigation={mockNavigation} route={mockRoute} />);

      await waitFor(() => {
        expect(screen.getByTestId('home-filter-icon-button')).toBeTruthy();
      }, ASYNC_TIMEOUT);

      fireEvent.press(screen.getByTestId('home-filter-icon-button'));

      expect(screen.getByText('Todos')).toBeTruthy();
      expect(screen.getByText('Últimos 7 dias')).toBeTruthy();
      expect(screen.getByText('Últimos 30 dias')).toBeTruthy();
      // "Personalizado" needs its own date-range UI that doesn't fit this menu.
      expect(screen.queryByText('Personalizado')).toBeNull();
    }, 20000);

    it('filters the list and reloads it when a period is selected', async () => {
      const now = new Date();
      const recent = { ...formA, id: 'form-recent', createdAt: now };
      const old = {
        ...formB,
        id: 'form-old',
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30),
      };
      mockedListForms.mockResolvedValue([recent, old]);

      render(<Home navigation={mockNavigation} route={mockRoute} />);

      await waitFor(() => {
        expect(screen.getByTestId('home-form-card-form-old')).toBeTruthy();
      }, ASYNC_TIMEOUT);

      fireEvent.press(screen.getByTestId('home-filter-icon-button'));
      mockedListForms.mockClear();
      fireEvent.press(screen.getByText('Últimos 7 dias'));

      await waitFor(() => {
        expect(screen.queryByTestId('home-form-card-form-old')).toBeNull();
      }, ASYNC_TIMEOUT);
      expect(screen.getByTestId('home-form-card-form-recent')).toBeTruthy();
      await waitFor(() => {
        expect(mockedListForms).toHaveBeenCalledWith('user-abc');
      }, ASYNC_TIMEOUT);
    }, 20000);

    it('reloads the list when the filter menu is dismissed without selecting a period', async () => {
      mockedListForms.mockResolvedValue([formA]);

      render(<Home navigation={mockNavigation} route={mockRoute} />);

      await waitFor(() => {
        expect(screen.getByTestId('home-filter-icon-button')).toBeTruthy();
      }, ASYNC_TIMEOUT);

      fireEvent.press(screen.getByTestId('home-filter-icon-button'));
      mockedListForms.mockClear();
      // The Menu dismisses via a tap on its backdrop overlay — same
      // interaction a real user would perform to close it without picking
      // an item.
      fireEvent.press(screen.getByTestId('home-filter-menu-backdrop'));

      await waitFor(() => {
        expect(mockedListForms).toHaveBeenCalledWith('user-abc');
      }, ASYNC_TIMEOUT);
    }, 20000);

    it('shows the filtered-empty state when the period has no matching forms', async () => {
      const now = new Date();
      const old = {
        ...formA,
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 60),
      };
      mockedListForms.mockResolvedValue([old]);

      render(<Home navigation={mockNavigation} route={mockRoute} />);

      await waitFor(() => {
        expect(screen.getByTestId('home-filter-icon-button')).toBeTruthy();
      }, ASYNC_TIMEOUT);

      fireEvent.press(screen.getByTestId('home-filter-icon-button'));
      fireEvent.press(screen.getByText('Últimos 7 dias'));

      await waitFor(() => {
        expect(screen.getByTestId('home-empty-filtered-state')).toBeTruthy();
      }, ASYNC_TIMEOUT);
    }, 20000);
  });
});
