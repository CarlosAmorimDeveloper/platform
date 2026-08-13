import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fireEvent, render, screen } from '../../test-utils';
import { useAuth } from '../../context/AuthContext';
import type { AppStackParamList } from '../../navigation/types';
import { Home } from './Home';

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;

type HomeProps = NativeStackScreenProps<AppStackParamList, 'Home'>;

const mockNavigation = { navigate: jest.fn() } as unknown as HomeProps['navigation'];
const mockRoute = { key: 'Home', name: 'Home' } as unknown as HomeProps['route'];

describe('Home', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the logout button', () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false, logout: jest.fn() });

    render(<Home navigation={mockNavigation} route={mockRoute} />);

    expect(screen.getByTestId('home-logout-button')).toBeTruthy();
  });

  it('calls logout from AuthContext when the button is pressed', () => {
    const logout = jest.fn();
    mockedUseAuth.mockReturnValue({ user: null, loading: false, logout });

    render(<Home navigation={mockNavigation} route={mockRoute} />);
    fireEvent.press(screen.getByTestId('home-logout-button'));

    expect(logout).toHaveBeenCalled();
  });

  it('navigates to FormEntry when "Novo formulário" is pressed', () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false, logout: jest.fn() });

    render(<Home navigation={mockNavigation} route={mockRoute} />);
    fireEvent.press(screen.getByTestId('home-new-form-button'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('FormEntry', undefined);
  });
});
