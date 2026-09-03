import { render, screen } from '../../test-utils';
import { AppStack } from './AppStack';

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: null, loading: false, logout: jest.fn() }),
}));

jest.mock('../../services/firebase', () => ({ db: {}, auth: {} }));

jest.mock('expo-print', () => ({ printToFileAsync: jest.fn() }));
jest.mock('expo-sharing', () => ({ shareAsync: jest.fn() }));

describe('AppStack', () => {
  it('renders Home as the initial route', () => {
    render(<AppStack />);

    expect(screen.getByTestId('home-loading')).toBeTruthy();
  });
});
