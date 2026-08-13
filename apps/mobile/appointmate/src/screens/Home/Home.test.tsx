import { fireEvent, render, screen } from '../../test-utils';
import { useAuth } from '../../context/AuthContext';
import { Home } from './Home';

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;

describe('Home', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the logout button', () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false, logout: jest.fn() });

    render(<Home />);

    expect(screen.getByTestId('home-logout-button')).toBeTruthy();
  });

  it('calls logout from AuthContext when the button is pressed', () => {
    const logout = jest.fn();
    mockedUseAuth.mockReturnValue({ user: null, loading: false, logout });

    render(<Home />);
    fireEvent.press(screen.getByTestId('home-logout-button'));

    expect(logout).toHaveBeenCalled();
  });
});
